import type { Page } from '@playwright/test'
import { BasePage } from './page'

export class ReportPage extends BasePage {
  constructor(page: Page) {
    super({ page, url: '/report' })
  }
    get generateReportButton() { return this.page.locator('button', { hasText: 'Generate Report' }) }
    get generateReportModalAppears() { return this.page.locator('#rcDialogTitle0') }
    get reportName() { return this.page.locator('label:has-text("Report Name")') }
    get selectATestRun() { return this.page.locator('#report-form_testRun') }
    get selectATestRunOption() { return this.page.locator('div:nth-child(4)') }
    get generateButton() { return this.page.locator('div[role="document"] button:has-text("Generate")') }
    get qualityMeterSection() { return this.page.locator('text=QualityMeter') }
    get executionSummarySection() { return this.page.locator('text=Execution Summary') }
    get suitesSummarySection() { return this.page.locator('text=Suites Summary') }
    get deleteReport() { return this.page.locator('[aria-label="delete"] path >> nth=0') }
    get deleteReportConfirmation() { return this.page.locator('button:has-text("OK")') }
    get editReportBtn() { return this.page.locator('[aria-label="edit"] path >> nth=1') }
    get editReportFrm() { return this.page.locator('#report-form_reportName') }
    get editReportSave() { return this.page.locator('button:has-text("Save")') }
    get newTitle() { return this.page.locator('#root div:has-text("QA") >> nth=4') }
    get shareReportBtn() { return this.page.locator('button:has-text("Share")') }
    get shareReportLinkBtn() { return this.page.locator('button:has-text("Generate Shareable Link")') }
    get shareReportAlert() { return this.page.locator('div[role="alert"]:has-text("You have successfully generated a shareable report link.")') }
    get shareReportCloseTab() { return this.page.locator('[aria-label="Close"]') }
    get reportTitle() { return this.page.locator('text=AutoReports') }


    //This method is used to Enter the Report Name
    async enterReportName(reportname) {
      await this.clearThenSetValue(this.reportName, reportname)
    
    }

    //This method is used to Select the "QA" from the dropdown
    async clickATestRun() {
      await this.selectATestRun.click()
      await this.selectATestRunOption.click()
    }

   // This method is used to edit reports  
    async editReportName(rename){
      await this.clearThenSetValue(this.editReportFrm, rename)
  
    }

   //This method is used get the New Report title
    async verifyNewReportTitle(){
       return await this.newTitle.innerText()

    }
 }