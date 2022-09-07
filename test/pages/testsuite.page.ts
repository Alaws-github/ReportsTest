import { Page } from '@playwright/test'
import { BasePage } from './page'
import * as path from 'path'


export class TestSuitePage extends BasePage {
  constructor(public page: Page) {
    super({ page, url: '/register' })
  }

  get blueNewTestSuiteBtn() { return this.page.locator('.ant-btn', { hasText: 'New Test Suite' }) }
  get importTestSuiteBtn() { return this.page.locator('button', { hasText: 'Import Test Suite' }) }
  get importTitleField() { return this.page.locator('#import-test-suite_title') }
  get importDescriptionField() { return this.page.locator('#import-test-suite_description') }
  get importField() { return this.page.locator('.ant-upload-text', { hasText: 'Click or drag file to this area to upload', }) }
  get confirmImportBtn() { return this.page.locator('button', { hasText: 'Start Import' }) }
  get deleteBtn() { return this.page.locator('[aria-label="delete"] >> nth=0') }
  get confrimDeletion() { return this.page.locator('button', { hasText: 'OK' }) }
  get emptyTestSuitetext() { return this.page.locator('.text-accent-color', { hasText: 'Oh no! There are no test suites here!', }) }
  get customTestSuite() { return this.page.locator('.ant-empty-description', { hasText: 'Create Your Own', }) }
  get testSuiteModal() { return this.page.locator('.ant-modal') }
  get customTestSuiteTitleField() { return this.page.locator('#custom-suite_title') }
  get customTestSuiteDescriptionField() { return this.page.locator('#custom-suite_description') }
  get confirmCustomSuiteBtn() { return this.page.locator('button', { hasText: 'Create Test Suite' }) }
  get emptySuiteBtn() { return this.page.locator('.ant-btn', { hasText: 'Add Test Case' }) }
  get nextBtn() { return this.page.locator('button', { hasText: 'Next' }) }
  get templateTitleInputField() { return this.page.locator('#test-suite_title') }
  get templateDescriptionInputField() { return this.page.locator('#test-suite_description') }
  get testSuiteTitles() { return this.page.locator('.ant-table-tbody .ant-table-cell') }
  get doneBtn() { return this.page.locator('button', { hasText: 'Done' }) }
  get existingProjectsTestSuite() { return this.page.locator('tr:nth-child(2)') }
  get editTestSuiteBtn() { return this.page.locator('[aria-label="edit"]') }
  get editTestCaseBtn() { return this.page.locator('button', { hasText: 'Edit' }) }
  get editTestSuiteTitleField() { return this.page.locator('#form_in_modal_title') }
  get editTestSuiteDescriptionField() { return this.page.locator('#form_in_modal_description') }
  get saveEditChanges() { return this.page.locator('button', { hasText: 'Save' }) }
  get newTitle() { return this.page.locator('.ant-table-cell', { hasText: 'Test Title Edited', }) }
  get testCaseSection() { return this.page.locator('.ant-table') }
  get alertMessage() { return this.page.locator('.ant-alert-message', { hasText: 'Unable to process file!', }) }
  get testCaseTitle() { return this.page.locator('.ant-table-row .ant-typography') }


  async importTestSuite(title, description, fileName) {
    await this.importTestSuiteBtn.click()
    await this.clearThenSetValue(this.importTitleField, title)
    await this.clearThenSetValue(this.importDescriptionField, description)
    await this.page
      .locator('input[type="file"]')
      .setInputFiles(path.resolve('./test/data/', fileName))
    await this.confirmImportBtn.waitFor()
    await this.confirmImportBtn.click()
  }

  async editTestSuiteTitleAndDescription(newTitle, newDescription) {
    await this.clearThenSetValue(this.editTestSuiteTitleField, newTitle)
    await this.editTestSuiteDescriptionField.click()
    await this.clearThenSetValue(
      this.editTestSuiteDescriptionField,
      newDescription
    )
    await this.saveEditChanges.click()
    await this.editTestSuiteBtn.waitFor()
  }
  async createCustomSuiteWithTitleAndDescription(
    CustomTitle,
    CustomDescription
  ) {
    await this.blueNewTestSuiteBtn.click()
    await this.testSuiteModal.isVisible()
    await this.customTestSuite.click()
    await this.customTestSuiteTitleField.isVisible()
    await this.clearThenSetValue(this.customTestSuiteTitleField, CustomTitle)
    await this.clearThenSetValue(
      this.customTestSuiteDescriptionField,
      CustomDescription
    )
    await this.confirmCustomSuiteBtn.click()
  }

  async clickCreatedTestSuite(testSuiteTitle: string) {
    return this.page
      .locator('.ant-table-cell', { hasText: testSuiteTitle })
      .click()
  }

  async enterTemplateTestSuiteTitleAndDescription(
    testSuiteTitle,
    testSuiteDescription
  ) {
    await this.clearThenSetValue(this.templateTitleInputField, testSuiteTitle)
    await this.clearThenSetValue(
      this.templateDescriptionInputField,
      testSuiteDescription
    )
    await this.doneBtn.waitFor()
    await this.doneBtn.click()
  }

  async getTestSuiteTitle() {
    return await this.testSuiteTitles.allInnerTexts()
  }

  async deleteSuiteFromTestCasePage() {
    await this.page.goBack()
    await this.deleteBtn.click()
    await this.confrimDeletion.isVisible()
    await this.confrimDeletion.click()
    await this.emptyTestSuitetext.waitFor()
  }

  async enterCustomTestSuiteTitleAndDescription(
    testSuiteTitle,
    testSuiteDescription
  ) {
    await this.clearThenSetValue(this.customTestSuiteTitleField, testSuiteTitle)
    await this.clearThenSetValue(
      this.customTestSuiteDescriptionField,
      testSuiteDescription
    )
    await this.doneBtn.isEnabled()
    await this.doneBtn.click()
  }

  async openTestSuiteModal() {
    await this.blueNewTestSuiteBtn.click()
    await this.testSuiteModal.isVisible()
  }

  async chooseTemplate(templateChoice) {
    await this.page.locator('.ant-col', { hasText: templateChoice }).click()
    await this.nextBtn.click()
  }

  async chooseTestCase(position: number) {
    await this.page
      .locator(`.ant-table .ant-table-row:nth-child(${position + 1}) input`)
      .click();
  }

  async getTestCaseTitles() {
    return await this.testCaseTitle.allInnerTexts()
  }
}
