import { Page, Locator, expect } from "@playwright/test";
import { Product } from "../models/Product";

export class OverviewPage {
    private readonly page: Page;
    private readonly ProductItems: Locator;
    private readonly finishButton: Locator;  

    constructor(page: Page) {
        this.page = page;
        this.ProductItems = page.locator('[data-test="inventory-item"]');
        this.finishButton = page.getByRole('button', { name: 'Finish' });
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
        await this.finishButton.click();
    }
}


