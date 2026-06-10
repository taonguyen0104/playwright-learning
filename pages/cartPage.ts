import { Page, Locator, expect } from "@playwright/test";
import { Product } from "../models/Product";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage{
    private readonly cartItems: Locator;
    private readonly productName: Locator;
    private readonly productPrice: Locator;
    private readonly productQuantity: Locator;  
    private readonly checkoutButton: Locator;
    private readonly pageTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.locator('[data-test="title"]');
        this.cartItems = page.locator('[data-test="inventory-item"]');
        this.productName = page.locator('[data-test="inventory-item-name"]');
        this.productPrice = page.locator('[data-test="inventory-item-price"]');
        this.productQuantity = page.locator('[data-test="item-quantity"]');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }
    
    async verifyPageLoaded() {
        await expect(this.page).toHaveURL(/cart/);
        await expect(this.pageTitle).toHaveText('Your Cart');
    }

    getCartItemsCount(): Promise<number> {
        return this.cartItems.count();
    }

    async getCartItems(): Promise<Product[]> {
        const count = await this.cartItems.count();
        const itemsData: Product[] = [];

        for (let i = 0; i < count; i++) {
            const item = this.cartItems.nth(i);
            itemsData.push({
                name: (await this.productName.nth(i).textContent())?.trim() ?? null,
                price: (await this.productPrice.nth(i).textContent())?.trim() ?? null,
                quantity: (await this.productQuantity.nth(i).textContent())?.trim() ?? null,
            });
        }   
        return itemsData;
    }

     async proceedToCheckout() {
        await this.click(this.checkoutButton);
        await this.waitForUrl(/checkout-step-one/);
    }

}