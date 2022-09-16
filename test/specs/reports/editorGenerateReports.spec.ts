import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { ProjectPage } from '../../pages/project.page'
import { usersData } from '../../data/users.data'
import { report } from '../../data/generateReports.data'
import { OverviewPage } from '../../pages/overview.page'
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

test.describe('Editor can Generate, Edit, Share and Delete a Report', () => {
   
 test('Should generate a report for a Project', async ({
    loginPage,
    projectPage,
    overviewPage,
    reportPage,
  }) => {
    //Test case-
    //As an Editor , I should be able to generate a report 

    // Logs in the user
    await loginPage.login(
      usersData.editorUser.username,
      usersData.editorUser.password
    )
    // Choose a project
    await projectPage.existingProjectJiraQA.click()
    await overviewPage.overviewPageTitle.click()

    //Verify that user can click on the Generate Report button(CTA)
    await reportPage.generateReportButton.waitFor()
    await reportPage.generateReportButton.click()

    //Verify that the generate report modal appears
    await expect(reportPage.generateReportModalAppears).toContainText('Generate Report');
    
    //Enter a report name and selects Test run
    await reportPage.enterReportName(report.name)
    await reportPage.clickATestRun()
     
    //Generate a report
    await reportPage.generateButton.click()

    //Verifying the generated report title
     expect(reportPage.reportTitle).toContainText('AutoReports')

    //Verifying the Quality Meter Sections appears
     expect(reportPage.qualityMeterSection).toContainText('QualityMeter')


    //Verifying the Execution Summary Section appears
     expect(reportPage.executionSummarySection).toContainText('Execution Summary')


    //Verifying the Suites Summary Section Appears
     expect(reportPage.suitesSummarySection).toContainText('Suites Summary')

 })
     
  test('Should edit a report for a Project', async ({
        loginPage,
        projectPage,
        overviewPage,
        reportPage,
    }) => {
        //Test case-
        //As an Editor , I should be able to edit a report 
    
        // Logs in the user
        await loginPage.login(
          usersData.editorUser.username,
          usersData.editorUser.password
        )
        // Choose a project
        await projectPage.existingProjectJiraQA.click()
        await overviewPage.overviewPageTitle.click()

        //Edit Report 
        await reportPage.editReportBtn.click()
        await reportPage.editReportName(report.rename)
        await reportPage.editReportSave.click()

        //Verifying the new generated report title
        const modalTitle2 = await reportPage.verifyNewReportTitle()
        expect(modalTitle2).toContain(report.rename)

    });

  test('Should generate a shared link for a report', async ({
        loginPage,
        projectPage,
        overviewPage,
        reportPage,
    }) => {
        //Test case-
        //As an Editor , I should be able to generate share link for a report 
    
        // Logs in the user
        await loginPage.login(
          usersData.editorUser.username,
          usersData.editorUser.password
        )
        // Choose a project
        await projectPage.existingProjectJiraQA.click()
        await overviewPage.overviewPageTitle.click()

        //Select Report
        await reportPage.newTitle.click();

        //Generate a link to share the report
        await reportPage.shareReportBtn.click()
        await reportPage.shareReportLinkBtn.click()
        await expect (reportPage.shareReportAlert).toContainText('You have successfully generated a shareable report link.')
        await reportPage.shareReportCloseTab.click()
    })


  test('Should delete a report', async ({
        loginPage,
        projectPage,
        overviewPage,
        reportPage,
    }) => {
        //Test case-
        //As an Editor , I should be able delete a report 
    
        // Logs in the user
        await loginPage.login(
          usersData.editorUser.username,
          usersData.editorUser.password
        )
        // Choose a project
        await projectPage.existingProjectJiraQA.click()
        await overviewPage.overviewPageTitle.click()
    
        //Delete the Report
        await reportPage.deleteReport.click()
        await reportPage.deleteReportConfirmation.click()
    
  })
})