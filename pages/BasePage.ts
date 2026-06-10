import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    private readonly defaultTimeout = 10000;

    constructor(page: Page) {
        this.page = page;
    }

    // navigation

    async navigateTo(url: string) {
        await this.page.goto(url, { waitUntil: 'networkidle', timeout: this.defaultTimeout });
    }

    async waitForUrl(expectedUrl: string | RegExp) {
        await this.page.waitForURL(expectedUrl, { timeout: this.defaultTimeout });
    }

    // common actions
    async click(locator: Locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    async waitForVisible(locator: Locator) {
        await expect(locator).toBeVisible();
    }

    async fill(locator: Locator, value: string) {
        await locator.waitFor({ state: 'visible', timeout: this.defaultTimeout });
        await locator.clear();
        await locator.fill(value);
    }

    async waitForElement(locator: Locator, state: 'visible' | 'hidden' | 'attached' | 'detached' = 'visible') {
        await locator.waitFor({ state, timeout: this.defaultTimeout });
    }

    // assertions
    async verifyPageLoaded(expectedUrl: string | RegExp, pageTitle?: string) {
        await expect(this.page).toHaveURL(expectedUrl, { timeout: this.defaultTimeout });
        if (pageTitle) {
            await expect(this.page).toHaveTitle(pageTitle, { timeout: this.defaultTimeout });
            console.log(`Page loaded with title: ${pageTitle}`);
        }
    }
}