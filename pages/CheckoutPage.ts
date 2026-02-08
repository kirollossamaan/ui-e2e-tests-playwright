import { Page } from '@playwright/test';

/**
 * Page object for Shopify checkout form and validation errors.
 * URL: https://kib-connect-demo-store-4.myshopify.com/checkouts/cn/.../en-us
 * Form: Contact (email), Delivery (name, address, city, state, ZIP, phone), Payment, Complete order.
 */
export class CheckoutPage {
  constructor(private readonly page: Page) {}

  /** Exclude hidden autofill dupes (Shopify checkout adds aria-hidden inputs). */
  private readonly visible = (name: string) => this.page.locator(`input[name="${name}"]:not([aria-hidden="true"])`);

  private readonly emailInput = this.page.locator('#email');
  private readonly firstNameInput = this.visible('firstName');
  private readonly lastNameInput = this.visible('lastName');
  private readonly addressInput = this.visible('address1');
  private readonly cityInput = this.visible('city');
  private readonly postalCodeInput = this.visible('postalCode');
  private readonly phoneInput = this.visible('phone');
  /** Complete order button: id="checkout-pay-button" */
  private readonly completeOrderButton = this.page.locator('#checkout-pay-button');
  private readonly paymentErrorBanner = this.page.locator('#PaymentErrorBanner');
  private readonly errorForEmail = this.page.locator('#error-for-email');
  private readonly errorForLastName = this.page.locator('#error-for-TextField1');
  private readonly errorForAddress = this.page.locator('#error-for-shipping-address1');
  private readonly errorForCity = this.page.locator('#error-for-TextField3');
  private readonly errorForState = this.page.locator('#error-for-Select1');
  private readonly errorForPostalCode = this.page.locator('#error-for-TextField4');
  private readonly errorForPhone = this.page.locator('#error-for-TextField5');

  async fillCheckoutForm(
    email: string,
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    postalCode: string,
    phone: string,
    state: string
  ): Promise<void> {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.fill(email);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.addressInput.fill(address);
    await this.cityInput.fill(city);
    await this.postalCodeInput.fill(postalCode);
    await this.phoneInput.fill(phone);
    if (state) {
      const selectEl = this.page.locator('select[name="zone"]').first();
      if (await selectEl.isVisible().catch(() => false)) {
        await selectEl.selectOption({ label: state });
      } else {
        await this.page.locator('input[name="zone"]').first().fill(state);
      }
    }
  }

  async completeOrder(): Promise<void> {
    await this.completeOrderButton.waitFor({ state: 'visible' });
    await this.completeOrderButton.click();
  }

  async isPaymentErrorVisible(): Promise<boolean> {
    await this.paymentErrorBanner.waitFor({ state: 'visible' });
    return this.paymentErrorBanner.isVisible();
  }

  async getErrorForEmail(): Promise<string> {
    await this.errorForEmail.waitFor({ state: 'visible' });
    return (await this.errorForEmail.textContent()) ?? '';
  }

  async getErrorForLastName(): Promise<string> {
    await this.errorForLastName.waitFor({ state: 'visible' });
    return (await this.errorForLastName.textContent()) ?? '';
  }

  async getErrorForAddress(): Promise<string> {
    await this.errorForAddress.waitFor({ state: 'visible' });
    return (await this.errorForAddress.textContent()) ?? '';
  }

  async getErrorForCity(): Promise<string> {
    await this.errorForCity.waitFor({ state: 'visible' });
    return (await this.errorForCity.textContent()) ?? '';
  }

  async getErrorForState(): Promise<string> {
    await this.errorForState.waitFor({ state: 'visible' });
    return (await this.errorForState.textContent()) ?? '';
  }

  async getErrorForPostalCode(): Promise<string> {
    await this.errorForPostalCode.waitFor({ state: 'visible' });
    return (await this.errorForPostalCode.textContent()) ?? '';
  }

  async getErrorForPhone(): Promise<string> {
    await this.errorForPhone.waitFor({ state: 'visible' });
    return (await this.errorForPhone.textContent()) ?? '';
  }
}
