import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CardPage } from '../pages/CardPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const STORE_PASSWORD = 'Test123';

async function goToCheckout(page: import('@playwright/test').Page): Promise<CheckoutPage> {
  const loginPage = new LoginPage(page);
  await loginPage.goTo();
  await loginPage.enterPassword(STORE_PASSWORD);
  const productsPage = await loginPage.clickSubmit();
  const cardPage = await productsPage.addFirstProductToCart();
  return cardPage.buyNow();
}

test.describe('Checkout Page Test', () => {
  test('submit order shows payment error banner', async ({ page }) => {
    const email = 'testuser@email.com';
    const firstName = 'John';
    const lastName = 'Doe';
    const address = '123 Main Street';
    const city = 'San Jose';
    const postalCode = '96150';
    const phone = '2125551234';
    const state = 'California';

    const checkoutPage = await goToCheckout(page);
    await checkoutPage.fillCheckoutForm(email, firstName, lastName, address, city, postalCode, phone, state);
    await checkoutPage.completeOrder();

    const visible = await checkoutPage.isPaymentErrorVisible();
    expect(visible).toBe(true);
  });

  const missingFieldData: Array<{
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    state: string;
    expectedError: string;
    field: string;
  }> = [
    { email: '', firstName: 'John', lastName: 'Doe', address: '123 Main Street', city: 'San Jose', postalCode: '96150', phone: '2125551234', state: 'California', expectedError: 'Enter an email or phone number', field: 'email' },
    { email: 'testuser@email.com', firstName: 'John', lastName: '', address: '123 Main Street', city: 'San Jose', postalCode: '96150', phone: '2125551234', state: 'California', expectedError: 'Enter a last name', field: 'lastName' },
    { email: 'testuser@email.com', firstName: 'John', lastName: 'Doe', address: '', city: 'San Jose', postalCode: '96150', phone: '2125551234', state: 'California', expectedError: 'Enter an address', field: 'address' },
    { email: 'testuser@email.com', firstName: 'John', lastName: 'Doe', address: '123 Main Street', city: 'San Jose', postalCode: '', phone: '2125551234', state: 'California', expectedError: 'Enter a ZIP / postal code', field: 'postal' },
    { email: 'testuser@email.com', firstName: 'John', lastName: 'Doe', address: '123 Main Street', city: '', postalCode: '96150', phone: '2125551234', state: 'California', expectedError: 'Enter a city', field: 'city' },
    { email: 'testuser@email.com', firstName: 'John', lastName: 'Doe', address: '123 Main Street', city: 'San Jose', postalCode: '96150', phone: '', state: 'California', expectedError: 'Enter a phone number', field: 'phone' },
    { email: 'testuser@email.com', firstName: 'John', lastName: 'Doe', address: '123 Main Street', city: 'San Jose', postalCode: '96150', phone: '2125551234', state: '', expectedError: 'Select a state / province', field: 'state' },
  ];

  for (const row of missingFieldData) {
    test(`missing field shows error: ${row.field}`, async ({ page }) => {
      const checkoutPage = await goToCheckout(page);
      await checkoutPage.fillCheckoutForm(
        row.email,
        row.firstName,
        row.lastName,
        row.address,
        row.city,
        row.postalCode,
        row.phone,
        row.state
      );
      await checkoutPage.completeOrder();

      let errorText: string;
      switch (row.field) {
        case 'email':
          errorText = await checkoutPage.getErrorForEmail();
          break;
        case 'lastName':
          errorText = await checkoutPage.getErrorForLastName();
          break;
        case 'address':
          errorText = await checkoutPage.getErrorForAddress();
          break;
        case 'postal':
          errorText = await checkoutPage.getErrorForPostalCode();
          break;
        case 'city':
          errorText = await checkoutPage.getErrorForCity();
          break;
        case 'phone':
          errorText = await checkoutPage.getErrorForPhone();
          break;
        case 'state':
          errorText = await checkoutPage.getErrorForState();
          break;
        default:
          throw new Error('Unknown field: ' + row.field);
      }

      expect(errorText.trim()).toBe(row.expectedError);
    });
  }
});
