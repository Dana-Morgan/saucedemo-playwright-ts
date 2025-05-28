import { test, expect, Page, BrowserContext } from '@playwright/test'; 
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/inventoryPage';
import dotenv from 'dotenv';

dotenv.config();

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

    await loginPage.goto();
    await loginPage.login(process.env.SAUCEDEMO_USER!, process.env.SAUCEDEMO_PASS!);

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

  test('Sort items Z-A', async () => {
    await inventoryPage.sortBy('za');
    const namesZA = await inventoryPage.getItemNames();
    const sortedNamesZA = [...namesZA].sort((a, b) => b.localeCompare(a));

    console.log('Actual Z-A names:', namesZA);
    console.log('Expected sorted Z-A:', sortedNamesZA);

    expect(namesZA).toEqual(sortedNamesZA);
  });

  test('Sort items High to Low (by price)', async () => {
    await inventoryPage.sortBy('hilo');
    const pricesHighToLow = await inventoryPage.getItemPrices();
    const sortedPricesHighToLow = [...pricesHighToLow].sort((a, b) => b - a);

    console.log('Actual High to Low prices:', pricesHighToLow);
    console.log('Expected sorted High to Low:', sortedPricesHighToLow);

    expect(pricesHighToLow).toEqual(sortedPricesHighToLow);
  });

  test('Sort items Low to High (by price)', async () => {
    await inventoryPage.sortBy('lohi');
    const pricesLowToHigh = await inventoryPage.getItemPrices();
    const sortedPricesLowToHigh = [...pricesLowToHigh].sort((a, b) => a - b);

    console.log('Actual Low to High prices:', pricesLowToHigh);
    console.log('Expected sorted Low to High:', sortedPricesLowToHigh);

    expect(pricesLowToHigh).toEqual(sortedPricesLowToHigh);
  });
});
