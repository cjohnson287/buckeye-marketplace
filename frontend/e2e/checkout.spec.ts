import { test, expect } from '@playwright/test';

test('happy path: register, login, browse, add to cart, checkout, order history', async ({ page }) => {
  const email = `e2e-${Date.now()}@buckeye.local`;
  const password = 'Student123';

  await page.goto('/register');
  await page.getByLabel('Display Name').fill('E2E User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL('/');

  await page.getByRole('link', { name: 'Logout' }).click();
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/');

  await page.getByRole('button', { name: /Add .* to cart/i }).first().click();
  await page.getByRole('link', { name: 'View cart' }).click();

  await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

  await page.getByRole('link', { name: 'Proceed to Checkout' }).click();
  await page.getByLabel('Shipping Address').fill('123 Buckeye Lane, Columbus, OH 43210');
  await page.getByRole('button', { name: 'Complete Order' }).click();

  await expect(page).toHaveURL('/orders/confirmation');
  await page.getByRole('link', { name: 'View order history' }).click();

  await expect(page).toHaveURL('/orders');
  await expect(page.getByRole('heading', { name: 'My Orders' })).toBeVisible();
});
