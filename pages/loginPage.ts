import { Page, Locator } from "@playwright/test";   

export class LoginPage {
    private readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;  

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: 'username' });
        this.passwordInput = page.getByRole('textbox', { name: 'password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }   

    async goto() {
        await this.page.goto('https://www.saucedemo.com/');
    }
    
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
