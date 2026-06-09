import { test, expect, Locator, Page } from '@playwright/test';

// test case using getByRole to locate elements and extract data from the cart and checkout pages
type CheckoutData = {
    firstName: string;
    lastName: string;
    zip: string;
};

test('Verify that the cart information remains consistent from the Cart page to the Overview page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    const addProductToCart = async (page: Page, productName: string) => {
        const item = page.locator('[data-test="inventory-item"]').filter({ hasText: productName });
        await item.getByRole('button', { name: 'Add to cart' }).click();
    }

    // Add products to the cart
    await addProductToCart(page, 'Sauce Labs Backpack');
    await addProductToCart(page, 'Sauce Labs Onesie');

    await page.locator('[data-test="shopping-cart-link"]').click();

    const productCartItems = page.locator('[data-test="inventory-item"]');

    // Function to extract item data from a given locator

    async function getProducts(items: Locator) {
        const count = await items.count();
        const data = [];

            for (let i = 0; i < count; i++) {
                const item = items.nth(i);

                data.push({
                    name: (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim(),
                    price: (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim(),
                    quantity: (await item.locator('[data-test="item-quantity"]').textContent())?.trim()
                });
            }

        return data;
    }

    // Extract cart data
    const getAllProductCart = await getProducts(productCartItems);

    await page.getByRole('button', { name: 'Checkout' }).click();

    // Function to fill checkout information
    async function fillCheckoutInformation(page: Page, data: CheckoutData) {
        await page.getByRole('textbox', { name: 'First Name' }).fill(data.firstName);
        await page.getByRole('textbox', { name: 'Last Name' }).fill(data.lastName);
        await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill(data.zip);
        await page.getByRole('button', { name: 'Continue' }).click();
    }

    await fillCheckoutInformation(page, {
        firstName: 'Mike',
        lastName: 'Brown',
        zip: '67890'
    });

    // Extract checkout data
    const getAllProductCheckout = page.locator('[data-test="inventory-item"]');
    const checkoutData = await getProducts(getAllProductCheckout);

    //Validate that the cart data matches the checkout data
     expect(getAllProductCart).toEqual(checkoutData);

    // Finish the checkout process
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
});