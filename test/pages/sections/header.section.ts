import type { Page } from '@playwright/test'

export class HeaderSection {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }

  get logo() {
    return this.page.locator('.logo')
  }
  get avatarCircle() {
    return this.page.locator('.ant-avatar-circle').first()
  }
  get logoutLink() {
    return this.page.locator('.anticon-logout')
  }
}
