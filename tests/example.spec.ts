import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

test('has title', async ({ page }) => {
	await page.goto('http://localhost:5173/');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Norma/);
});

test('has events list', async ({ page }) => {
	await page.goto('http://localhost:5173/');

	// Expect a title "to contain" a substring.
	const list = page.locator('.events-list:not(.events-archived)');
	await expect(list).toBeVisible();

	const event = page.locator('.events-list:not(.events-archived) .event');
	await expect(await event.count()).toBeGreaterThanOrEqual(1);
});
