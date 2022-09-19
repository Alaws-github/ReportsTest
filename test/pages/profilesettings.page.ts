import type { Page } from '@playwright/test'
import { BasePage } from './page'

export class ProfileSettingsPage extends BasePage {
    constructor(page: Page) {
      super({ page, url: '/profilesettings' })
    }

    get verifyProfileSettingsModal() { return this.page.locator('#rcDialogTitle0') }
    get apiKeysOption() { return this.page.locator('li[role="menuitem"]:has-text("API Keys")') }
    get verifyAPIKeysTitle() { return this.page.locator('text=Manage API Keys') }
    get createAPIKeybtn() { return this.page.locator('button:has-text("Create API Key")') }
    get verifyCreateAPIKeyModal() { return this.page.locator('#rcDialogTitle1') }
    get enterAPIKeyName() { return this.page.locator('[placeholder="Please enter an API Key name based on usage"]') }
    get clickOnCreateBtn() { return this.page.locator('button[type="submit"]') } 
    get verifySuccessMessage() { return this.page.locator('text=Make sure you copy your API key now. You won\'t be able to see it again!') }
    get verifyAPIKeyName() {return this.page.locator('.ant-list-items > .ant-list-item:nth-child(1) > .ant-list-item-meta > .ant-list-item-meta-content > .ant-list-item-meta-title')}

        //This method is used to Create an API Key
        async createAPIKey(apiname) {
            await this.createAPIKeybtn.click()
            await this.clearThenSetValue(this.enterAPIKeyName, apiname)
            await this.clickOnCreateBtn.click()
          }
}