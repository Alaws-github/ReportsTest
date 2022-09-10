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
    get generateButton() { return this.page.locator('//span[normalize-space()="Generate"]') }
    get reportTitle() { return this.page.locator('//main/div/div/div[1]/div/div/span') }
    get qualityMeterSection() { return this.page.locator('(//div[contains(text(),"QualityMeter")])[1]') }
    get executionSummarySection() { return this.page.locator('(//div[contains(text(),"Execution Summary")])[1]') }
    get suitesSummarySection() { return this.page.locator('(//span[normalize-space()="Suites Summary"])[1]') }
    
    //Click the Generate report button
    async clickGenerateReportButton() {
      await this.generateReportButton.waitFor()
      await this.generateReportButton.click()
    }

   async verifyGenerateReportModalAppears(){
    
      return await this.generateReportModalAppears.allInnerTexts()
    }
    

     randomword = ''

    async enterReportname() {
     this.randomword= (Math.random() + 1).toString(36).substring(7);
      await this.clearThenSetValue(this.reportName, this.randomword)
    
    }

    async clickATestRun() {
      await this.selectATestRun.click()
      await this.selectATestRunOption.click()
    }

   async clickGenerateButton(){
    
    await this.generateButton.click()
   }

  async verifyGenerateReportModalDisappears(){
    //return await this.generateReportModalAppears.allInnerTexts()


  }

   async verifyReportTitle(){
    
    return await this.reportTitle.innerText()
   }

   async verifyQualityMeterSection(){
    
    return await this.qualityMeterSection.innerText()
   }

   async verifyExecutionSummarySection(){
    
    return await this.executionSummarySection.innerText()
   }

   async verifySuitesSummarySection(){
    
    return await this.suitesSummarySection.innerText()
   }

   }
    
  
 
  