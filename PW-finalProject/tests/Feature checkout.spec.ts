import { test, expect, BrowserContext, Page } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';
import { users } from '../utils/testData';

test.describe('Checkout Feature', () => {
  let context: BrowserContext;
  let page: Page;
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard, users.password);
    expect(await loginPage.isOnInventoryPage()).toBeTruthy();
  });

  test.afterAll(async () => {
    await context.close();
  });

  test.beforeEach(async () => {

    if (!(await loginPage.isOnInventoryPage())) {
      await loginPage.goto();
      await loginPage.login(users.standard, users.password);
      expect(await loginPage.isOnInventoryPage()).toBeTruthy();
    }
  });

  test('Complete checkout process successfully', async () => {
    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await checkoutPage.startCheckout();
    await checkoutPage.fillCheckoutInfo('Suzan', 'Aqraa', '12345');
    await checkoutPage.finishCheckout();

    expect(await checkoutPage.isCheckoutComplete()).toBe(true);
  });

  test('Should show error if any checkout info field is empty', async () => {
    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await checkoutPage.startCheckout();

    await checkoutPage.fillCheckoutInfo('Suzan', '', '12345');

    const errorLocator = checkoutPage.getErrorMessage();
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText('Last Name is required');
  });
});
