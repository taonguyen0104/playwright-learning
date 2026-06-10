import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutInfoPage extends BasePage {

    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly zipInput: Locator;
    private readonly continueButton: Locator;
    private readonly pageTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.locator('[data-test="title"]');
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.zipInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
    }

    async verifyPageLoaded() {
        await expect(this.page).toHaveURL(/checkout-step-one/);
        await expect(this.pageTitle).toHaveText('Checkout: Your Information');
    }

    async fillCheckoutInformation(firstName: string, lastName: string, zip: string) {
        await this.fill(this.firstNameInput, firstName);
        await this.fill(this.lastNameInput, lastName);
        await this.fill(this.zipInput, zip);
        await this.click(this.continueButton);
    }
}