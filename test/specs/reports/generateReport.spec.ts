import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { ProjectPage } from '../../pages/project.page'
import { usersData } from '../../data/users.data'
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
  test.only('Admin can see generate report button', async ({
    loginPage,
    projectPage,
    overviewPage,
    reportPage,
  }) => {
    //Test case-
    //As an Admin user, I should be able to see button to create new test suite

    // Logs in the user
    await loginPage.login(
      usersData.adminUser.username,
      usersData.adminUser.password
    )
    // Choose a project
    await projectPage.existingProjectJiraQA.click()
    await overviewPage.clickReportsTab()

    //Verify that user can click on the Generate Report button(CTA)
    await reportPage.clickGenerateReportButton();

    const modalTitle = await reportPage.verifyGenerateReportModalAppears()
    expect(modalTitle).toContain('Generate Report')

    await reportPage.enterReportname()
    await reportPage.clickATestRun()
    await loginPage.delay(1000)
    
    await reportPage.clickGenerateButton()
    await loginPage.delay(5000)

    const modalTitle1 = await reportPage.verifyReportTitle()
    console.log(modalTitle1)
    expect(modalTitle1).toContain(reportPage.randomword)

    const qualityMeter = await reportPage.verifyQualityMeterSection()
    expect(qualityMeter).toContain('QualityMeter')

    const executionSummarySection = await reportPage.verifyExecutionSummarySection();
    expect(executionSummarySection).toContain('Execution Summary')

    const suitesSummarySection = await reportPage.verifySuitesSummarySection();
    expect(suitesSummarySection).toContain('Suites Summary')
  })

})

