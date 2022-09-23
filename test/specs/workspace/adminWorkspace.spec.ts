import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { WorkspaceSettings } from '../../pages/workspacesettings.page'
import { usersData } from '../../data/users.data'



// Add LoginPage fixture to test context
const test = base.extend<{
  loginPage: LoginPage
  workspaceSettings: WorkspaceSettings

}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.navigate()
    await use(loginPage)
  },

  workspaceSettings: async ({ page }, use) => {
    const workspaceSettings = new WorkspaceSettings(page)
    await use(workspaceSettings)
  },
  
})

test.describe('Admin can Generate, Edit, Share and Delete a Report', () => {
   
 test.only('Should generate a report for a Project', async ({
    loginPage,
    workspaceSettings,
    context,
  }) => {
    //Test case-
    //As an Admin , I should be able to integrate with jira 

    // Logs in the user
    await loginPage.login(
      usersData.prodAdminUser.username,
      usersData.prodAdminUser.password
    )

    await workspaceSettings.workspaceSetting.click()
    expect(workspaceSettings.workspaceSettingsTitle).toContainText('Workspace Settings')

    await workspaceSettings.integrationOpeion.click()
    expect(workspaceSettings.integrationTitle).toContainText('Manage Integrations')


    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      workspaceSettings.jiraConnectBtn.click() // Opens a new tab
    ])
    await newPage.waitForLoadState();
    await newPage.locator('[placeholder="Enter email"]').fill(usersData.jiraUser.username);

    await newPage.locator('#login-submit').click()
    console.log(await newPage.title());

    await newPage.locator('[placeholder="Enter password"]').waitFor()
    await newPage.locator('[placeholder="Enter password"]').fill(usersData.jiraUser.password)
    await newPage.locator('#login-submit').click()

    await newPage.locator('button:has-text("Accept")').click()
    await newPage.locator('text=Select matching JIRA project').first().waitFor()
    await newPage.locator('text=Select matching JIRA project').first().click()
    await newPage.locator('text=[AN] AndrewTest').waitFor()
    await newPage.locator('text=[AN] AndrewTest').click()

    await newPage.locator('text=Select matching JIRA project').waitFor()
    await newPage.locator('text=Select matching JIRA project').click()
    await newPage.locator('text=[AN] AndrewTest').nth(2).click()
    
    await newPage.locator('button:has-text("Match")').first().click()
    await newPage.locator('button:has-text("Match")').nth(1).click()
 })
       
 test('Should disconnect the jira integration', async ({
  loginPage,
  workspaceSettings,
  context,
}) => {
  //Test case-
  //As an Admin , I should be able to disconnect with jira 

  // Logs in the user
  await loginPage.login(
    usersData.prodAdminUser.username,
    usersData.prodAdminUser.password
  )

  await workspaceSettings.workspaceSetting.click()
  expect(workspaceSettings.workspaceSettingsTitle).toContainText('Workspace Settings')

  await workspaceSettings.integrationOpeion.click()
  expect(workspaceSettings.integrationTitle).toContainText('Manage Integrations')
  if(await workspaceSettings.jiraDisconnectBtn.isVisible())
  {
    workspaceSettings.jiraDisconnectBtn.click()
    expect(workspaceSettings.disconnectAlert).toContainText('Are you sure you want to disconnect Jira from this workspace?')
    workspaceSettings.jiraDisconnectYesBtn.click()
    expect(workspaceSettings.disconnectSuccessMsg).toContainText('You have successfully disconnect this workspace from Jira!')
  }

})

})