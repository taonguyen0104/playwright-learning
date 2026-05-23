import { test, expect, Locator } from '@playwright/test';

// Test case using codegen to locate elements and extract data from the cart and checkout pages

type Product = {
  name: string | null;
  price: string | null;
  quantity: string | null;
};

test('Verify that the cart information remains consistent from the Cart page to the Overview page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // Add product to the cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  const productCartItems = page.locator('[data-test="inventory-item"]');

  // Function to extract item data from a given locator
  const getItemsData = async (items: Locator): Promise<Product[]> => {
  const count = await items.count();
  const data: Product[] = [];


  for (let i = 0; i < count; i++) {
    const item = items.nth(i);

    data.push({
      name: (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim() || null,
      price: (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim() || null,
      quantity: (await item.locator('[data-test="item-quantity"]').textContent())?.trim() || null
    });
  }

  return data;
};

  const cartdata = await getItemsData(productCartItems);

  // Proceed to checkout
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill('Mike');
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill('Brown');
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill('67890');
  await page.locator('[data-test="continue"]').click();

  // Extract checkout data
  const productCheckoutItems = page.locator('[data-test="inventory-item"]');
  const checkoutData = await getItemsData(productCheckoutItems);

  // Validate that the cart data matches the checkout data
  expect(cartdata).toEqual(checkoutData);

  // Finish the checkout process
  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');
  await page.locator('[data-test="back-to-products"]').click();
});