import type { Page } from '@playwright/test'
import { BasePage } from './page'

export class ReportPage extends BasePage {
  constructor(page: Page) {
    super({ page, url: '/report' })
  }
    get generateReportButton() { return this.page.locator('button', { hasText: 'Generate Report' }) }
    get generateReportModalAppears() { return this.page.locator('#rcDialogTitle0') }
    get reportName() { return this.page.locator('#report-form_reportName') }
    get selectATestRun() { return this.page.locator('#report-form_testRun') }
    get selectATestRunOption() { return this.page.locator('//div/div[4]/div/div') }
    get generateButton() { return this.page.locator('.ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-row > .ant-btn') }
    get reportTitle() { return this.page.locator('div > .ant-page-header > .ant-page-header-heading > .ant-page-header-heading-left > .ant-page-header-heading-title') }
    get qualityMeterSection() { return this.page.locator('.ant-col:nth-child(1) > .ant-card > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title') }
    get executionSummarySection() { return this.page.locator('.ant-col:nth-child(2) > .ant-card > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title') }
    get suitesSummarySection() { return this.page.locator('.ant-card > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title > .ant-typography:nth-child(1)') }
    get deleteReprot() { return this.page.locator('.ant-space-item > a > .ant-tooltip-open > svg > path:nth-child(1)') }
    get deleteReprotConfirmation() { return this.page.locator('.ant-popover-inner > .ant-popover-inner-content > .ant-popover-buttons > .ant-btn-primary > span') }


    //Click the Generate report button
    async clickGenerateReportButton() {
      await this.generateReportButton.waitFor()
      await this.generateReportButton.click()
    }
    
    //Enter the Report Name
    async enterReportname(reportname) {
      await this.clearThenSetValue(this.reportName, reportname)
    }

    //Select the "QA" from the dropdown
    async clickATestRun() {
      await this.selectATestRun.click()
      await this.selectATestRunOption.click()
    }

    //Click the Generate report button
   async clickGenerateButton(){
    await this.generateButton.click()
   }

  //Getting the Report title
   async verifyReportTitle(){
    return await this.reportTitle.innerText()
   }


   //Click on Delete Report button and delete the report
  async clickDeleteReportButton(){
    await this.deleteReprot.click()
    await this.deleteReprotConfirmation.click()
   }
   }
  
  
 
  