import { test, expect } from '@playwright/test';

test('full destination flow: login → add destination → open detail → add todo', async ({ page }) => {
  // Navigate to login (use baseURL)
  await page.goto('/login');


  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

  await page.getByRole('textbox', { name: 'you@example.com' }).fill('user@example.com');
  await page.getByRole('textbox', { name: 'Your password' }).fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  const destinationsHeading = page.getByRole('heading', { name: /Destinations/i });
  await expect(destinationsHeading).toBeVisible({ timeout: 5000 });

  // Add a destination
  const title = 'tokyo';
  const description = 'japan city';
  await page.getByPlaceholder('Title').fill(title);
  await page.getByPlaceholder('Description').fill(description);

  const postResponse = await Promise.all([
    page.getByRole('button', { name: 'Add Destination' }).click(),
    page.waitForResponse(resp => resp.url().includes('/api/destinations') && resp.request().method() === 'POST', { timeout: 5000 }).catch(() => null),
  ]).then(([, r]) => r as any).catch(() => null);

  let createdId: string | undefined;
  if (postResponse) {
    try {
      const json = await postResponse.json();
      createdId = json?.id;
    } catch (e) {
      createdId = undefined;
    }
  }

  const destLink = page.getByRole('link', { name: `${title} ${description}` });
  const toast = page.locator('text=Destination added').first();

  await Promise.race([
    toast.waitFor({ state: 'visible', timeout: 4000 }).catch(() => {}),
    destLink.waitFor({ state: 'visible', timeout: 4000 }).catch(() => {}),
  ]);

  // If the destination link still isn't visible, reload and try again once.
  const visibleAfterFirstTry = await destLink.count().then(c => c > 0 ? destLink.isVisible() : false).catch(() => false);
  if (!visibleAfterFirstTry) {
    if (createdId) {
      await page.goto(`/destinations/${createdId}`);
    } else {
      await page.reload();
      await destLink.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    }
  }
  await expect(destLink).toBeVisible({ timeout: 5000 });


  const failedMsg = page.locator('text=Failed to fetch destination');
  await Promise.all([
    page.waitForURL('**/destinations/**', { timeout: 5000 }),
    destLink.click(),
  ]);

  const newTodoInput = page.locator('input[placeholder="New todo"]');
  const noTodosText = page.locator('text=No todos yet');

  const which = await Promise.race([
    failedMsg.waitFor({ state: 'visible', timeout: 5000 }).then(() => 'failed').catch(() => null),
    newTodoInput.waitFor({ state: 'visible', timeout: 5000 }).then(() => 'input').catch(() => null),
    noTodosText.waitFor({ state: 'visible', timeout: 5000 }).then(() => 'notodos').catch(() => null),
  ]);

  if (which === 'failed') {
    const html = await page.content();
    throw new Error('Destination detail failed to load (Failed to fetch destination)\nPage content:\n' + html.slice(0, 2000));
  }

  if (which === null) {
    const html = await page.content();
    throw new Error('Destination detail did not render expected elements (no todo input, no "No todos yet", no failed message)\nPage content:\n' + html.slice(0, 2000));
  }

  const todoText = 'new todo';
  if (which === 'input') {
    await newTodoInput.fill(todoText);
  } else {
    if (await newTodoInput.count() > 0) {
      await newTodoInput.fill(todoText);
    } else {
      const html = await page.content();
      throw new Error('Todo input not available after navigation.\nPage content:\n' + html.slice(0, 2000));
    }
  }
  await page.getByRole('button', { name: 'Add' }).click();

  const todoToast = page.locator('text=Todo added successfully!').first();
  await expect(todoToast).toBeVisible({ timeout: 3000 });

  const todoItem = page.locator('li', { hasText: todoText }).first();
  await expect(todoItem).toBeVisible({ timeout: 3000 });
});