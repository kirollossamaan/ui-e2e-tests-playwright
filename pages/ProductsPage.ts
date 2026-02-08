import { Page, Locator } from '@playwright/test';
import { CardPage } from './CardPage';

/**
 * Page object for the catalog / products list (home page).
 * URL: https://kib-connect-demo-store-4.myshopify.com/
 * Products live in [data-testid="resource-list-grid"]; each card has a.product-card__link with product name.
 */
export class ProductsPage {
  constructor(private readonly page: Page) {}

  /** Main product grid (excludes header drawer). */
  private readonly productGrid = this.page.locator('[data-testid="resource-list-grid"]');
  /** Product links: <a class="product-card__link" href="/products/..."> with visually-hidden product name. */
  private readonly productLinks = this.productGrid.locator('a.product-card__link[href*="/products/"]');

  async getProductsList(): Promise<Locator[]> {
    await this.productLinks.first().waitFor({ state: 'visible' });
    return this.productLinks.all();
  }

  /** Returns the product link (by accessible name); throws if not found. */
  async getProduct(productName: string): Promise<Locator> {
    const productLink = this.productGrid.getByRole('link', { name: productName });
    const count = await productLink.count();
    if (count === 0) throw new Error(`Product "${productName}" not found`);
    return productLink.first();
  }

  /** Clicks the product link and waits for navigation to the product page (e.g. /products/test-product). */
  async addToCart(productName: string): Promise<CardPage> {
    const productLink = await this.getProduct(productName);
    await Promise.all([
      this.page.waitForURL(/\/products\//),
      productLink.click(),
    ]);
    return new CardPage(this.page);
  }

  /** Clicks the first product in the grid and waits for the product page. If that product is sold out, follows "You may also like" to an in-stock product (e.g. Test Product). */
  async addFirstProductToCart(): Promise<CardPage> {
    const firstLink = this.productLinks.first();
    await firstLink.waitFor({ state: 'visible' });
    await firstLink.click({ force: true });
    await this.page.waitForURL(/\/products\//);

    const soldOutBtn = this.page.getByRole('button', { name: 'Sold out' });
    const isSoldOut = await soldOutBtn.isVisible().catch(() => false);
    if (isSoldOut) {
      const inStockLink = this.page.getByRole('link', { name: 'Test Product' }).first();
      await inStockLink.waitFor({ state: 'visible' });
      await inStockLink.click({ force: true });
      await this.page.waitForURL(/\/products\/test-product/);
    }

    return new CardPage(this.page);
  }
}
