import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { ProjectPage } from '../../pages/project.page'
import { usersData } from '../../data/users.data'
import { OverviewPage } from '../../pages/overview.page'
import { TestSuitePage } from '../../pages/testsuite.page'
import { titlesAndDescriptions } from '../../data/testSuiteTitlesDescriptions'
import { testSuiteData } from '../../data/testSuiteData'

// Add LoginPage fixture to test context
const test = base.extend<{
  loginPage: LoginPage
  projectPage: ProjectPage
  overviewPage: OverviewPage
  testSuitePage: TestSuitePage
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
})

test.describe('Viewer cannot create test suite @test-suite-create', () => {
  test('Viewer cannot create suites', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage,
  }) => {
    //Test case-
    // As a viewer user, I should not be able to create test suites

    // Logs in the user
    await loginPage.login(
      usersData.viewerUser.username,
      usersData.viewerUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click()
    await overviewPage.clickTestSuiteTab()

    //Checks whether the "New Test Suite button" is enabled or not
    expect(testSuitePage.blueNewTestSuiteBtn).toBeDisabled()
  })
})
test.describe('Admin can see create suites button @test-suite-create', () => {
  test('Admin can see create suites button', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage,
  }) => {
    //Test case-
    //As an Admin user, I should be able to see button to create new test suite

    // Logs in the user
    await loginPage.login(
      usersData.adminUser.username,
      usersData.adminUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click()
    await overviewPage.clickTestSuiteTab()

    //Checks whether the "New Test Suite button" is enabled or not
    expect(testSuitePage.blueNewTestSuiteBtn).toBeEnabled()
  })
})
test.describe('Editor can see create suites button @test-suite-create', () => {
  test('Editor can see create suites button', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage,
  }) => {
    //Test case-
    //As an editor user, I should be able to see the button to create test suites

    // Logs in the user
    await loginPage.login(
      usersData.editorUser.username,
      usersData.editorUser.password
    )
    // Choose a project and naviagte to test suite page
    await projectPage.getProjectSelector('qwat-1224').click()
    await overviewPage.clickTestSuiteTab()

    //Checks whether the "New Test Suite "button is enabled or not
    expect(testSuitePage.blueNewTestSuiteBtn).toBeEnabled()
  })
})
test.describe(
  'Viewer can see created test cases in an existing suite @test-suite-create',
  () => {
    test('Viewer can see created test cases in an existing suite', async ({
      loginPage,
      projectPage,
      overviewPage,
      testSuitePage,
    }) => {
      //Test case-
      // As a viewer user, I can see created test cases in an existing suite

      // Logs in the user
      await loginPage.login(
        usersData.viewerUser.username,
        usersData.viewerUser.password
      )
      // Choose a project
      await projectPage.getProjectSelector('testone').click()
      await overviewPage.clickTestSuiteTab()

      // Choose an existing test suite
      await testSuitePage.existingProjectsTestSuite.click()
      await testSuitePage.testCaseSection.waitFor()

      //assert viewer user is able to see test cases in a test suite
      expect(testSuitePage.testCaseSection).not.toBeHidden()
    })
  }
)

test.describe('Admin can create Test Suite from template @test-suite-create', () => {
  test('Admin can create Test Suite from template', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage,
  }) => {
    //Test case-
    //As an Admin user I should be able to see test cases that I chose from template

    let testSuiteTitle = titlesAndDescriptions.adminTemplate.title
    let testSuiteDescription = titlesAndDescriptions.adminTemplate.description

    const { blockchain } = testSuiteData.templates

    // Logs in the user
    await loginPage.login(
      usersData.adminUser.username,
      usersData.adminUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click()

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab()

    //Open modal and navigate through template test suite creation "Blockchain"
    await testSuitePage.openTestSuiteModal()
    await testSuitePage.chooseTemplate(blockchain.templateName)

    //chooses test cases
    await testSuitePage.chooseTestCase(1)
    await testSuitePage.chooseTestCase(2)
    await testSuitePage.chooseTestCase(3)
    await testSuitePage.nextBtn.click()

    //Enter title and description
    await testSuitePage.enterTemplateTestSuiteTitleAndDescription(
      testSuiteTitle,
      testSuiteDescription
    )
    await testSuitePage.clickCreatedTestSuite(testSuiteTitle)
    await testSuitePage.testCaseSection.waitFor()

    //asserts proper test cases were generated and imported
    const testCaseTitles = await testSuitePage.getTestCaseTitles()
    expect(testCaseTitles).toContain(blockchain.testCases[0])
    expect(testCaseTitles).toContain(blockchain.testCases[1])
    expect(testCaseTitles).toContain(blockchain.testCases[2])

    //deletes test suite
    await testSuitePage.deleteSuiteFromTestCasePage()
  })
})
test.describe('Editor can create Test Suite from template @test-suite-create', () => {
  test('Editor can create Test Suite from template', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage,
  }) => {
    //Test case-
    //As an editor user I should be able to see test cases that I chose from template

    let testSuiteTitle = titlesAndDescriptions.editorTemplate.title
    let testSuiteDescription = titlesAndDescriptions.editorTemplate.description

    const { web } = testSuiteData.templates

    // Logs in the user
    await loginPage.login(
      usersData.editorUser.username,
      usersData.editorUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click()

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab()

    //Open modal and navigate through template test suite creation "web"
    await testSuitePage.openTestSuiteModal()
    await testSuitePage.chooseTemplate(web.templateName)

    //chooses test cases
    await testSuitePage.chooseTestCase(1)
    await testSuitePage.chooseTestCase(2)
    await testSuitePage.chooseTestCase(3)
    await testSuitePage.nextBtn.click()

    //Enter title and description
    await testSuitePage.enterTemplateTestSuiteTitleAndDescription(
      testSuiteTitle,
      testSuiteDescription
    )
    await testSuitePage.clickCreatedTestSuite(testSuiteTitle)
    await testSuitePage.testCaseSection.waitFor()

    //asserts proper test cases were generated and imported
    const testCaseTitles = await testSuitePage.getTestCaseTitles()
    expect(testCaseTitles).toContain(web.testCases[0])
    expect(testCaseTitles).toContain(web.testCases[1])
    expect(testCaseTitles).toContain(web.testCases[2])

    //deletes test suite
    await testSuitePage.deleteSuiteFromTestCasePage()
  })
})
test.describe(
  'Editor can create Test Suite from template negative test @test-suite-create',
  () => {
    test('Editor can create Test Suite from template negative test', async ({
      loginPage,
      projectPage,
      overviewPage,
      testSuitePage,
    }) => {
      //Test case-
      //As an editor user I should be able to see proper test cases that I chose from template creation

      let testSuiteTitle = titlesAndDescriptions.editorTemplate.title
      let testSuiteDescription =
        titlesAndDescriptions.editorTemplate.description

      const { gaming } = testSuiteData.templates

      // Logs in the user
      await loginPage.login(
        usersData.editorUser.username,
        usersData.editorUser.password
      )
      // Choose a project
      await projectPage.getProjectSelector('qwat-1224').click()

      //Choose test suite tab from overview page
      await overviewPage.clickTestSuiteTab()

      //Open modal and navigate through template test suite creation "gaming"
      await testSuitePage.openTestSuiteModal()
      await testSuitePage.chooseTemplate(gaming.templateName)

      //chooses test cases
      await testSuitePage.chooseTestCase(4)
      await testSuitePage.chooseTestCase(2)
      await testSuitePage.chooseTestCase(1)
      await testSuitePage.nextBtn.click()

      //Enter title and description
      await testSuitePage.enterTemplateTestSuiteTitleAndDescription(
        testSuiteTitle,
        testSuiteDescription
      )
      await testSuitePage.clickCreatedTestSuite(testSuiteTitle)
      await testSuitePage.testCaseSection.waitFor()

      //asserts proper test cases were generated and imported
      const testCaseTitles = await testSuitePage.getTestCaseTitles()
      expect(testCaseTitles).not.toContain(gaming.testCases[4])
      expect(testCaseTitles).not.toContain(gaming.testCases[5])
      expect(testCaseTitles).not.toContain(gaming.testCases[2])

      //deletes test suite
      await testSuitePage.deleteSuiteFromTestCasePage()
    })
  }
)
test.describe(
  'Admin can create Test Suite from template negative test @test-suite-create',
  () => {
    test('Admin can create Test Suite from template negative test', async ({
      loginPage,
      projectPage,
      overviewPage,
      testSuitePage,
    }) => {
      //Test case-
      //As an admin user I should be able to see proper test cases that I chose from template creation

      let testSuiteTitle = titlesAndDescriptions.adminTemplate.title
      let testSuiteDescription = titlesAndDescriptions.adminTemplate.description

      const { mobile } = testSuiteData.templates

      // Logs in the user
      await loginPage.login(
        usersData.editorUser.username,
        usersData.editorUser.password
      )
      // Choose a project
      await projectPage.getProjectSelector('qwat-1224').click()

      //Choose test suite tab from overview page
      await overviewPage.clickTestSuiteTab()

      //Open modal and navigate through template test suite creation "mobile"
      await testSuitePage.openTestSuiteModal()
      await testSuitePage.chooseTemplate(mobile.templateName)

      //chooses test cases
      await testSuitePage.chooseTestCase(6)
      await testSuitePage.chooseTestCase(5)
      await testSuitePage.chooseTestCase(4)
      await testSuitePage.nextBtn.click()

      //Enter title and description
      await testSuitePage.enterTemplateTestSuiteTitleAndDescription(
        testSuiteTitle,
        testSuiteDescription
      )
      await testSuitePage.clickCreatedTestSuite(testSuiteTitle)
      await testSuitePage.testCaseSection.waitFor()

      //asserts proper test cases were generated and imported
      const testCaseTitles = await testSuitePage.getTestCaseTitles()
      expect(testCaseTitles).not.toContain(mobile.testCases[2])
      expect(testCaseTitles).not.toContain(mobile.testCases[1])
      expect(testCaseTitles).not.toContain(mobile.testCases[0])

      //deletes test suite
      await testSuitePage.deleteSuiteFromTestCasePage()
    })
  }
)

test.describe('admin can edit test suite titles/descriptions @test-suite-create', () => {
  test('admin can edit test suite titles/descriptions', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage,
  }) => {
    //Test case-
    //As an Admin user I can edit test suites

    let newTitle = 'edited title'
    let newDescription = 'edited description'

    // Logs in the user
    await loginPage.login(
      usersData.adminUser.username,
      usersData.adminUser.password
    )
    // Choose a project/test suite
    await projectPage.getProjectSelector('testone').click()
    await overviewPage.clickTestSuiteTab()

    await testSuitePage.editTestSuiteBtn.waitFor()
    await testSuitePage.editTestSuiteBtn.click()

    //change the title/description
    await testSuitePage.editTestSuiteTitleAndDescription(
      newTitle,
      newDescription
    )

    //assert the change has been properly performed
    const testSuiteTitle = await testSuitePage.getTestSuiteTitle()
    expect(testSuiteTitle).toContain(newTitle)
  })
})
test.describe('editor can edit test suite titles/descriptions @test-suite-create', () => {
  test('editor can edit test suite titles/descriptions', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage,
  }) => {
    //Test case-
    //As an editor user I can edit test suites

    let newTitle = 'edited title'
    let newDescription = 'edited description'

    // Logs in the user
    await loginPage.login(
      usersData.editorUser.username,
      usersData.editorUser.password
    )
    // Choose a project/test suite
    await projectPage.getProjectSelector('testone').click()
    await overviewPage.clickTestSuiteTab()

    await testSuitePage.editTestSuiteBtn.waitFor()
    await testSuitePage.editTestSuiteBtn.click()

    //change the title/description
    await testSuitePage.editTestSuiteTitleAndDescription(
      newTitle,
      newDescription
    )

    //assert the change has been properly performed
    const testSuiteTitle = await testSuitePage.getTestSuiteTitle()
    expect(testSuiteTitle).toContain(newTitle)
  })
})
