import { Page } from '@playwright/test';
import { ProductsPage } from './ProductsPage';

/**
 * Page object for the password gate / login screen.
 * URL: https://kib-connect-demo-store-4.myshopify.com/password
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  /** <input type="password" id="password" name="password"> */
  private readonly passwordInput = this.page.locator('#password');
  /** <button type="submit">Enter</button> */
  private readonly submitButton = this.page.getByRole('button', { name: 'Enter' });
  /** Error text appears inside <div class="error-container"> */
  private readonly errorContainer = this.page.locator('.error-container');

  async goTo(): Promise<void> {
    await this.page.goto('/password');
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickSubmit(): Promise<ProductsPage> {
    await this.submitButton.click();
    return new ProductsPage(this.page);
  }

  async getErrorMessage(): Promise<string> {
    await this.errorContainer.waitFor({ state: 'visible' });
    const text = await this.errorContainer.textContent();
    return (text ?? '').trim();
  }
}
