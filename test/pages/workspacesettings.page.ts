import type { Page } from '@playwright/test'
import { BasePage } from './page'

export class WorkspaceSettings extends BasePage {
  constructor(page: Page) {
    super({ page, url: '/workspace' })
  }
    get workspaceSetting() { return this.page.locator('text=CodeNameNimble Settings') }
    get workspaceSettingsTitle() { return this.page.locator('text=Workspace Settings') }
    get integrationOpeion() { return this.page.locator('span:has-text("Integrations")') }
    get integrationTitle() { return this.page.locator('text=Manage Integrations') }
    get jiraConnectBtn() { return this.page.locator('a:has-text("Connect")') }
    get jiraDisconnectBtn() { return this.page.locator('text=Disconnect') }
    get jiraDisconnectYesBtn() { return this.page.locator('button:has-text("Yes")') }
    

  }