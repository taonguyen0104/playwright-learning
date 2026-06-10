import { Page, Locator } from "@playwright/test";   
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;  

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByRole('textbox', { name: 'username' });
        this.passwordInput = page.getByRole('textbox', { name: 'password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }   

    async goto() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async verifyPageLoaded() {
        await this.waitForUrl(/saucedemo\.com/);
        await this.waitForVisible(this.usernameInput);
    }
    
    async login(username: string, password: string) {
        await this.fill(this.usernameInput, username);
        await this.fill(this.passwordInput, password);
        await this.click(this.loginButton);
    }
}
