
import { expect, type Page, test as base } from '@playwright/test';

type Fixtures = {
  loggedInPage: Page;
};

class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string) {
    await this.page.locator('[data-test="email"]').fill(email);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.locator('[data-test="login-submit"]').click();
  }
}

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(
      'customer@practicesoftwaretesting.com',
      'welcome01'
    );

    await expect(page).toHaveURL(/\/account/);

    await use(page);
  },
});

export { expect };
