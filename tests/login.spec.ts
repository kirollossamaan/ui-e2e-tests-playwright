import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Login Page Test', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
  });

  test('valid password shows products', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const storePassword = 'Test123';

    await loginPage.enterPassword(storePassword);
    const productsPage = await loginPage.clickSubmit();

    const list = await productsPage.getProductsList();
    expect(list.length).toBeGreaterThan(0);
  });

  test('invalid password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const wrongPassword = 'WrongPassword123';

    await loginPage.enterPassword(wrongPassword);
    await loginPage.clickSubmit();

    const errorText = await loginPage.getErrorMessage();
    expect(errorText.toLowerCase()).toContain('incorrect');
  });
});
