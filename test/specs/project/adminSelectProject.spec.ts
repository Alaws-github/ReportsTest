import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { ProjectPage } from '../../pages/project.page'
import { usersData } from '../../data/users.data'
import { project } from '../../data/project.data'

// Add LoginPage fixture to test context
const test = base.extend<{
    loginPage: LoginPage
    projectPage: ProjectPage
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
})

test.describe('Admin select the Jira QA Project', () => {
    test('Should select a Jira QA Project', async ({
        loginPage,
        projectPage
    }) => {
        // Logs in the user
        await loginPage.login(
            usersData.adminUser.username,
            usersData.adminUser.password
        );

        await loginPage.waitForPageLoad();
        // THis is used to count the amount of projects currently in the workspace
        await projectPage.waitForProjectsTitleOnWorkspaceToLoad();
        let projectCount = await projectPage.countProjectsInWorkspace();

        // Clicks the Jira QA Project
        expect(projectPage.existingProjectJiraQA.allInnerTexts()).toContain('jira QA')
        await projectPage.existingProjectJiraQA.click()
        //await projectPage.clickOnJiraQAProject();

    })
});