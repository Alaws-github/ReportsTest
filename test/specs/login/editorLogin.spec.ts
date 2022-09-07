import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { HeaderSection } from '../../pages/sections/header.section'
import { usersData } from '../../data/users.data'

// Add LoginPage fixture to test context
const test = base.extend<{
    loginPage: LoginPage
    headerSection: HeaderSection
}>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page)
        await loginPage.navigate()
        await use(loginPage)
    },
    headerSection: async ({ page }, use) => {
        const headerSection = new HeaderSection(page)
        await use(headerSection)
    },
})

test.describe('Editor User Authentication @login', () => {
    test('Should login the editor user with a registered email and valid password', async ({
        loginPage,
        headerSection,
    }) => {
        // Logs in the user
        await loginPage.login(
            usersData.editorUser.username,
            usersData.editorUser.password
        );

        // wait for the loading spinner to disappear
        await loginPage.loadingSpinner.waitFor({
            state: 'detached',
        });

        // Verify the user sees the logo
        await expect(headerSection.logo).toBeVisible();

        // Verify that the user sees the avatar circle
        await expect(headerSection.avatarCircle).toBeVisible();
    })

    test('Should not login the editor user with invalid email and valid password', async ({
        loginPage,
    }) => {
        // Logs in the user
        await loginPage.login(
            usersData.invalid.username,
            usersData.editorUser.password
        );

        // Verify that a pop up message appear with with a incorrect login
        await expect(loginPage.popUpMessage).toContainText('Incorrect username or password');

    })

    test('Should not login the editor user with valid email and invalid password', async ({
        loginPage,
    }) => {
        // Logs in the user
        await loginPage.login(
            usersData.editorUser.username,
            usersData.invalid.password
        );

        // Verify that a pop up message appear with with a incorrect login
        await expect(loginPage.popUpMessage).toContainText('Incorrect username or password');

    })

    test('Should not login the editor user with valid email and no password', async ({
        loginPage,
    }) => {
        // Logs in the user
        await loginPage.login(
            usersData.editorUser.username,
            ""
        );

        // Verify that a message saying please input password displays under the password input
        await expect(loginPage.pleaseInputPasswordText).toContainText('Please input your Password');

    })
})