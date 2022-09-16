import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { ProjectPage } from '../../pages/project.page'
import { usersData } from '../../data/users.data'
import { OverviewPage } from '../../pages/overview.page'
import { TestSuitePage } from '../../pages/testsuite.page'
import { TestCasePage } from '../../pages/testcase.page'


// Add LoginPage fixture to test context
const test = base.extend<{
    loginPage: LoginPage
    projectPage: ProjectPage
    overviewPage: OverviewPage
    testSuitePage: TestSuitePage
    testCasePage: TestCasePage
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
        const overviewPage = new OverviewPage(page)
        await use(overviewPage)
    },

    testSuitePage: async ({ page }, use) => {
        const testSuitePage = new TestSuitePage(page)
        await use(testSuitePage)
    },

    testCasePage: async ({ page }, use) => {
        const testCasePage = new TestCasePage(page)
        await use(testCasePage)
    },
})

test.describe('Viewer create test case @create-test-case @Viewer-create-test-case', () => {
    test('Should not be able to create test cases', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.viewerUser.username,
            usersData.viewerUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Wait for test suites to load and choose a test suite
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithTestCasesAdmin()

        await testCasePage.testCaseTable.waitFor()
        //Assertion to confirm that the new test case button is disabled
        await expect(testCasePage.newTestCaseBtn).toBeDisabled()

    })

    test('Shouldnt be able to create test cases in an empty test suite', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.viewerUser.username,
            usersData.viewerUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Wait for test suites to load and choose a test suite
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithoutTestCasesAdmin()

        //Assertion to confirm that the new test case button is disabled
        await expect(testCasePage.addTestCaseBtn).toBeDisabled()
    })
})