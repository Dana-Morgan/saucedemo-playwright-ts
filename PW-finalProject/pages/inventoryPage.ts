export class InventoryPage {
  private sortSelect = '[data-test="product-sort-container"]';

  constructor(private page: any) {}

  async addProductByName(productName: string) {
    const formattedName = productName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const selector = `[data-test="add-to-cart-${formattedName}"]`;

    await this.page.waitForSelector(selector, { state: 'visible' });
    await this.page.click(selector);
  }

  async goToCart() {
    await this.page.click('.shopping_cart_link');
  }

  async sortBy(option: string) {
    await this.page.selectOption(this.sortSelect, option);
  }

  async getItemNames(): Promise<string[]> {
    const names = await this.page.locator('.inventory_item_name').allTextContents();
    return names.map(n => n.trim());
  }

  async getItemPrices(): Promise<number[]> {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '').trim()));
  }
}
