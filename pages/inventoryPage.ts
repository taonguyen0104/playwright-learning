import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class InventoryPage extends BasePage {

    private readonly cartBadge: Locator;
    private readonly shoppingCartLink: Locator;
    private readonly pageTitle: Locator;

    constructor(page: Page) {
        super(page);

        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
        this.pageTitle = page.locator('[data-test="title"]');
    }

    async verifyPageLoaded() {
        await expect(this.page).toHaveURL(/inventory/);
        await expect(this.pageTitle).toHaveText('Products');
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

    async verifyCartBadge(count: string | number) {
        await expect(this.cartBadge).toHaveText(count.toString());
    }

    async goToCart() {
        await this.shoppingCartLink.click();
    }
}