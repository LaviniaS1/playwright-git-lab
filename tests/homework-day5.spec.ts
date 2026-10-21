
import { test, expect } from '../fixtures';
import { readFileSync } from 'fs';
import { join } from 'path';

// Task 1: Logged-in fixture test
test('logged-in user sees the account page', async ({ loggedInPage }) => {
  await expect(loggedInPage).toHaveURL(/\/account/);
});

// Task 2: Hooks
test.describe('catalog hooks', () => {
  test.beforeAll(() => {
    console.log(`Catalog suite started at: ${new Date().toISOString()}`);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot({ fullPage: true });

      await testInfo.attach('failure-screenshot', {
        body: screenshot,
        contentType: 'image/png',
      });
    }
  });

  test.afterAll(() => {
    console.log('Catalog suite finished');
  });

  test('catalog home page loads', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await expect(page.locator('body')).toBeVisible();
  });
});

// Task 3: Read login cases from CSV
type LoginCase = {
  name: string;
  email: string;
  password: string;
  expectedResult: string;
};

const csvPath = join(__dirname, '../test-data/login-cases.csv');

const csvLines = readFileSync(csvPath, 'utf-8')
  .trim()
  .split(/\r?\n/);

const loginCases: LoginCase[] = csvLines
  .slice(1)
  .filter((line) => line.trim() !== '')
  .map((line) => {
    const [name, email, password, expectedResult] = line
      .split(',')
      .map((value) => value.trim());

    return { name, email, password, expectedResult };
  });

for (const data of loginCases) {
  test(`CSV login: ${data.name}`, async ({ page }) => {
    await page.goto('/auth/login');

    await page.locator('[data-test="email"]').fill(data.email);
    await page.locator('[data-test="password"]').fill(data.password);
    await page.locator('[data-test="login-submit"]').click();

    if (data.expectedResult === 'success') {
      await expect(page).toHaveURL(/\/account/);
    } else {
      await expect(
        page.getByText('Invalid email or password')
      ).toBeVisible();
    }
  });
}
