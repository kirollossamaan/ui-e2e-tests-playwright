import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Products Page Test', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
  });

  test('products list visible after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const storePassword = 'Test123';

    await loginPage.enterPassword(storePassword);
    const productsPage = await loginPage.clickSubmit();

    const list = await productsPage.getProductsList();
    expect(list.length).toBeGreaterThan(0);
  });

  test('getProduct throws for missing product', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const storePassword = 'Test123';

    await loginPage.enterPassword(storePassword);
    const productsPage = await loginPage.clickSubmit();

    await expect(
      productsPage.getProduct('Non Existing Product')
    ).rejects.toThrow('Product "Non Existing Product" not found');
  });
});
