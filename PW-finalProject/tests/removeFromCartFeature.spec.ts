import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CartPage } from '../pages/cartPage';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Remove from Cart Feature', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(process.env.SAUCEDEMO_USER!, process.env.SAUCEDEMO_PASS!);
    expect(await loginPage.isOnInventoryPage()).toBeTruthy();
  });

  test('Add and then remove a product from cart', async () => {
    const productName = 'Sauce Labs Backpack';

    await inventoryPage.addProductByName(productName);
    await inventoryPage.goToCart();

    let cartItems = await cartPage.getCartItems();
    expect(cartItems).toContain(productName);

    await cartPage.removeProductByName(productName);

    cartItems = await cartPage.getCartItems();
    expect(cartItems).not.toContain(productName);
  });
});