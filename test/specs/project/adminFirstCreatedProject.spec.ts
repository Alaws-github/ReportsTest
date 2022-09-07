import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { RegisterPage } from '../../pages/register.page'
import { ProjectPage } from '../../pages/project.page'
import { HeaderSection } from '../../pages/sections/header.section'
import { usersData } from '../../data/users.data'
import { project } from '../../data/project.data'

import { getConfirmationUrl } from '../../utils/mailinatorService'
import { createEmailAddress } from '../../utils/EmailAddress'


// Add LoginPage and RegistrationPage fixture to test context
const test = base.extend<{
    loginPage: LoginPage
    registerPage: RegisterPage
    headerSection: HeaderSection
    projectPage: ProjectPage
}>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page)
        await use(loginPage)
    },
    registerPage: async ({ page }, use) => {
        const registerPage = new RegisterPage(page)
        await registerPage.navigate()
        await use(registerPage)
    },
    headerSection: async ({ page }, use) => {
        const headerSection = new HeaderSection(page)
        await use(headerSection)
    },
    projectPage: async ({ page }, use) => {
        const projectPage = new ProjectPage(page)
        await use(projectPage)
    },

})

test.describe('Admin Project Creation @projectCreation', () => {
    test('Should create a new startup account and first project on that accounnt', async ({
        loginPage,
        registerPage,
        projectPage,
    }) => {
        test.slow();

        await registerPage.clickViewPlan();

        // Choose start up plan
        await registerPage.clickStartupPlan();

        await expect(registerPage.startUpPlanCardTitle).toContainText('Startup Plan');

        // Generate email using uuid
        const { emailWithoutDomain, emailAddress } = await createEmailAddress();

        //Sign up user
        await registerPage.signUp(
            usersData.registerUser.firstName,
            usersData.registerUser.lastName,
            usersData.registerUser.workspaceName,
            emailAddress,
            usersData.registerUser.password,
            usersData.registerUser.password
        );

        await registerPage.checkEmailVerificationSentModel();

        //Confirm email
        await registerPage.waitForMailinatorEmail();
        let confirmationUrl = await getConfirmationUrl(emailWithoutDomain);

        await registerPage.page.goto(confirmationUrl);

        //Login registered user
        await registerPage.clickGoToLogin();
        await loginPage.login(
            emailAddress,
            usersData.registerUser.password
        );
        await projectPage.waitForProjectsTitleOnWorkspaceToLoad();


        //Close welcome modal and click on checkout
        await registerPage.closeWelcomeModal();
        await registerPage.clickCheckOut();

        //Fill checkout information
        await registerPage.fillCheckoutInformation(
            usersData.cardInformation.cardNumber,
            usersData.cardInformation.cardExpiryDate,
            usersData.cardInformation.cardCvc,
            usersData.cardInformation.nameOnCard
        );

        // Fills out the project form
        await projectPage.fillProjectDetails(
            project.name,
            project.description,
            project.type
        );

        await projectPage.clickfirstProjectOkBtn();

        //Assertion to confirm that that the user is redirected to the test suite page and 
        //to confirm that the project name in the menu bar 
        await expect(registerPage.page).toHaveURL(/.*qualitywatcher.com\/1\/test-suites/);
        await expect(projectPage.titleOnMenuBar).toContainText('Test Automation');
    })
})