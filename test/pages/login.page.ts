import type { Page } from '@playwright/test'
import { BasePage } from './page'

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super({ page, url: '/login' })
  }

  get userNameField() { return this.page.locator('#register_email') }
  get passwordField() { return this.page.locator('#register_password') }
  get submitBtn() { return this.page.locator('button[type="submit"]') }

  get signUpLink() { return this.page.locator('a[href="/register"]') }
  get popUpMessage() { return this.page.locator('.ant-notification-notice-message') }

  get passwordHelperText() { return this.page.locator('[role="alert"]') }
  get forgotPasswordLink() { return this.page.locator('a[href="/forgot-password"]') }
  get pleaseInputPasswordText() { return this.page.locator('text=Please input your Password!') }

  /**
   * Enters e-mail
   * @param {string} email
   */
  async enterUsername(email) {
    await this.clearThenSetValue(this.userNameField, email)
  }

  /**
   * Enters password
   * @param {string} password
   */
  async enterPassword(password) {
    await this.clearThenSetValue(this.passwordField, password)
  }

  /**
   * Click the Login button
   */
  async clickLoginButton() {
    await this.submitBtn.waitFor()
    await this.submitBtn.click()
  }

  /*
  * The method below is used to log in
  */
  async login(username: string, password: string) {
    await this.enterUsername(username)
    await this.enterPassword(password)
    await this.clickLoginButton()
  }

  async waitForPageLoad() {
    await this.page.waitForNavigation({ waitUntil: "domcontentloaded" })
  }


  async delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
}
