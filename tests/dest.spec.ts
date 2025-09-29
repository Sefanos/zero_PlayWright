import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3002/login');
  await page.getByRole('button', { name: 'Sign in' }).click();
  const uniqueTitle = `tokyo-${Date.now()}`;
  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill(uniqueTitle );
  await page.getByRole('textbox', { name: 'Title' }).press('Tab');
  await page.getByRole('textbox', { name: 'Description' }).fill('its japan');
  await page.getByRole('button', { name: 'Add Destination' }).click();
  await expect(page.getByText('Destination added')).toBeVisible();
  await page.getByRole('link', { name: `${uniqueTitle} its japan` }).click();
  await expect(page.getByRole('heading', { name: 'Todos' })).toBeVisible();
  await page.getByRole('textbox', { name: 'New todo' }).click();
  await page.getByRole('textbox', { name: 'New todo' }).fill('visite shibuya');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('Todo added successfully!')).toBeVisible();
});