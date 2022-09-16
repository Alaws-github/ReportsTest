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
  test('Admin can see generate report button and generate a report', async ({
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
    await reportPage.clickGenerateReportButton();

    //Verify that the generate report modal appears
    await expect(await reportPage.generateReportModalAppears.allInnerTexts()).toContain('Generate Report')

    //Enter a report name and selects Test run
    await reportPage.enterReportname(report.name)
    await reportPage.clickATestRun()
    await loginPage.delay(1000)
    
    //Generate a report
    await reportPage.clickGenerateButton()
    await loginPage.delay(5000)

    //Verifying the generated report title
    const modalTitle1 = await reportPage.verifyReportTitle()
    console.log(modalTitle1)
    expect(modalTitle1).toContain(report.name)

    //Verifying the Quality Meter Sections appears
   expect(await reportPage.qualityMeterSection.allInnerTexts()).toContain('QualityMeter');

    //Verifying the Execution Summary Section appears
   expect(await reportPage.executionSummarySection.allInnerTexts()).toContain('Execution Summary');

    
    //Verifying the Suites Summary Section Appears
    expect(await reportPage.suitesSummarySection.allInnerTexts()).toContain('Suites Summary');

    //Goto Report Tab
    await overviewPage.clickReportsTab()

    //Delete the Report
    await loginPage.delay(1000)
    await reportPage.clickDeleteReportButton();
    await loginPage.delay(5000)
  })
})

test.describe('Viewer user cannot edit and delete test report @report-tab', () => {
  test.only('Viewer user cannot edit and delete test report', async ({
    loginPage,
    projectPage,
    overviewPage,
    reportPage
  }) => {
    //Test case- 
    //As a Viewer user, I cannot edit and delete the report

    


    // Logs in the user
    await loginPage.login(
      usersData.viewerUser.username,
      usersData.viewerUser.password
    );
    // Choose a project
    await projectPage.existingProjectJiraQA.click();

    //Choose report tab from overview page
    await overviewPage.clickReportsTab();
    //await reportPage.deleteReprot.waitFor()
    expect(reportPage.deleteBtn).toHaveCount(0);

    //await reportPage.editReprot.waitFor()
    expect(reportPage.editReprot).toHaveCount(0)

  })

})

test.describe('Editor can see Generate, Edit and Delete the report @report-tab', () => {
  test.only('Editor can see generate, edit and delete a report', async ({
    loginPage,
    projectPage,
    overviewPage,
    reportPage,
  }) => {
    //Test case-
    //As an Editor user, I should be able to see button to generate report

    // Logs in the user
    await loginPage.login(
      usersData.editorUser.username,
      usersData.editorUser.password
    )
    // Choose a project
    await projectPage.existingProjectJiraQA.click()
    await overviewPage.clickReportsTab()

    //Verify that user can click on the Generate Report button(CTA)
    await reportPage.clickGenerateReportButton();

    //Verify that the generate report modal appears
    await expect(await reportPage.generateReportModalAppears.allInnerTexts()).toContain('Generate Report')

    //Enter a report name and selects Test run
    await reportPage.enterReportname(report.name)
    await reportPage.clickATestRun()
    await loginPage.delay(1000)
    
    //Generate a report
    await reportPage.clickGenerateButton()
    await loginPage.delay(5000)

    //Verifying the generated report title
    const modalTitle1 = await reportPage.verifyReportTitle()
    console.log(modalTitle1)
    expect(modalTitle1).toContain(report.name)

    //Verifying the Quality Meter Sections appears
   expect(await reportPage.qualityMeterSection.allInnerTexts()).toContain('QualityMeter');

    //Verifying the Execution Summary Section appears
   expect(await reportPage.executionSummarySection.allInnerTexts()).toContain('Execution Summary');

    
    //Verifying the Suites Summary Section Appears
    expect(await reportPage.suitesSummarySection.allInnerTexts()).toContain('Suites Summary');

    //Goto Report Tab
    await overviewPage.clickReportsTab()

    //Delete the Report
    await loginPage.delay(1000)
    await reportPage.clickDeleteReportButton();
    await loginPage.delay(5000)
  })
})