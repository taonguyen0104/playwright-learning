import { Page, Locator, expect } from "@playwright/test";
import { Product } from "../models/Product";
import { BasePage } from "./BasePage";

export class OverviewPage extends BasePage {
    private readonly ProductItems: Locator;
    private readonly finishButton: Locator;  
    private readonly completeHeader: Locator;
    private readonly pageTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.ProductItems = page.locator('[data-test="inventory-item"]');
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.completeHeader = page.getByRole('heading', { name: 'Thank you for your order!' });
        this.pageTitle = page.locator('[data-test="title"]');
    }

    async verifyPageLoaded() {
        await expect(this.page).toHaveURL(/checkout-step-two/);
        await expect(this.pageTitle).toHaveText('Checkout: Overview');
    }

    async getProductItemsCount(): Promise<number> {
        return await this.ProductItems.count();
    }

    async getOverviewItems(): Promise<Product[]> {
        const count = await this.ProductItems.count();
        const itemsData: Product[] = [];

        for (let i = 0; i < count; i++) {
            const item = this.ProductItems.nth(i);
            itemsData.push({
                name: (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim() ?? null,
                price: (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim() ?? null,
                quantity: (await item.locator('[data-test="item-quantity"]').textContent())?.trim() ?? null,
            });
        }   
        return itemsData;
    }

     async finishOrder() {
        await expect(this.finishButton).toBeVisible();
        await expect(this.finishButton).toBeEnabled();
        await this.click(this.finishButton);
    }

    async verifyOrderCompleted() {
        await expect(this.page).toHaveURL(/checkout-complete/);
        await expect(this.completeHeader).toBeVisible();
    }
}


