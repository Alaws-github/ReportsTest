import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { ProjectPage } from '../../pages/project.page'
import { usersData } from '../../data/users.data'
import { testCaseData } from '../../data/testcase'
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

test.describe('Editor create test case @create-test-case @Editor-create-test-case', () => {
    test('Should be able to create test cases', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.editorUser.username,
            usersData.editorUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Checks whether the "New Test Suite button" is enabled or not
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithTestCasesAdmin()


        await testCasePage.testCaseTable.waitFor()
        let testCaseCount = await testCasePage.countTestCasesInSuite()

        await testCasePage.clickNewTestCaseBtn()

        await testCasePage.newTestCaseModalTitle.waitFor()
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        await testCasePage.fillTestCaseForm(
            testCaseData[0].title,
            testCaseData[0].priority,
            testCaseData[0].referenceId,
            testCaseData[0].precondition,
            testCaseData[0].testSteps,
            testCaseData[0].expectedResults
        )

        await testCasePage.clickCreateNewTestCaseBtn()

        await testCasePage.waitForNewTestCase(testCaseCount)
        await expect(testCasePage.newTestCaseModalTitle).not.toBeVisible
        let newTestCaseCount = await testCasePage.countTestCasesInSuite()
        await expect(testCaseCount).toBeLessThan(newTestCaseCount);

        await testCasePage.openTestCaseDetails()
        await expect(testCasePage.testCaseDetailTitle).toContainText(testCaseData[0].title)
        await expect(testCasePage.testCaseDetailPriority).toContainText(testCaseData[0].priority)
        await expect(testCasePage.testCaseDetailPrecondition).toContainText(testCaseData[0].precondition)
        await expect(testCasePage.testCaseDetailSteps).toContainText(testCaseData[0].testSteps)
        await expect(testCasePage.testCaseDetailExpectedResult).toContainText(testCaseData[0].expectedResults)

        await testCasePage.deleteNewTestCase(newTestCaseCount)

    })

    test('Should be able to create test cases with only test case title', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.editorUser.username,
            usersData.editorUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Checks whether the "New Test Suite button" is enabled or not
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithTestCasesAdmin()


        await testCasePage.testCaseTable.waitFor()
        let testCaseCount = await testCasePage.countTestCasesInSuite()

        await testCasePage.clickNewTestCaseBtn()

        await testCasePage.newTestCaseModalTitle.waitFor()
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        await testCasePage.fillNewTestCaseFormTitle(
            testCaseData[1].title
        )

        await testCasePage.waitForNewTestCase(testCaseCount)
        await expect(testCasePage.newTestCaseModalTitle).not.toBeVisible
        let newTestCaseCount = await testCasePage.countTestCasesInSuite()
        await expect(testCaseCount).toBeLessThan(newTestCaseCount);

        await testCasePage.openTestCaseDetails()
        await expect(testCasePage.testCaseDetailTitle).toContainText(testCaseData[1].title)

        await testCasePage.deleteNewTestCase(newTestCaseCount)

    })

    test('Should not be able to create a testcase with no title', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.editorUser.username,
            usersData.editorUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Checks whether the "New Test Suite button" is enabled or not
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithTestCasesAdmin()
        await testCasePage.testCaseTable.waitFor()

        await testCasePage.clickNewTestCaseBtn()

        await testCasePage.newTestCaseModalTitle.waitFor()
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        await testCasePage.clickCreateNewTestCaseBtn()

        await expect(testCasePage.titleNeededAlert).toContainText('Please input the title!')

    })

    test('Should not be able to create a test case with no title but other fields filled', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.editorUser.username,
            usersData.editorUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Wait for test suites to load and choose a test suite
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithTestCasesAdmin()

        //Wait for test cases to load then click the new test case button
        await testCasePage.testCaseTable.waitFor()
        await testCasePage.clickNewTestCaseBtn()

        //Wait for test case form modal to become visible
        await testCasePage.newTestCaseModalTitle.waitFor()
        //Assertion to confirm that test case modal is visible 
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        //Fills the test case form with all information but the title
        await testCasePage.fillTestCaseForm(
            '',
            testCaseData[0].priority,
            testCaseData[0].referenceId,
            testCaseData[0].precondition,
            testCaseData[0].testSteps,
            testCaseData[0].expectedResults
        )

        await testCasePage.clickCreateNewTestCaseBtn()

        //Assertion to confirm that an error appear telling the user to input a 
        //title
        await expect(testCasePage.titleNeededAlert).toContainText('Please input the title!')
    })

    test('Should be able to edit a test case', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        await loginPage.login(
            usersData.editorUser.username,
            usersData.editorUser.password
        )

        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithTestCasesEditor()

        await testCasePage.testCaseTable.waitFor()
        let testCaseCount = await testCasePage.countTestCasesInSuite()
        await testCasePage.clickNewTestCaseBtn()

        await testCasePage.newTestCaseModalTitle.waitFor()
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        await testCasePage.fillTestCaseForm(
            testCaseData[0].title,
            testCaseData[0].priority,
            testCaseData[0].referenceId,
            testCaseData[0].precondition,
            testCaseData[0].testSteps,
            testCaseData[0].expectedResults
        )
        await testCasePage.clickCreateNewTestCaseBtn()

        await testCasePage.waitForNewTestCase(testCaseCount)
        await expect(testCasePage.newTestCaseModalTitle).not.toBeVisible
        let newTestCaseCount = await testCasePage.countTestCasesInSuite()
        await expect(testCaseCount).toBeLessThan(newTestCaseCount);

        await testCasePage.openTestCaseDetails()
        await expect(testCasePage.testCaseDetailTitle).toContainText(testCaseData[0].title)
        await expect(testCasePage.testCaseDetailPriority).toContainText(testCaseData[0].priority)
        await expect(testCasePage.testCaseDetailPrecondition).toContainText(testCaseData[0].precondition)
        await expect(testCasePage.testCaseDetailSteps).toContainText(testCaseData[0].testSteps)
        await expect(testCasePage.testCaseDetailExpectedResult).toContainText(testCaseData[0].expectedResults)

        await testCasePage.testCaseDetailEditBtn.click()
        await testCasePage.fillTestCaseForm(
            testCaseData[1].title,
            testCaseData[1].priority,
            testCaseData[1].referenceId,
            testCaseData[1].precondition,
            testCaseData[1].testSteps,
            testCaseData[1].expectedResults
        )
        await testCasePage.testCaseDetailSaveChangestBtn.click()

        await testCasePage.testCaseDetailModal.waitFor()
        await expect(testCasePage.testCaseDetailTitle).toContainText(testCaseData[1].title)

        await expect(testCasePage.testCaseDetailPrecondition).toContainText(testCaseData[1].precondition)
        await expect(testCasePage.testCaseDetailPriority).toContainText(testCaseData[1].priority)
        await expect(testCasePage.testCaseDetailSteps).toContainText(testCaseData[1].testSteps)
        await expect(testCasePage.testCaseDetailExpectedResult).toContainText(testCaseData[1].expectedResults)

        await testCasePage.deleteNewTestCase(newTestCaseCount)
    })

    test('Should be able to create test cases in an empty test suite', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        await loginPage.login(
            usersData.editorUser.username,
            usersData.editorUser.password
        )

        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithoutTestCasesEditor()
        await testCasePage.clickAddTestCaseBtn()

        await testCasePage.newTestCaseModalTitle.waitFor()
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        await testCasePage.fillTestCaseForm(
            testCaseData[0].title,
            testCaseData[0].priority,
            testCaseData[0].referenceId,
            testCaseData[0].precondition,
            testCaseData[0].testSteps,
            testCaseData[0].expectedResults
        )
        await testCasePage.clickCreateNewTestCaseBtn()

        await expect(testCasePage.newTestCaseModalTitle).not.toBeVisible
        await testCasePage.waitForNewTestCase(0)
        let testCaseCount = await testCasePage.countTestCasesInSuite()

        await expect(testCaseCount).toBeGreaterThan(0);

        await testCasePage.openTestCaseDetails()
        await expect(testCasePage.testCaseDetailTitle).toContainText(testCaseData[0].title)
        await expect(testCasePage.testCaseDetailPriority).toContainText(testCaseData[0].priority)
        await expect(testCasePage.testCaseDetailPrecondition).toContainText(testCaseData[0].precondition)
        await expect(testCasePage.testCaseDetailSteps).toContainText(testCaseData[0].testSteps)
        await expect(testCasePage.testCaseDetailExpectedResult).toContainText(testCaseData[0].expectedResults)

        await testCasePage.deleteNewTestCase(testCaseCount)
    })

    test('Should be able to create a test case, in an empty test suite, with only test case title', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        await loginPage.login(
            usersData.editorUser.username,
            usersData.editorUser.password
        )
        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithoutTestCasesEditor()

        await testCasePage.clickAddTestCaseBtn()

        await testCasePage.newTestCaseModalTitle.waitFor()

        await testCasePage.newTestCaseModalTitle.waitFor()
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        await testCasePage.fillNewTestCaseFormTitle(
            testCaseData[1].title
        )

        await testCasePage.waitForNewTestCase(0)
        await expect(testCasePage.newTestCaseModalTitle).not.toBeVisible

        let testCaseCount = await testCasePage.countTestCasesInSuite()

        await expect(testCaseCount).toBeGreaterThan(0);

        await testCasePage.openTestCaseDetails()
        await expect(testCasePage.testCaseDetailTitle).toContainText(testCaseData[1].title)

        await testCasePage.deleteNewTestCase(testCaseCount)

    })

    test('Should not be able to create a test case with no title in an empty test suite', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        await loginPage.login(
            usersData.editorUser.username,
            usersData.editorUser.password
        )

        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithoutTestCasesEditor()
        await testCasePage.clickAddTestCaseBtn()

        await testCasePage.newTestCaseModalTitle.waitFor()
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        await testCasePage.clickCreateNewTestCaseBtn()

        await expect(testCasePage.titleNeededAlert).toContainText('Please input the title!')

    })

    test('Should not be able to create a test case, in an empty test suite, with no title but other fields filled', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        await loginPage.login(
            usersData.editorUser.username,
            usersData.editorUser.password
        )

        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithoutTestCasesEditor()

        await testCasePage.clickAddTestCaseBtn()

        await testCasePage.newTestCaseModalTitle.waitFor()

        await testCasePage.newTestCaseModalTitle.waitFor()
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        await testCasePage.fillTestCaseForm(
            '',
            testCaseData[0].priority,
            testCaseData[0].referenceId,
            testCaseData[0].precondition,
            testCaseData[0].testSteps,
            testCaseData[0].expectedResults
        )

        await testCasePage.clickCreateNewTestCaseBtn()

        await expect(testCasePage.titleNeededAlert).toContainText('Please input the title!')
    })
})