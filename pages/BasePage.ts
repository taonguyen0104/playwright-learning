import { Page, Locator } from '@playwright/test';
import { Product } from '../models/Product';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // navigation

    async navigateTo(url: string) {
        await this.page.goto(url);
    }

    async waitForUrl(expectedUrl: string) {
        await this.page.waitForURL(expectedUrl);
    }

    // common actions

    async click(locator: Locator) {
        await locator.click();
    }

    async fill(locator: Locator, value: string) {
        await locator.fill(value);
    }

    // assertions
}