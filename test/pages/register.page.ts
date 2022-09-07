import { Page, expect } from '@playwright/test'
import { BasePage } from './page'

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super({ page, url: '/register' })
  }

  //Getter's for plan type on pricing 
  get viewPlanBtn() { return this.page.locator('a:has-text("View Plans")') }
  get startupPlan() { return this.page.locator('#monthlyStartupPrice') }
  get basicPlan() { return this.page.locator('#monthlyBasicPrice') }
  get professionalPlan() { return this.page.locator('#monthlyProfessionalPrice') }

  //Sign up fields 
  get firstNameField() { return this.page.locator('#register_firstName') }
  get lastNameField() { return this.page.locator('#register_lastName') }
  get workspaceNameField() { return this.page.locator('#register_workspaceName') }
  get emailField() { return this.page.locator('#register_email') }
  get passwordField() { return this.page.locator('#register_password') }
  get confirmPasswordField() { return this.page.locator('#register_confirm') }
  get termsAndAgreeTickBox() { return this.page.locator('#register_agreement') }
  get registerButton() { return this.page.locator('button[type="submit"]') }

  //Email verification
  get emailVerificationModal() { return this.page.locator('.ant-modal-content') }
  get emailVerificationModalTitle() { return this.page.locator('.ant-modal-confirm-title') }
  get emailVerificationSentOkBtn() { return this.page.locator('button:has-text("OK")') }

  //Check for plan on sign up page
  get basicPlanCardTitle() { return this.page.locator('h3:has-text("Basic Plan")') }
  get startUpPlanCardTitle() { return this.page.locator('h3:has-text("Startup Plan")') }
  get professionalPlanCardTitle() { return this.page.locator('h3:has-text("Professional Plan")') }

  //Confirm account
  get accountRegisterConfirmTitle() { return this.page.locator('text=Your account has been successfully registered!') }
  get accountRegisterConfirmBtn() { return this.page.locator('button:has-text("Go To Login Page")') }
  get accountRegisterSetupWelcomeBtn() { return this.page.locator('button:has-text("Next Step")') }
  get finalAccountRegisterSetupWelcomeBtn() { return this.page.locator('button:has-text("Enjoy!")') }
  get clickSuccessfulLogin() { return this.page.locator('[aria-label="close"] svg') }
  get closeAccountRegisterSetupWelcomeBtn() { return this.page.locator('[aria-label="Close"]') }
  get qualitywatcherWelcomeImg() { return this.page.locator('img[src="/image/onboarding/Welcome.png"]') }

  //Plan checkout
  get planName() { return this.page.locator('.ProductSummary-name') }
  get checkoutBtn() { return this.page.locator('button:has-text("Continue to Checkout")') }
  get cardInformationLabel() { return this.page.locator("label[For='cardNumber-fieldset']") }
  get cardNumberField() { return this.page.locator('#cardNumber') }
  get cardExpiryField() { return this.page.locator('#cardExpiry') }
  get cardCvcField() { return this.page.locator('#cardCvc') }
  get cardBillingNameField() { return this.page.locator('#billingName') }
  get cardSubmitBtn() { return this.page.locator('.SubmitButton-IconContainer') }
  get regionSelection() { return this.page.locator('[aria-label="Country or region"]') }

  //First project
  get qwlogo() { return this.page.locator('img[src=/image/logo.svg]') }
  get titleForFirstProject() { return this.page.locator('text=Create Your First Project') }

  get projectNameField() { return this.page.locator('#register_title') }
  get projectDescriptionField() { return this.page.locator('#register_description') }
  get projectTypeField() { return this.page.locator('#register_type') }
  get projectSubmitBtn() { return this.page.locator("button[type='submit']") }

  //This is a variable used to set the region when making payment with stripe
  region = 'JM';

  //Clicks the "View Plans" button on the register page
  async clickViewPlan() {
    await this.viewPlanBtn.click();
    await this.page.waitForSelector('text=Our Pricing Plans');
  }

  //Click the basic plan
  async clickBasicPlan() {
    await this.basicPlan.click();
  }

  //Click the startup plan
  async clickStartupPlan() {
    await this.startupPlan.click();
  }

  //Click the professional plan
  async clickProfessionalPlan() {
    await this.professionalPlan.click();
  }

  /*
  * Check for the email verification modal and click the Ok button
  */
  async checkEmailVerificationSentModel() {
    await expect(this.emailVerificationModalTitle).toContainText('Email Verification Sent!');
    await this.emailVerificationSentOkBtn.click();
  }

  /*
  * Click the account registered confirmation button 
  */
  async clickGoToLogin() {
    await this.accountRegisterConfirmBtn.click();
  }

  /*
  * This method is used to sign up for an account and click register button
  */
  async signUp(firstName, lastName, workspaceName, email, password, passwordConfirm) {
    await this.clearThenSetValue(this.firstNameField, firstName);
    await this.clearThenSetValue(this.lastNameField, lastName);
    await this.clearThenSetValue(this.workspaceNameField, workspaceName);
    await this.clearThenSetValue(this.emailField, email);
    await this.clearThenSetValue(this.passwordField, password);
    await this.clearThenSetValue(this.confirmPasswordField, passwordConfirm);
    await this.termsAndAgreeTickBox.click();
    await this.registerButton.click();
  }

  /*
  * This method is used to close the welcome modal after signing up and verifying account 
  */
  async closeWelcomeModal() {
    await this.page.waitForSelector('button:has-text("Next Step")');
    await this.accountRegisterSetupWelcomeBtn.click();
    await this.clickSuccessfulLogin.click();
    await this.page.waitForSelector('[aria-label="Close"]');
    await this.closeAccountRegisterSetupWelcomeBtn.click();
    await this.page.waitForSelector('button:has-text("Continue to Checkout")');
  }

  /*
  * This method is use to click the checkout button then wait for the card number input field to load
  */
  async clickCheckOut() {
    await this.checkoutBtn.click();
    await this.page.waitForSelector('#cardNumber');
  }

  /*
  * This method is use to fill checkout information, click to process then wait for the next page to load
  */
  async fillCheckoutInformation(cardNumber, cardExpiryDate, cvc, billingName) {
    await this.clearThenSetValue(this.cardNumberField, cardNumber);
    await this.clearThenSetValue(this.cardExpiryField, cardExpiryDate);
    await this.clearThenSetValue(this.cardCvcField, cvc);
    await this.clearThenSetValue(this.cardBillingNameField, billingName);
    await this.regionSelection.selectOption(this.region);
    await this.cardSubmitBtn.click();

    await this.page.waitForURL('/');
    await this.page.goto('/');
    await this.page.waitForSelector('#register_title');
  }

  /*
  * This method is use to fill in information for a project in qualitywatcher and click the submit button
  */
  async fillFirstProject(projectName, projectDescription, projectType) {
    await this.clearThenSetValue(this.projectNameField, projectName);
    await this.clearThenSetValue(this.projectDescriptionField, projectDescription);
    await this.clearThenSetValue(this.projectTypeField, projectType);
    await this.projectSubmitBtn.click();
  }

  async waitForMailinatorEmail() {
    await this.page.waitForTimeout(5000)
  }

  async waitForWelcommeLogoForQW() {
    await this.page.waitForSelector('img[src="/image/onboarding/Welcome.png"]')
  }
}