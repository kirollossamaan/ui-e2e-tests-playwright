import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CardPage } from '../pages/CardPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Card Page Test', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
  });

  test('buy now opens checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const storePassword = 'Test123';

    await loginPage.enterPassword(storePassword);
    const productsPage = await loginPage.clickSubmit();
    const cardPage = await productsPage.addFirstProductToCart();

    const checkoutPage = await cardPage.buyNow();
    expect(checkoutPage).toBeDefined();
  });
});
