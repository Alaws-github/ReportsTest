import type { Page, Locator } from '@playwright/test'
type IPage = {
  page: Page
  url: string
}
export class BasePage {
  readonly page: Page
  readonly url: string
  constructor({ page, url }: IPage) {
    this.page = page
    this.url = url
  }

  get loadingSpinner() {
    return this.page.locator('[data-icon="loading"]')
  }

  async navigate() {
    await this.page.goto(this.url)
  }

  async clearThenSetValue(locator: Locator, value: string) {
    await locator.fill('')
    await locator.fill(value)
  }
}