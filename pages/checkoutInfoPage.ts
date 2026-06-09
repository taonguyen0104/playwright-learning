import { Page, Locator } from "@playwright/test";

export class CheckoutInfoPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToCheckout() {
        await this.page.getByRole('button', { name: 'Checkout' }).click();
    }

    async fillCheckoutInformation(firstName: string, lastName: string, zip: string) {
        await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
        await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
        await this.page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill(zip);
        await this.page.getByRole('button', { name: 'Continue' }).click();
    }
}