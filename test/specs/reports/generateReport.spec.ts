import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { ProjectPage } from '../../pages/project.page'
import { usersData } from '../../data/users.data'
import { report } from '../../data/generateReportsdata'
import { OverviewPage } from '../../pages/overview'
import { ReportPage } from '../../pages/report.page'

// Add LoginPage fixture to test context
const test = base.extend<{
  loginPage: LoginPage
  projectPage: ProjectPage
  overviewPage: OverviewPage
  reportPage: ReportPage

}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.navigate()
    await use(loginPage)
  },

  projectPage: async ({ page }, use) => {
    const projectPage = new ProjectPage(page)
    await use(projectPage)
  },

  overviewPage: async ({ page }, use) => {
    const overview = new OverviewPage(page)
    await use(overview)
  },

  reportPage: async ({ page }, use) => {
    const reportPage = new ReportPage(page)
    await use(reportPage)
  },
})

test.describe('Admin can see Generate Report button @report-tab', () => {
  test.only('Admin can see generate report button and generate a report', async ({
    loginPage,
    projectPage,
    overviewPage,
    reportPage,
  }) => {
    //Test case-
    //As an Admin user, I should be able to see button to generate report

    // Logs in the user
    await loginPage.login(
      usersData.adminUser.username,
      usersData.adminUser.password
    )
    // Choose a project
    await projectPage.existingProjectJiraQA.click()
    await overviewPage.clickReportsTab()

    //Verify that user can click on the Generate Report button(CTA)
    await reportPage.generateReportButton.waitFor()
    await reportPage.generateReportButton.click()
    //await reportPage.clickGenerateReportButton();

    //Verify that the generate report modal appears
    const modalTitle = await reportPage.verifyGenerateReportModalAppears()
    expect(modalTitle).toContain('Generate Report')

    //Enter a report name and selects Test run
    await reportPage.enterReportname(report.name)
    await reportPage.clickATestRun()
    await loginPage.delay(1000)
    
    //Generate a report
    //await reportPage.clickGenerateButton()
    await reportPage.generateButton.click()
    await loginPage.delay(5000)

    //Verifying the generated report title
    //const modalTitle1 = await reportPage.reportTitle
    //expect(modalTitle1).toContain(report.name)
    expect(reportPage.reportTitle).toContainText('AutoReports')

    //Verifying the Quality Meter Sections appears
    const qualityMeter = await reportPage.verifyQualityMeterSection()
    expect(qualityMeter).toContain('QualityMeter')

    //Verifying the Execution Summary Section appears
    const executionSummarySection = await reportPage.verifyExecutionSummarySection();
    expect(executionSummarySection).toContain('Execution Summary')

    //Verifying the Suites Summary Section Appears
    const suitesSummarySection = await reportPage.verifySuitesSummarySection();
    expect(suitesSummarySection).toContain('Suites Summary')

    //This is to Generate a link to share the report
     await reportPage.shareReportBtn.click()
     await reportPage.shareReportLinkBtn.click()
     await expect (reportPage.shareReportAlert).toContainText('You have successfully generated a shareable report link.')
     await reportPage.shareReportCloseTab.click()
     

    //Goto Report Tab
    await overviewPage.clickReportsTab()
    
    //Edit Report 
    await reportPage.editReportBtn.click()
    await reportPage.editReportName(report.rename)
    await reportPage.editReportSave.click()
    
    //Verifying the generated report title
    const modalTitle2 = await reportPage.verifyNewReportTitle()
    expect(modalTitle2).toContain(report.rename)

    //Delete the Report
    await loginPage.delay(1000)
    await reportPage.deleteReprot.click()
    await reportPage.deleteReprotConfirmation.click()
    //await reportPage.clickDeleteReportButton();
    await loginPage.delay(5000)
  })



})

