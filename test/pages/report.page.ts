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
    get selectATestRunOption() { return this.page.locator('div:nth-child(4)') }
    get generateButton() { return this.page.locator('//span[normalize-space()="Generate"]') }
    get reportTitle() { return this.page.locator('#root div:has-text("AutoReports") >> nth=4') }
    get qualityMeterSection() { return this.page.locator('(//div[contains(text(),"QualityMeter")])[1]') }
    get executionSummarySection() { return this.page.locator('(//div[contains(text(),"Execution Summary")])[1]') }
    get suitesSummarySection() { return this.page.locator('(//span[normalize-space()="Suites Summary"])[1]') }
    get editReportBtn() { return this.page.locator('[aria-label="edit"] path >> nth=1') }
    get editReportFrm() { return this.page.locator('#report-form_reportName') }
    get editReportSave() { return this.page.locator('button:has-text("Save")') }
    get newTitle() { return this.page.locator('#root div:has-text("QA") >> nth=4') }
    get deleteReprot() { return this.page.locator('[aria-label="delete"] path >> nth=0') }
    get deleteReprotConfirmation() { return this.page.locator('button:has-text("OK")') }
    get shareReportBtn() { return this.page.locator('button:has-text("Share")') }
    get shareReportLinkBtn() { return this.page.locator('button:has-text("Generate Shareable Link")') }
    get shareReportAlert() { return this.page.locator('div[role="alert"]:has-text("You have successfully generated a shareable report link.")') }
    get shareReportAlertText() { return this.page.locator('text=You have successfully generated a shareable report link.') }
    get shareReportCloseTab() { return this.page.locator('[aria-label="Close"]') }
    
    //Click the Generate report button
    //async clickGenerateReportButton() {
      //await this.generateReportButton.waitFor()
      //await this.generateReportButton.click()
    //}

    //Gets the Generate report modal title
   async verifyGenerateReportModalAppears(){
    
      return await this.generateReportModalAppears.allInnerTexts()
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
   //async clickGenerateButton(){
    
   // await this.generateButton.click()
   //}

  async verifyGenerateReportModalDisappears(){
    //return await this.generateReportModalAppears.allInnerTexts()


  }

  //Getting the Report title
   //async verifyReportTitle(){
    
    //return await this.reportTitle.innerText()
   //}

   //Getting the Quality Meter Section
   async verifyQualityMeterSection(){
    
    return await this.qualityMeterSection.innerText()
   }
   
   //Getting the Execution Summary Section 
   async verifyExecutionSummarySection(){
    
    return await this.executionSummarySection.innerText()
   }

   //Getting the Suites Summary Section
   async verifySuitesSummarySection(){
    
    return await this.suitesSummarySection.innerText()
   }

    async verifySharedLink(){

    }

  // This method is used to edit reports  
   async editReportName(rename){
     await this.clearThenSetValue(this.editReportFrm, rename)
     
   }

   //Getting the New Report title
   async verifyNewReportTitle(){
    
    return await this.newTitle.innerText()
   }

   //Click on Delete Report button
  //Click the Generate report button
  async clickDeleteReportButton(){
    
    await this.deleteReprot.click()
    await this.deleteReprotConfirmation.click()
   }
   }
  
  
 
  