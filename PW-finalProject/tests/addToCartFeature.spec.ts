import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import { users } from '../utils/testData';

test.describe('Add to Cart Feature', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let context;
  let page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard, users.password);
    expect(await loginPage.isOnInventoryPage()).toBeTruthy();
  });

  test.afterAll(async () => {
    await context.close(); 
  });

  test('Add multiple products to cart and verify them', async () => {
    const productsToAdd = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Onesie',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
    ];

    for (const productName of productsToAdd) {
      await inventoryPage.addProductByName(productName);
    }

    await inventoryPage.goToCart();

    const cartItems = await cartPage.getCartItems();

    expect(cartItems.length).toBe(productsToAdd.length);
    for (const product of productsToAdd) {
      expect(cartItems).toContain(product);
    }
  });
});