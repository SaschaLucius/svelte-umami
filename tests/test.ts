import { test, expect } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	const heading = page.getByRole('heading', { level: 1 });
	// Verify the heading contains "SvelteKit app" text
	await expect(heading).toHaveText(/SvelteKit app/);
});

test('index page includes Umami Analytics script', async ({ page }) => {
	await page.goto('/');
  const analyticsScript = page.getByTestId('umami_analytics_script');
  await expect(analyticsScript).toHaveCount(1);
});
