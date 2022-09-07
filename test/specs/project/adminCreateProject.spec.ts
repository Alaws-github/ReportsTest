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

test.describe('Admin Project Creation @projectCreation', () => {
    test('Should create a new project', async ({
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

        // Clicks the new project button
        await projectPage.clickNewProjectBtn();

        // Assertions to confirm that the new project form becomes visible 
        await expect(projectPage.newProjectForm).toBeVisible();

        // Fills out the project form
        await projectPage.fillProjectDetails(
            project.name,
            project.description,
            project.type
        );
        await projectPage.waitForProjectCreationNotification();

        //NB: This was added to give all projects time to load
        await projectPage.waitForProjectCountToIncreease();

        // This is to logout and back into the website to ensure the DOM elements are updated
        await projectPage.logout();
        await loginPage.login(
            usersData.adminUser.username,
            usersData.adminUser.password
        );
        await loginPage.waitForPageLoad();
        // This is used to count the amount of projects currently in the workspace to 
        // compare with the previous amounts
        //NB: This was added to give all projects time to load
        await projectPage.waitForProjectCountToIncreease();
        let newProjectCount = await projectPage.countProjectsInWorkspace();

        // Assertion to confirm that the new project form is no longer visible
        await expect(projectPage.newProjectForm).toBeHidden();

        // Assertion to confirm that the number of projects have been updated

        await expect(projectCount).toBeLessThan(newProjectCount);

        // Assertion to confirm that the project made is present with the information used 
        // to create it
        await expect(projectPage.newProjectCardTitle).toContainText('Test Automation');
        await expect(projectPage.newProjectCardDescription).toContainText('This is a project for test');
        await expect(projectPage.newProjectCardType).toContainText('End to End');

        // Achieves the project to clean up
        await projectPage.archiveProject();
    })
});