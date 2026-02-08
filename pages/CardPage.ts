import { Page } from '@playwright/test';
import { CheckoutPage } from './CheckoutPage';

/**
 * Page object for the product detail / card page (single product, "Buy it now").
 * URL: https://kib-connect-demo-store-4.myshopify.com/products/test-product?variant=...
 * Main product block: [data-testid="product-information-details"]; Buy it now lives in .accelerated-checkout-block.
 */
export class CardPage {
  constructor(private readonly page: Page) {}

  /** Main product form area (excludes "You may also like" recommendations). */
  private readonly productDetails = this.page.locator('[data-testid="product-information-details"]');
  /** Buy it now / Buy now button (theme text may vary). */
  private readonly buyNowButton = this.productDetails.getByRole('button', { name: /Buy\s*(it\s*)?now/i });

  async buyNow(): Promise<CheckoutPage> {
    await this.buyNowButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.buyNowButton.click();
    return new CheckoutPage(this.page);
  }
}
