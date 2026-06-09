import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { ProductPage } from '../../pages/productPage';
import { CartPage } from '../../pages/cartPage';
import { CheckoutInfoPage } from '../../pages/checkoutInfoPage';
import { OverviewPage } from '../../pages/overviewPage';
import { CartItem } from '../../pages/cartPage';

test('Verify that the cart information remains consistent from the Cart page to the Overview page', async ({ page }) => {

    let cartData: CartItem[] = [];
    let overviewData: CartItem[] = [];

    await test.step('Login with standard user', async () => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory/);
    });

    await test.step('Add products to cart', async () => {
        const productPage = new ProductPage(page);  
        await productPage.addProductToCart('Sauce Labs Backpack');
        await productPage.addProductToCart('Sauce Labs Bolt T-Shirt');
        await productPage.goToCart();
        await expect(page).toHaveURL(/cart/);
    });

    await test.step('Get all products in cart', async () => {
        const cartPage = new CartPage(page);
        expect(await cartPage.getCartItemsCount()).toBe(2);
        cartData = await cartPage.getCartItems();
    });

    await test.step('Checkout and fill information', async () => {
        const checkoutInfoPage = new CheckoutInfoPage(page);
        await checkoutInfoPage.navigateToCheckout();
        await checkoutInfoPage.fillCheckoutInformation('John', 'Doe', '12345');
        await expect(page).toHaveURL(/checkout-step-two/);
    });

    await test.step('Get all products on Overview page', async () => {
        const overviewPage = new OverviewPage(page);
        overviewData = await overviewPage.getOverviewItems();
        
    });

    await test.step('Verify data consistency between Cart and Overview pages', async () => {
        expect(cartData).toEqual(overviewData);
        console.log('Cart Data 1:', cartData);
        console.log('Overview Data 1:', overviewData);

    });

    await test.step('Finish order', async () => {
        const overviewPage = new OverviewPage(page);    
        await overviewPage.finishOrder();

        await expect(page).toHaveURL(/checkout-complete/);
        await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

  });


});


