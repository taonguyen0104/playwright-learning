import { Page, Locator, expect } from "@playwright/test";

export class ProductPage {

    private readonly page: Page;
    private readonly cartBadge: Locator;
    private readonly shoppingCartLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    }

    private getInventoryItem(productName: string): Locator {
        return this.page.locator('[data-test="inventory-item"]')
            .filter({ hasText: productName });
    }

    private getAddToCartButton(productName: string): Locator {
        return this.getInventoryItem(productName).getByRole('button', { name: 'Add to cart' });
    }

    async addProductToCart(productName: string) {

        const item = this.getInventoryItem(productName);
        const addBtn = this.getAddToCartButton(productName);

        await expect(item).toHaveCount(1);
        await expect(addBtn).toBeVisible();

        await addBtn.click();
    }

    async verifyCartBadge(count: string) {
        await expect(this.cartBadge).toHaveText(count);
    }

    async goToCart() {
        await this.shoppingCartLink.click();
    }
}