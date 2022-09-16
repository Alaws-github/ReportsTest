
import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../../pages/login.page'
import { RegisterPage } from '../../pages/register.page'
import { HeaderSection } from '../../pages/sections/header.section'
import { usersData } from '../../data/users.data'
import { REG_EMAIL_VERIFICATION_LINK } from "../../data/constants"

import { getConfirmationUrl } from '../../utils/mailinatorService'
import { createEmailAddress } from '../../utils/EmailAddress'


// Add LoginPage and RegistrationPage fixture to test context
const test = base.extend<{
    loginPage: LoginPage
    registerPage: RegisterPage
    headerSection: HeaderSection
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

})

test.describe('Admin registration @register', () => {
    test('Should register admin user with correct credentials for start up plan', async ({
        loginPage,
        registerPage,
    }) => {

        //Clicks view plans
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

        await expect(confirmationUrl).toMatch(REG_EMAIL_VERIFICATION_LINK);
        await registerPage.page.goto(confirmationUrl);

        //Login registered user
        await registerPage.clickGoToLogin();
        await loginPage.login(
            emailAddress,
            usersData.registerUser.password
        );
        await registerPage.waitForWelcommeLogoForQW();
        await expect(registerPage.qualitywatcherWelcomeImg).toBeVisible();


        //Close welcome modal and click on checkout
        await registerPage.closeWelcomeModal();
        await registerPage.clickCheckOut();

        await expect(registerPage.planName).toContainText('Startup Plan');
        await expect(registerPage.cardInformationLabel).toContainText('Card information');


        //Fill checkout information
        await registerPage.fillCheckoutInformation(
            usersData.cardInformation.cardNumber,
            usersData.cardInformation.cardExpiryDate,
            usersData.cardInformation.cardCvc,
            usersData.cardInformation.nameOnCard
        );

        //Assertion to confirm after successful payment user is redirected to the app and project modal is displayed
        await expect(registerPage.page).toHaveURL(/.*qualitywatcher.com/);
        await expect(registerPage.titleForFirstProject).toContainText('Create Your First Project');

    })
})