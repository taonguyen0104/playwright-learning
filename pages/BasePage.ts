import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // navigation

    async navigateTo(url: string) {
        await this.page.goto(url);
    }

    async waitForUrl(expectedUrl: string | RegExp) {
        await this.page.waitForURL(expectedUrl);
    }

    // common actions
    async click(locator: Locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    async fill(locator: Locator, value: string) {
        await locator.waitFor({ state: 'visible' });
        await locator.fill(value);
    }

    // assertions
    async verifyPageLoaded(expectedUrl: string | RegExp, pageTitle?: string) {
        await expect(this.page).toHaveURL(expectedUrl);
        if (pageTitle) {
            await expect(this.page).toHaveTitle(pageTitle);
            console.log(`Page loaded with title: ${pageTitle}`);
        }
    }   
}