import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { ProjectPage } from '../../pages/project.page'
import { usersData } from '../../data/users.data'
import { OverviewPage } from '../../pages/overview.page'
import { TestSuitePage } from '../../pages/testsuite.page'
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
  }

  , testSuitePage: async ({ page }, use) => {
    const testSuitePage = new TestSuitePage(page)
    await use(testSuitePage)
  }

})
test.describe('Admin Positive Test Case Import @test-suite-import', () => {
  test('Admin Positive test case Import', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage
  }) => {
    //Test case- 
    //As an Admin user I can import a valid file of test cases

    const { positiveImport } = testSuiteData.importSuites;


    // Logs in the user
    await loginPage.login(
      usersData.adminUser.username,
      usersData.adminUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click();

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab();


    //Import a valid test suite with a title and description
    await testSuitePage.importTestSuite(positiveImport.title,
      positiveImport.description, positiveImport.excelFile);

    //Choose newly created suite
    await testSuitePage.clickCreatedTestSuite(positiveImport.title);
    await testSuitePage.testCaseSection.waitFor();

    //assert that proper excel test cases were imported 
    const testCaseTitles = await testSuitePage.getTestCaseTitles();
    expect(testCaseTitles).toContain(positiveImport.testCases[0]);
    expect(testCaseTitles).toContain(positiveImport.testCases[1]);
    expect(testCaseTitles).toContain(positiveImport.testCases[2]);

    //deletes test suite after asserting all three cases
    await testSuitePage.deleteSuiteFromTestCasePage();

  })
})
test.describe('Admin Positive Test Case Import XLS @test-suite-import', () => {
  test('Admin Positive test case Import XLS', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage
  }) => {
    //Test case- 
    //As an Admin user I can import a valid file of test cases XLS

    const { xlsImport } = testSuiteData.importSuites;


    // Logs in the user
    await loginPage.login(
      usersData.adminUser.username,
      usersData.adminUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click();

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab();


    //Import a valid test suite with a title and description
    await testSuitePage.importTestSuite(xlsImport.title,
      xlsImport.description, xlsImport.excelFile);

    //Choose newly created suite
    await testSuitePage.clickCreatedTestSuite(xlsImport.title);
    await testSuitePage.testCaseSection.waitFor();

    //assert that proper excel test cases were imported 
    const testCaseTitles = await testSuitePage.getTestCaseTitles();
    expect(testCaseTitles).toContain(xlsImport.testCases[0]);
    expect(testCaseTitles).toContain(xlsImport.testCases[1]);
    expect(testCaseTitles).toContain(xlsImport.testCases[2]);


    //deletes test suite after asserting all three cases
    await testSuitePage.deleteSuiteFromTestCasePage();

  })
})
test.describe('Editor Positive Test Case Import XLS @test-suite-import', () => {
  test('Editor Positive test case Import XLS', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage
  }) => {
    //Test case- 
    //As an Admin user I can import a valid file of test cases XLS

    const { xlsImport } = testSuiteData.importSuites;


    // Logs in the user
    await loginPage.login(
      usersData.editorUser.username,
      usersData.editorUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click();

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab();


    //Import a valid test suite with a title and description
    await testSuitePage.importTestSuite(xlsImport.title,
      xlsImport.description, xlsImport.excelFile);

    //Choose newly created suite
    await testSuitePage.clickCreatedTestSuite(xlsImport.title);
    await testSuitePage.testCaseSection.waitFor();

    //assert that proper excel test cases were imported 
    const testCaseTitles = await testSuitePage.getTestCaseTitles();
    expect(testCaseTitles).toContain(xlsImport.testCases[0]);
    expect(testCaseTitles).toContain(xlsImport.testCases[1]);
    expect(testCaseTitles).toContain(xlsImport.testCases[2]);


    //deletes test suite after asserting all three cases
    await testSuitePage.deleteSuiteFromTestCasePage();

  })
})
test.describe('Editor should see proper test cases that have been imported @test-suite-import', () => {
  test('Editor should see proper test cases that have been imported', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage
  }) => {
    //Test case- 
    //As an Admin user I can import a valid file of test cases

    const { positiveImport } = testSuiteData.importSuites;


    // Logs in the user
    await loginPage.login(
      usersData.editorUser.username,
      usersData.editorUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click();

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab();


    //Import a valid test suite with a title and description
    await testSuitePage.importTestSuite(positiveImport.title,
      positiveImport.description, positiveImport.excelFile);

    //Choose newly created suite
    await testSuitePage.clickCreatedTestSuite(positiveImport.title);
    await testSuitePage.testCaseSection.waitFor();

    //assert that proper excel test cases were imported 
    const testCaseTitles = await testSuitePage.getTestCaseTitles();
    expect(testCaseTitles).not.toContain(positiveImport.negativeTitles[0]);
    expect(testCaseTitles).not.toContain(positiveImport.negativeTitles[1]);
    expect(testCaseTitles).not.toContain(positiveImport.negativeTitles[2]);

    //deletes test suite after asserting all three cases
    await testSuitePage.deleteSuiteFromTestCasePage();

  })
})
test.describe('Admin should see proper test cases that have been imported @test-suite-import', () => {
  test('Admin should see proper test cases that have been imported', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage
  }) => {
    //Test case- 
    //As an Admin user I can import a valid file of test cases

    const { positiveImport } = testSuiteData.importSuites;


    // Logs in the user
    await loginPage.login(
      usersData.adminUser.username,
      usersData.adminUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click();

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab();


    //Import a valid test suite with a title and description
    await testSuitePage.importTestSuite(positiveImport.title,
      positiveImport.description, positiveImport.excelFile);

    //Choose newly created suite
    await testSuitePage.clickCreatedTestSuite(positiveImport.title);
    await testSuitePage.testCaseSection.waitFor();

    //assert that proper excel test cases were imported 
    const testCaseTitles = await testSuitePage.getTestCaseTitles();
    expect(testCaseTitles).not.toContain(positiveImport.negativeTitles[0]);
    expect(testCaseTitles).not.toContain(positiveImport.negativeTitles[1]);
    expect(testCaseTitles).not.toContain(positiveImport.negativeTitles[2]);

    //deletes test suite after asserting all three cases
    await testSuitePage.deleteSuiteFromTestCasePage();

  })
})
test.describe('Editor Positive Test Case Import @test-suite-import', () => {
  test('Editor Positive test case Import', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage
  }) => {
    //Test case- 
    //As an Admin user I can import a valid file of test cases

    const { positiveImport } = testSuiteData.importSuites;


    // Logs in the user
    await loginPage.login(
      usersData.editorUser.username,
      usersData.editorUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click();

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab();


    //Import a valid test suite with a title and description
    await testSuitePage.importTestSuite(positiveImport.title,
      positiveImport.description, positiveImport.excelFile);

    //Choose newly created suite
    await testSuitePage.clickCreatedTestSuite(positiveImport.title);
    await testSuitePage.testCaseSection.waitFor();

    //assert that proper excel test cases were imported 
    const testCaseTitles = await testSuitePage.getTestCaseTitles();
    expect(testCaseTitles).toContain(positiveImport.testCases[0]);
    expect(testCaseTitles).toContain(positiveImport.testCases[1]);
    expect(testCaseTitles).toContain(positiveImport.testCases[2]);

    //deletes test suite after asserting all three cases
    await testSuitePage.deleteSuiteFromTestCasePage();

  })
})
test.describe('Viewer user cannot import test suite @test-suite-import', () => {
  test('Viewer user cannot import test suite', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage
  }) => {
    //Test case- 
    //As a Viewer user, I cannot import a test suite file

    const { positiveImport } = testSuiteData.importSuites;


    // Logs in the user
    await loginPage.login(
      usersData.viewerUser.username,
      usersData.viewerUser.password
    );
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click();

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab();
    await testSuitePage.importTestSuiteBtn.waitFor();
    expect(testSuitePage.importTestSuiteBtn).toBeDisabled();



  })

})
test.describe('admin Negative Test Case Import @test-suite-import', () => {
  test('admin Negative test case Import', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage
  }) => {
    //Test case- 
    //As an Admin user I cannot import an invalid file of test cases
    //What makes this invalid? -- this excel sheet has no test case titles column


    const { negativeImport } = testSuiteData.importSuites;


    // Logs in the user
    await loginPage.login(
      usersData.adminUser.username,
      usersData.adminUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click();

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab();


    //Import a valid test suite with a title and description
    await testSuitePage.importTestSuite(negativeImport.title,
      negativeImport.description, negativeImport.excelFile);
    await testSuitePage.alertMessage.waitFor();
    expect(testSuitePage.alertMessage).toBeVisible();


  })
})
test.describe('editor Negative Test Case Import @test-suite-import', () => {
  test('editor Negative test case Import', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage
  }) => {
    //Test case- 
    //As an editor user I cannot import an invalid file of test cases
    //What makes this invalid? -- this excel sheet has no test case titles column

    const { negativeImport } = testSuiteData.importSuites;


    // Logs in the user
    await loginPage.login(
      usersData.editorUser.username,
      usersData.editorUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click();

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab();


    //Import a valid test suite with a title and description
    await testSuitePage.importTestSuite(negativeImport.title,
      negativeImport.description, negativeImport.excelFile);
    await testSuitePage.alertMessage.waitFor();
    expect(testSuitePage.alertMessage).toBeVisible();


  })
})
test.describe('Editor should see proper test cases that have been imported XLS @test-suite-import', () => {
  test('Editor should see proper test cases that have been imported XLS', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage
  }) => {
    //Test case- 
    //As an Admin user I can import a valid file of test cases

    const { xlsImport } = testSuiteData.importSuites;


    // Logs in the user
    await loginPage.login(
      usersData.editorUser.username,
      usersData.editorUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click();

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab();


    //Import a valid test suite with a title and description
    await testSuitePage.importTestSuite(xlsImport.title,
      xlsImport.description, xlsImport.excelFile);

    //Choose newly created suite
    await testSuitePage.clickCreatedTestSuite(xlsImport.title);
    await testSuitePage.testCaseSection.waitFor();

    //assert that proper excel test cases were imported 
    const testCaseTitles = await testSuitePage.getTestCaseTitles();
    expect(testCaseTitles).not.toContain(xlsImport.negativeTitles[0]);
    expect(testCaseTitles).not.toContain(xlsImport.negativeTitles[1]);
    expect(testCaseTitles).not.toContain(xlsImport.negativeTitles[2]);

    //deletes test suite after asserting all three cases
    await testSuitePage.deleteSuiteFromTestCasePage();

  })
})
test.describe('Admin should see proper test cases that have been imported XLS @test-suite-import', () => {
  test('Admin should see proper test cases that have been imported XLS', async ({
    loginPage,
    projectPage,
    overviewPage,
    testSuitePage
  }) => {
    //Test case- 
    //As an Admin user I can import a valid file of test cases

    const { xlsImport } = testSuiteData.importSuites;


    // Logs in the user
    await loginPage.login(
      usersData.adminUser.username,
      usersData.adminUser.password
    )
    // Choose a project
    await projectPage.getProjectSelector('qwat-1224').click();

    //Choose test suite tab from overview page
    await overviewPage.clickTestSuiteTab();


    //Import a valid test suite with a title and description
    await testSuitePage.importTestSuite(xlsImport.title,
      xlsImport.description, xlsImport.excelFile);

    //Choose newly created suite
    await testSuitePage.clickCreatedTestSuite(xlsImport.title);
    await testSuitePage.testCaseSection.waitFor();

    //assert that proper excel test cases were imported 
    const testCaseTitles = await testSuitePage.getTestCaseTitles();
    expect(testCaseTitles).not.toContain(xlsImport.negativeTitles[0]);
    expect(testCaseTitles).not.toContain(xlsImport.negativeTitles[1]);
    expect(testCaseTitles).not.toContain(xlsImport.negativeTitles[2]);

    //deletes test suite after asserting all three cases
    await testSuitePage.deleteSuiteFromTestCasePage();

  })
})