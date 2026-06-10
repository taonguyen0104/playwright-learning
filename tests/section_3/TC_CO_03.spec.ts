import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { InventoryPage } from '../../pages/inventoryPage';
import { CartPage } from '../../pages/cartPage';
import { CheckoutInfoPage } from '../../pages/checkoutInfoPage';
import { OverviewPage } from '../../pages/overviewPage';
import { Product } from '../../models/Product';

test('Verify that the cart information remains consistent from the Cart page to the Overview page', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfoPage = new CheckoutInfoPage(page);
    const overviewPage = new OverviewPage(page);
    const customer = {
        firstName: 'John',
        lastName: 'Doe',
        zipCode: '12345'
    };
    const TEST_ACCOUNT = {
        username: 'standard_user',
        password: 'secret_sauce'
    };

    let cartData: Product[] = [];
    let overviewData: Product[] = [];

    await test.step('Login to the saucedemo website', async () => {
        await loginPage.goto();
        await loginPage.login(TEST_ACCOUNT.username, TEST_ACCOUNT.password);
        await inventoryPage.verifyPageLoaded();
    });

    await test.step('Add products to cart', async () => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');
        await inventoryPage.verifyCartBadge(2);
        await inventoryPage.goToCart();
    });

    await test.step('Collect product data from cart page', async () => {
        await cartPage.verifyPageLoaded();
        cartData = await cartPage.getCartItems();
        expect(cartData.length).toBeGreaterThan(0);
        await cartPage.proceedToCheckout();
    });

    await test.step('Fill checkout information', async () => {
        await checkoutInfoPage.verifyPageLoaded();
        await checkoutInfoPage.fillCheckoutInformation(customer.firstName, customer.lastName, customer.zipCode);
    });

    await test.step('Collect product data from overview page', async () => {
        await overviewPage.verifyPageLoaded();
        overviewData = await overviewPage.getOverviewItems();
    });

    await test.step('Verify data consistency between Cart and Overview pages', async () => {
        expect(cartData).toHaveLength(2);
        expect(cartData).toEqual(overviewData);
    });

    await test.step('Finish order', async () => {
        await overviewPage.finishOrder();
        await overviewPage.verifyOrderCompleted();
    });

});


