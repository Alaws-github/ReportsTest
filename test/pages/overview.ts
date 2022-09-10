import { Page } from "@playwright/test";
import { BasePage } from "./page";

export  class OverviewPage extends BasePage{

    constructor(public page: Page) {
      super({page, url: '/register'})
    }
    get testSuiteTab(){
      return this.page.locator('.ant-menu-item', { hasText: 'Test Suites' })

    }

     async clickTestSuiteTab(){
        await this.testSuiteTab
        .click();
     }

     get reportsTab() { return this.page.locator('.ant-menu-item', { hasText: 'Reports' }) }
     async clickReportsTab(){
      await this.reportsTab
      .click();
   }

     
}



