import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { ProjectPage } from '../../pages/project.page'
import { usersData } from '../../data/users.data'
import { OverviewPage } from '../../pages/overview.page'
import { ProfileSettingsPage } from '../../pages/profilesettings.page'

// Add LoginPage fixture to test context
const test = base.extend<{
  loginPage: LoginPage
  projectPage: ProjectPage
  overviewPage: OverviewPage
  profileSettingPage: ProfileSettingsPage

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

  profileSettingPage: async ({ page }, use) => {
    const profilePage = new ProfileSettingsPage(page)
    await use(profilePage)
  },
})

test.describe('Admin can Create an API Key', () => {
   test.slow
 test.only('Should create an API Key', async ({
    loginPage,
    projectPage,
    overviewPage,
    profileSettingPage,
  }) => {
    //Test case-

    // Logs in the user
    await loginPage.login(
      usersData.adminUser.username,
      usersData.adminUser.password
    )
    await overviewPage.profileTab.click()
    await overviewPage.profileSettings.click()

    expect(profileSettingPage.verifyProfileSettingsModal).toContainText('Profile Settings')
    
    expect(profileSettingPage.apiKeysOption).toContainText('API Keys')
    await profileSettingPage.apiKeysOption.click()

    expect(profileSettingPage.verifyAPIKeysTitle).toContainText('Manage API Keys')
    await profileSettingPage.createAPIKey('Test API Key')
    await (profileSettingPage.verifySuccessMessage).waitFor()
    expect(profileSettingPage.verifySuccessMessage).toContainText('Make sure you copy your API key now')
    expect(profileSettingPage.verifyAPIKeyName).toContainText('Test API Key')
  })
})
