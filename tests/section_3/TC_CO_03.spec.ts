import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { ProductPage } from '../../pages/productPage';
import { CartPage } from '../../pages/cartPage';
import { CheckoutInfoPage } from '../../pages/checkoutInfoPage';
import { OverviewPage } from '../../pages/overviewPage';
import { Product } from '../../models/Product';

test('Verify that the cart information remains consistent from the Cart page to the Overview page', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);  
    const cartPage = new CartPage(page);
    const checkoutInfoPage = new CheckoutInfoPage(page);
    const overviewPage = new OverviewPage(page);

    let cartData: Product[];
    let overviewData: Product[];

    await test.step('Login with standard user', async () => {
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory/);
    });

    await test.step('Add products to cart', async () => {
        await productPage.addProductToCart('Sauce Labs Backpack');
        await productPage.addProductToCart('Sauce Labs Bolt T-Shirt');
        await productPage.goToCart();
        await expect(page).toHaveURL(/cart/);
    });

    await test.step('Collect product data from cart page', async () => {
        cartData = await cartPage.getCartItems();
        expect(cartData.length).toBeGreaterThan(0);
    });

    await test.step('Proceed to checkout', async () => {
        await checkoutInfoPage.navigateToCheckout();
        await checkoutInfoPage.fillCheckoutInformation('John', 'Doe', '12345');
        await expect(page).toHaveURL(/checkout-step-two/);
    });

    await test.step('Collect product data from overview page', async () => {
        overviewData = await overviewPage.getOverviewItems();
    });

    await test.step('Verify data consistency between Cart and Overview pages', async () => {
        expect(cartData).toEqual(overviewData);
    });

    await test.step('Finish order', async () => {
        await overviewPage.finishOrder();

        await expect(page).toHaveURL(/checkout-complete/);
        await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  });

});


