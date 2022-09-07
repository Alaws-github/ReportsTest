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
    test('Should register admin user with correct credentials for basic plan', async ({
        loginPage,
        registerPage,
    }) => {
        test.slow();

        // Clicks the "View Plans" button
        await registerPage.clickViewPlan();

        // Choose start up plan
        await registerPage.clickBasicPlan();

        //Assertion to confirm that plan is displayed on the registration screen
        await expect(registerPage.basicPlanCardTitle).toContainText('Basic Plan');

        //Generate email using uuid
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

        //Assertion to confirm that the url matches the known qualitywatcher verification link
        await expect(confirmationUrl).toMatch(REG_EMAIL_VERIFICATION_LINK);
        await registerPage.page.goto(confirmationUrl);

        //Login registered user
        await registerPage.clickGoToLogin();
        await loginPage.login(
            emailAddress,
            usersData.registerUser.password
        );

        //Assertion to confirm that the user can sign in
        await registerPage.waitForWelcommeLogoForQW();
        await expect(registerPage.qualitywatcherWelcomeImg).toBeVisible();


        //Close welcome modal and click on checkout
        await registerPage.closeWelcomeModal();
        await registerPage.clickCheckOut();

        //Assertions to confirm checkout screen and that the plan matches the selected plan
        await expect(registerPage.planName).toContainText('Basic Plan');
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