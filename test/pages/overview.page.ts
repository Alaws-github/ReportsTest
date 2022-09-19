import { Page } from "@playwright/test";
import { BasePage } from "./page";

export class OverviewPage extends BasePage {

  constructor(public page: Page) {
    super({ page, url: '/register' })
  }

  get testSuiteTab() { return this.page.locator('.ant-menu-item', { hasText: 'Test Suites' }) }
  get overviewPageTitle() { return this.page.locator('h1.ant-typography', { hasText: 'Overview' }) }
  get profileTab() { return this.page.locator('div[role="button"]:has-text("A")') }
  get profileSettings() { return this.page.locator('text=Profile Settings') }

  async clickTestSuiteTab() {
    await this.testSuiteTab
      .click();
  }
  
}