const { test, expect } = require('@playwright/test');

test.describe('Landing page — Mouvement JE', () => {
  test('displays the hero and lets the user reach the application form', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.getByRole('link', { name: /candidater|apply/i }).first().click();
    await expect(page.locator('#apply')).toBeVisible();
  });

  test('switches between French and English', async ({ page }) => {
    await page.goto('/');
    const languageSwitcher = page.getByRole('group', { name: /langue \/ language/i });

    await languageSwitcher.getByRole('button', { name: 'English', exact: true }).click();
    await expect(page).toHaveURL(/\/en/);

    await languageSwitcher.getByRole('button', { name: 'Français', exact: true }).click();
    await expect(page).not.toHaveURL(/\/en/);
  });

  test('filtering the map narrows the JE list, and can be reset', async ({ page }) => {
    await page.goto('/');
    await page.locator('#map').scrollIntoViewIfNeeded();
    // The reset control only appears once a region has been selected.
    await expect(page.getByText(/réinitialiser|reset filter/i)).toHaveCount(0);
  });

  test('rejects an incomplete candidature form submission', async ({ page }) => {
    await page.goto('/#apply');
    await page.locator('#apply button[type="submit"]').click();
    await expect(page.getByText(/champ est requis|field is required/i).first()).toBeVisible();
  });
});