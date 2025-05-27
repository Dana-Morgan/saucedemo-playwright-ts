import { test, expect, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { users } from '../utils/testData';

test.describe('Sort Feature', () => {
  let context: BrowserContext;
  let page: Page;
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // تسجيل الدخول
    await loginPage.goto();
    await loginPage.login(users.standard, users.password);

    const isLoggedIn = await loginPage.isOnInventoryPage();
    if (!isLoggedIn) {
      throw new Error('Login failed: Not on inventory page');
    }
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('Sort items A-Z', async () => {
    await inventoryPage.sortBy('az');
    const namesAZ = await inventoryPage.getItemNames();
    const sortedNamesAZ = [...namesAZ].sort((a, b) => a.localeCompare(b));

    console.log('Actual A-Z names:', namesAZ);
    console.log('Expected sorted A-Z:', sortedNamesAZ);

    expect(namesAZ).toEqual(sortedNamesAZ);
  });

  test('Sort items High to Low (by price)', async () => {
    await inventoryPage.sortBy('hilo');
    const pricesHighToLow = await inventoryPage.getItemPrices();
    const sortedPricesHighToLow = [...pricesHighToLow].sort((a, b) => b - a);

    console.log('Actual High to Low prices:', pricesHighToLow);
    console.log('Expected sorted High to Low:', sortedPricesHighToLow);

    expect(pricesHighToLow).toEqual(sortedPricesHighToLow);
  });
});
