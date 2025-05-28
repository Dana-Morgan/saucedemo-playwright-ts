import { Page } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    const url = process.env.SAUCEDEMO_URL;
    if (!url) throw new Error("SAUCEDEMO_URL is not defined in the .env file");
    await this.page.goto(url);
  }

  async login(username: string, password: string) {
    await this.page.fill('#user-name', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
  }

  async getErrorMessage() {
    return this.page.locator('[data-test="error"]');
  }

  async isOnInventoryPage() {
    return this.page.url().includes('/inventory.html');
  }
}
