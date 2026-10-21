import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

type LoginData = {
  email: string;
  password: string;
};

const loginDataPath = path.join(
  process.cwd(),
  'test-data',
  'login.json'
);

const loginData = JSON.parse(
  readFileSync(loginDataPath, 'utf8').replace(/^\uFEFF/, '')
) as LoginData;

test('login using data from JSON file', async ({ page }) => {
  await page.goto('/auth/login');

  await page.locator('[data-test="email"]').fill(loginData.email);
  await page.locator('[data-test="password"]').fill(loginData.password);

  await page.locator('[data-test="login-submit"]').click();

  await expect(page).toHaveURL(/\/account/);
});
