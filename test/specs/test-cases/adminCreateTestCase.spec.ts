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
        const overview = new OverviewPage(page)
        await use(overview)
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

test.describe('Admin create test case @create-test-case @Admin-create-test-case', () => {
    test('Should be able to create test cases', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.adminUser.username,
            usersData.adminUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Wait for test suites to load and choose test suite
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithTestCasesAdmin()

        //Wait for test cases to load 
        await testCasePage.testCaseTable.waitFor()
        //Count the amount of test cases currently in test suite
        let testCaseCount = await testCasePage.countTestCasesInSuite()

        //Clicks new test case button and wait for the new test case modal to appear
        await testCasePage.clickNewTestCaseBtn()
        await testCasePage.newTestCaseModalTitle.waitFor()

        //assertion to confirm that the new test case modal is visible 
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        //Fills the new test case form with data
        await testCasePage.fillTestCaseForm(
            testCaseData[0].title,
            testCaseData[0].priority,
            testCaseData[0].referenceId,
            testCaseData[0].precondition,
            testCaseData[0].testSteps,
            testCaseData[0].expectedResults
        )
        await testCasePage.clickCreateNewTestCaseBtn()

        //Wait for new test case to be added
        await testCasePage.waitForNewTestCase(testCaseCount)

        //Assertion to confirm that the test case modal is not visible
        await expect(testCasePage.newTestCaseModalTitle).not.toBeVisible
        let newTestCaseCount = await testCasePage.countTestCasesInSuite()

        //Assertion to confirm that the test suite has been updated with a new test case
        await expect(testCaseCount).toBeLessThan(newTestCaseCount);

        //Assertion to confirm that all the data currently in a test case 
        //match the ones that were entered
        await testCasePage.openTestCaseDetails()
        await expect(testCasePage.testCaseDetailTitle).toContainText(testCaseData[0].title)
        await expect(testCasePage.testCaseDetailPriority).toContainText(testCaseData[0].priority)
        await expect(testCasePage.testCaseDetailPrecondition).toContainText(testCaseData[0].precondition)
        await expect(testCasePage.testCaseDetailSteps).toContainText(testCaseData[0].testSteps)
        await expect(testCasePage.testCaseDetailExpectedResult).toContainText(testCaseData[0].expectedResults)

        //Detele added test casse
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
            usersData.adminUser.username,
            usersData.adminUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Wait for test suites to load and choose test suite
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithTestCasesAdmin()

        //Wait for test cases to load 
        await testCasePage.testCaseTable.waitFor()
        //Count the amount of test cases currently in test suite
        let testCaseCount = await testCasePage.countTestCasesInSuite()
        await testCasePage.clickNewTestCaseBtn()

        ///Clicks new test case button and wait for the new test case modal to appear
        await testCasePage.newTestCaseModalTitle.waitFor()
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        await testCasePage.fillNewTestCaseFormTitle(
            testCaseData[1].title
        )

        //Asertion to confirm that the new test case modal is visible
        await testCasePage.waitForNewTestCase(testCaseCount)
        await expect(testCasePage.newTestCaseModalTitle).not.toBeVisible

        //Assertion to confirm that the test suite has been updated with a new test case
        let newTestCaseCount = await testCasePage.countTestCasesInSuite()
        await expect(testCaseCount).toBeLessThan(newTestCaseCount);

        //Assertion to confirm that all the data currently in a test case 
        //match the ones that were entered
        await testCasePage.openTestCaseDetails()
        await expect(testCasePage.testCaseDetailTitle).toContainText(testCaseData[1].title)

        //Detele added test casse
        await testCasePage.deleteNewTestCase(newTestCaseCount)

    })

    test('Should not be able to create a test case with no title', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.adminUser.username,
            usersData.adminUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Wait for test suites to load and choose test suite
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithTestCasesAdmin()

        //Wait for test cases to load then click new test case button
        await testCasePage.testCaseTable.waitFor()
        await testCasePage.clickNewTestCaseBtn()

        //Wait for test case modal to become visible
        await testCasePage.newTestCaseModalTitle.waitFor()
        //Assertion to confirm that test case modal is visible
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        //Click create new test case button
        await testCasePage.clickCreateNewTestCaseBtn()
        //Assertion to confirm that the user recieves an error when trying to create a 
        //test case without a title
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
            usersData.adminUser.username,
            usersData.adminUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Wait for test suites to load and choose test suite
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithTestCasesAdmin()

        await testCasePage.testCaseTable.waitFor()
        await testCasePage.clickNewTestCaseBtn()

        await testCasePage.newTestCaseModalTitle.waitFor()
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

        //Asssertion to confirm that an error message appear telling the user to 
        //input a test case title
        await expect(testCasePage.titleNeededAlert).toContainText('Please input the title!')
    })

    test('Should be able to edit a test case', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.adminUser.username,
            usersData.adminUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Wait for test suites to load and choose a test suite
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithTestCasesAdmin()

        //Wait for test cases to load and count the amount of test cases currently 
        //in the suite
        await testCasePage.testCaseTable.waitFor()
        let testCaseCount = await testCasePage.countTestCasesInSuite()

        //Click the new test case button and waits for the test case modal 
        //to become visible
        await testCasePage.clickNewTestCaseBtn()
        await testCasePage.newTestCaseModalTitle.waitFor()
        //Assertion to confirm that test case modal is visible 
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        //Fills the new test case form with data
        await testCasePage.fillTestCaseForm(
            testCaseData[0].title,
            testCaseData[0].priority,
            testCaseData[0].referenceId,
            testCaseData[0].precondition,
            testCaseData[0].testSteps,
            testCaseData[0].expectedResults
        )
        await testCasePage.clickCreateNewTestCaseBtn()

        //Wait for the created test case to be added
        await testCasePage.waitForNewTestCase(testCaseCount)

        //Assertion to confirm that the test case modal is not visible
        await expect(testCasePage.newTestCaseModalTitle).not.toBeVisible
        let newTestCaseCount = await testCasePage.countTestCasesInSuite()

        //Assertion to confirm that the new test case was added
        await expect(testCaseCount).toBeLessThan(newTestCaseCount);

        //Assertion to confirm that all the information entered by the usser 
        //matchess the information currently in the test case
        await testCasePage.openTestCaseDetails()
        await expect(testCasePage.testCaseDetailTitle).toContainText(testCaseData[0].title)
        await expect(testCasePage.testCaseDetailPriority).toContainText(testCaseData[0].priority)
        await expect(testCasePage.testCaseDetailPrecondition).toContainText(testCaseData[0].precondition)
        await expect(testCasePage.testCaseDetailSteps).toContainText(testCaseData[0].testSteps)
        await expect(testCasePage.testCaseDetailExpectedResult).toContainText(testCaseData[0].expectedResults)

        //Clicks the edit button
        await testCasePage.testCaseDetailEditBtn.click()
        //Fill the edit form with information to update
        await testCasePage.fillTestCaseForm(
            testCaseData[1].title,
            testCaseData[1].priority,
            testCaseData[1].referenceId,
            testCaseData[1].precondition,
            testCaseData[1].testSteps,
            testCaseData[1].expectedResults
        )
        await testCasePage.testCaseDetailSaveChangestBtn.click()

        //Assertion to confirm that the updated test case details matches the information entered
        await testCasePage.testCaseDetailModal.waitFor()
        await expect(testCasePage.testCaseDetailTitle).toContainText(testCaseData[1].title)
        await expect(testCasePage.testCaseDetailPriority).toContainText(testCaseData[1].priority)
        await expect(testCasePage.testCaseDetailPrecondition).toContainText(testCaseData[1].precondition)
        await expect(testCasePage.testCaseDetailSteps).toContainText(testCaseData[1].testSteps)
        await expect(testCasePage.testCaseDetailExpectedResult).toContainText(testCaseData[1].expectedResults)

        //Deleted the added test case
        await testCasePage.deleteNewTestCase(newTestCaseCount)

    })

    test('Should be able to create test cases in an empty test suite', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.adminUser.username,
            usersData.adminUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Waits for test suite to load and choose an empty test suite
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithoutTestCasesAdmin()
        //Opens the test case modal form
        await testCasePage.clickAddTestCaseBtn()

        //Waits for test case modal to become visible
        await testCasePage.newTestCaseModalTitle.waitFor()
        //Assertion to confirm that test case modal is visible
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        //Fills the new test case form with data
        await testCasePage.fillTestCaseForm(
            testCaseData[0].title,
            testCaseData[0].priority,
            testCaseData[0].referenceId,
            testCaseData[0].precondition,
            testCaseData[0].testSteps,
            testCaseData[0].expectedResults
        )
        await testCasePage.clickCreateNewTestCaseBtn()

        //Assertion to confirm that test case form modal is not visible
        await expect(testCasePage.newTestCaseModalTitle).not.toBeVisible
        await testCasePage.waitForNewTestCase(0)
        let testCaseCount = await testCasePage.countTestCasesInSuite()
        //Assertion to confirm that a test case was added
        await expect(testCaseCount).toBeGreaterThan(0);

        //Assertion to confirm that all the information entered by the usser 
        //matchess the information currently in the test case
        await testCasePage.openTestCaseDetails()
        await expect(testCasePage.testCaseDetailTitle).toContainText(testCaseData[0].title)
        await expect(testCasePage.testCaseDetailPriority).toContainText(testCaseData[0].priority)
        await expect(testCasePage.testCaseDetailPrecondition).toContainText(testCaseData[0].precondition)
        await expect(testCasePage.testCaseDetailSteps).toContainText(testCaseData[0].testSteps)
        await expect(testCasePage.testCaseDetailExpectedResult).toContainText(testCaseData[0].expectedResults)

        //Deleted the added test case
        await testCasePage.deleteNewTestCase(testCaseCount)

    })

    test('Should be able to create a test case, in an empty test suite, with only test case title', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.adminUser.username,
            usersData.adminUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Waits for test suite to load and choose an empty test suite
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithoutTestCasesAdmin()

        //Opens the test case modal form
        await testCasePage.clickAddTestCaseBtn()

        //Waits for test case form modal to become visible
        await testCasePage.newTestCaseModalTitle.waitFor()
        //Assertion to confirm that test case form modal is visible
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        //Fill test case form modal with title
        await testCasePage.fillNewTestCaseFormTitle(
            testCaseData[1].title
        )

        await testCasePage.waitForNewTestCase(0)
        //Assertion to confirm that the test case modal is not visible
        await expect(testCasePage.newTestCaseModalTitle).not.toBeVisible

        let testCaseCount = await testCasePage.countTestCasesInSuite()

        await expect(testCaseCount).toBeGreaterThan(0);

        //Assertion to confirm that test case title matches the title enteres
        await testCasePage.openTestCaseDetails()
        await expect(testCasePage.testCaseDetailTitle).toContainText(testCaseData[1].title)

        //Deleted the added test case
        await testCasePage.deleteNewTestCase(testCaseCount)

    })

    test('Should not be able to create a test case with no title in an empty test suite', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.adminUser.username,
            usersData.adminUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Wait for test suites to load and choose a test suite
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithoutTestCasesAdmin()
        await testCasePage.clickAddTestCaseBtn()


        await testCasePage.newTestCaseModalTitle.waitFor()
        //Assertion to confirm that test case modal is visible 
        await expect(testCasePage.newTestCaseModalTitle).toBeVisible

        await testCasePage.clickCreateNewTestCaseBtn()

        //Assertion to confirm that an error appear telling the user to input a 
        //title
        await expect(testCasePage.titleNeededAlert).toContainText('Please input the title!')

    })

    test('Should not be able to create a test case, in an empty test suite, with no title but other fields filled', async ({
        loginPage,
        projectPage,
        overviewPage,
        testSuitePage,
        testCasePage,
    }) => {

        // Logs in the user
        await loginPage.login(
            usersData.adminUser.username,
            usersData.adminUser.password
        )
        // Choose a project
        await projectPage.getProjectSelector('QWAT-1237').click()
        await overviewPage.overviewPageTitle.waitFor()
        await overviewPage.clickTestSuiteTab()

        //Checks whether the "New Test Suite button" is enabled or not
        await testSuitePage.testCaseSection.waitFor()
        await testSuitePage.clickTestSuiteWithoutTestCasesAdmin()


        await testCasePage.clickAddTestCaseBtn()

        await testCasePage.newTestCaseModalTitle.waitFor()

        await testCasePage.newTestCaseModalTitle.waitFor()
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
})