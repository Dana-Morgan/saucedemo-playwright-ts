import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../utils/testData';

test.describe.parallel(' Login Feature', () => {
  test.setTimeout(200000);

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test(' Login with standard_user should succeed', async () => {
    await loginPage.login(users.standard, users.password);
    expect(await loginPage.isOnInventoryPage()).toBeTruthy();

  });

  test(' Login with locked_out_user should fail with locked error', async () => {
    await loginPage.login(users.locked, users.password);
    await expect(await loginPage.getErrorMessage()).toContainText('locked out');
  });

  test('Login with problem_user should succeed (but may cause UI issues)', async ({ page }) => {
    await loginPage.login(users.problem, users.password);
    expect(await loginPage.isOnInventoryPage()).toBeTruthy();
    expect(await page.screenshot()).toMatchSnapshot('problem_user_inventory.png');
  });


  test(' Login with performance_glitch_user should succeed (but might be slow)', async () => {
    await loginPage.login(users.glitch, users.password);
    expect(await loginPage.isOnInventoryPage()).toBeTruthy();
  });

  test(' Login with visual_user should succeed (but may affect visuals)', async ({ page }) => {
    loginPage = new LoginPage(page);

    await loginPage.login(users.visual, users.password);
    expect(await loginPage.isOnInventoryPage()).toBeTruthy();
    expect(await page.screenshot()).toMatchSnapshot('visual_user_inventory.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test(' Login with invalid username should fail', async () => {
    await loginPage.login(users.invalid, users.password);
    await expect(await loginPage.getErrorMessage()).toContainText('Username and password do not match');
  });

  test('Login with wrong password should fail', async () => {
    await loginPage.login(users.standard, users.wrongPassword);
    await expect(await loginPage.getErrorMessage()).toContainText('Username and password do not match');
  });
});
