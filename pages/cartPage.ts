import { Page, Locator } from "@playwright/test";

export type CartItem = {
  name: string | null;
  price: string | null;
  quantity: string | null;
};

export class CartPage {
    private readonly page: Page;
    private readonly cartItems: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('[data-test="inventory-item"]');
    }

    async getCartItemsCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async getCartItems(): Promise<CartItem[]> {
        const count = await this.cartItems.count();
        const itemsData: CartItem[] = [];

        for (let i = 0; i < count; i++) {
            const item = this.cartItems.nth(i);
            itemsData.push({
                name: (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim() ?? null,
                price: (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim() ?? null,
                quantity: (await item.locator('[data-test="item-quantity"]').textContent())?.trim() ?? null,
            });
        }   
        return itemsData;
    }
}