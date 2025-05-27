import { Page } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async getCartItems(): Promise<string[]> {
    const items = this.page.locator('.cart_item .inventory_item_name');
    return await items.allTextContents();
  }

  async removeProductByName(name: string): Promise<void> {
    const product = this.page.locator('.cart_item').filter({ hasText: name });
    const removeButton = product.locator('button:has-text("Remove")');
    await removeButton.click();
  }
}