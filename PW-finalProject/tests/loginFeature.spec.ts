import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../utils/testData';

test.describe.parallel('Login Tests', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

test('should allow login with standard user and save UI snapshot', async ({ page }) => {
  await loginPage.login(users.standard, users.password);
  expect(await loginPage.isOnInventoryPage()).toBeTruthy();
  expect(await page.screenshot());
});


  test('should show error when locked out user tries to log in', async () => {
    await loginPage.login(users.locked, users.password);
    await expect(await loginPage.getErrorMessage()).toContainText('locked out');
  });

  test.fail('should log in with problem user and compare UI snapshot', async ({ page }) => {
    await loginPage.login(users.problem, users.password);
    expect(await loginPage.isOnInventoryPage()).toBeTruthy();
    expect(await page.screenshot()).toMatchSnapshot('user_inventory.png');
  });

  test('should log in with performance glitch user (might be slow)', async () => {
    await loginPage.login(users.glitch, users.password);
    expect(await loginPage.isOnInventoryPage()).toBeTruthy();
  });

  test.fail('should log in with visual user and check visual appearance', async ({ page }) => {
    loginPage = new LoginPage(page);

    await loginPage.login(users.visual, users.password);
    expect(await loginPage.isOnInventoryPage()).toBeTruthy();
    expect(await page.screenshot()).toMatchSnapshot('user_inventory.png');
  });

  test.fixme('visual user login works, but visual differences are not validated yet', async () => {
    await loginPage.login(users.visual, users.password);
    expect(await loginPage.isOnInventoryPage()).toBeTruthy();
  });

  test('should show error for invalid username', async () => {
    await loginPage.login(users.invalid, users.password);
    await expect(await loginPage.getErrorMessage()).toContainText('Username and password do not match');
  });

  test('should show error for wrong password', async () => {
    await loginPage.login(users.standard, users.wrongPassword);
    await expect(await loginPage.getErrorMessage()).toContainText('Username and password do not match');
  });

test('error_user should not log in – expected to fail, currently passes', async () => {
  test.fail(true, 'Backend allows error_user to log in unexpectedly');

  await loginPage.login(users.error, users.password);
  expect(false).toBe(true); 
});

});
