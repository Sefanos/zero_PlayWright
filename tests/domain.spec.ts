import { test, expect } from '@playwright/test';

test('Login and adding a domain', async ({ page }) => {
  await page.goto('https://admin.flyspa.dvpt.pulsweb.ch/login');
  await page.getByRole('textbox', { name: 'Adresse e-mail' }).click();
  await page.getByRole('textbox', { name: 'Adresse e-mail' }).fill('admin@pulse.digital');
  await page.getByRole('textbox', { name: 'Mot de passe' }).click();
  await page.getByRole('textbox', { name: 'Mot de passe' }).fill('VdjCKd7MW4Cy');
  await page.getByRole('button', { name: 'Connexion' }).click();
  await page.getByRole('button', { name: 'burger' }).click();
  await page.getByRole('link', { name: 'Domaine & Produits' }).click();
  await page.getByRole('button', { name: 'Ajouter' }).click();
  await page.locator('select[name="type"]').selectOption('domain');
  await page.getByRole('dialog', { name: 'Ajouter un nouveau domaine' }).locator('input[type="text"]').click();
  await page.getByRole('dialog', { name: 'Ajouter un nouveau domaine' }).locator('input[type="text"]').fill('playWrighten');
  await page.locator('div').filter({ hasText: /^Titre \*ENTraduction FR$/ }).getByRole('button').click();
  await page.locator('div').filter({ hasText: /^FR$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^FR$/ }).getByRole('textbox').fill('play');
  await page.locator('div').filter({ hasText: /^FR$/ }).getByRole('textbox').fill('playWrightfr');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  // Wait for and assert the exact success toast text shown by the app
  const successMessage = page.locator('[id="Domain Created Successfully."]');
  await expect(successMessage).toBeVisible({ timeout: 5000 });
  // The toast contains the full message text; assert exact content to avoid localization issues
  await expect(successMessage).toHaveText('Domain Created Successfully.', { timeout: 5000 });
});