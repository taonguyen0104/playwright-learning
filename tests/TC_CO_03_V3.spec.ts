import { test, expect, Page, Locator } from '@playwright/test';

// Test case using the error_user to detect defect and verify that the cart information remains consistent from the Cart page to the Overview page.
type Product = {
  name: string | null;
  price: string | null;
  quantity: string | null;
};

type CheckoutData = {
  firstName: string;
  lastName: string;
  zip: string;
};

// The function to extract product data from a given locator
const getProducts = async (items: Locator): Promise<Product[]> => {
  const count = await items.count();
  const data: Product[] = [];

  for (let i = 0; i < count; i++) {
    const item = items.nth(i);

    data.push({
      name: (await item.locator('[data-test="inventory-item-name"]').textContent())?.trim() ?? null,
      price: (await item.locator('[data-test="inventory-item-price"]').textContent())?.trim() ?? null,
      quantity: (await item.locator('[data-test="item-quantity"]').textContent())?.trim() ?? null,
    });
  }

  return data;
};

// Function to add a product to the cart
const addProductToCart = async (page: Page, productName: string) => {
  const item = page.locator('[data-test="inventory-item"]').filter({ hasText: productName });
  const addBtn = item.getByRole('button', { name: 'Add to cart' });

  await expect(item).toHaveCount(1); 
  await expect(addBtn).toBeVisible();

  await addBtn.click();
};

// Function to fill checkout information
const fillCheckoutInformation = async (page: Page, data: CheckoutData) => {
  await page.getByRole('textbox', { name: 'First Name' }).fill(data.firstName);
  await page.getByRole('textbox', { name: 'Last Name' }).fill(data.lastName);
  await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill(data.zip);
  await page.getByRole('button', { name: 'Continue' }).click();
};

// ===== Test =====
test('Verify that the cart information remains consistent from the Cart page to the Overview page', async ({ page }) => {
  await test.step('Login', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'username' }).fill('error_user');
    // await page.getByRole('textbox', { name: 'username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory/);
  });

  // Add product to cart and verify badge count
  await test.step('Add product to cart', async () => {
    await addProductToCart(page, 'Sauce Labs Backpack');

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  // Capture cart data before checkout
  await test.step('Go to cart and capture data', async () => {

    await page.locator('[data-test="shopping-cart-link"]').click();

    const cartItems = page.locator('[data-test="inventory-item"]');
    await expect(cartItems).toHaveCount(1);

    (test.info() as any).cartData = await getProducts(cartItems);
  });

  // Checkout and fill information
  await test.step('Checkout and fill information', async () => {
    await page.getByRole('button', { name: 'Checkout' }).click();

    await fillCheckoutInformation(page, {
      firstName: 'Mike',
      lastName: 'Brown',
      zip: '67890',
    });
  });

  // Verify data on Overview page
  await test.step('Verify data on Overview page', async () => {
    const overviewItems = page.locator('[data-test="inventory-item"]');
    const overviewData = await getProducts(overviewItems);

    expect(overviewData).toEqual((test.info() as any).cartData);
  });

  // Finish order and verify completion
  await test.step('Finish order', async () => {

    const finishBtn = page.getByRole('button', {name: 'Finish'});

    await expect(finishBtn).toBeVisible();
    await expect(finishBtn).toBeEnabled();

    await finishBtn.scrollIntoViewIfNeeded();
    await finishBtn.click();

    await expect(page).toHaveURL(/checkout-complete/);
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

  });
});