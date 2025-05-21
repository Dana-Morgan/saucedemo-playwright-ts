import { test, expect } from '@playwright/test';

test('Add product to cart and check contents then logout', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');

  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'before-login-click.png', fullPage: true });

  const loginBtn = page.locator('[data-test="login-button"]');
  await loginBtn.scrollIntoViewIfNeeded();
  await loginBtn.hover();
  await loginBtn.click();

  await expect(page).toHaveURL(/.*inventory.html/);

  await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();

  await page.locator('.shopping_cart_link').click();

  await expect(page).toHaveURL(/.*cart.html/);

  const cartItem = page.locator('.inventory_item_name');
  await expect(cartItem).toContainText('Sauce Labs Onesie');

  await page.locator('#react-burger-menu-btn').click();
  await page.locator('#logout_sidebar_link').click();

  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
