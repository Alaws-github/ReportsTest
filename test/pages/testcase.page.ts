import type { Page } from '@playwright/test'
import { BasePage } from './page'

export class TestCasePage extends BasePage {
    constructor(page: Page) {
        super({ page, url: '/' })
    }

    //Getters for test cases in test suite
    get newTestCaseBtn() { return this.page.locator('.ant-btn', { hasText: 'New Test Case' }) }
    get testCaseTable() { return this.page.locator('.ant-table-container') }
    get testCaseNumberTag() { return this.page.locator('.ant-tag-blue') }
    get testCaseTableRow() { return this.page.locator('.ant-table-row') }
    get closableAlert() { return this.page.locator('.ant-notification-notice.ant-notification-notice-closable') }
    get testCaseCheckbox() { return this.page.locator('input.ant-checkbox-input') }
    get deleteTestCaseBtn() { return this.page.locator('button', { hasText: 'Delete' }) }
    get deleteTestCaseConfirmBtn() { return this.page.locator('button', { hasText: 'OK' }) }

    //Getters for test case details
    get testCaseDetailModal() { return this.page.locator('.ant-card-body') }
    get testCaseDetailTitle() { return this.page.locator('.ant-card-body>>h5>>nth=0') }
    get testCaseDetailPriority() { return this.page.locator('.ant-card-body .ant-tag-blue') }
    get testCaseDetailPrecondition() { return this.page.locator('.ant-card-body .wmde-markdown span >> nth=0') }
    get testCaseDetailSteps() { return this.page.locator('.ant-card-body .wmde-markdown span >> nth=1') }
    get testCaseDetailExpectedResult() { return this.page.locator('.ant-card-body .wmde-markdown span >> nth=2') }
    get testCaseDetailEditBtn() { return this.page.locator('button', { hasText: 'Edit' }) }
    get testCaseDetailSaveChangestBtn() { return this.page.locator('button', { hasText: 'Save Changes' }) }

    //Getters for empty test suite
    get emptySuiteAddTestCaseBtn() { return this.page.locator('.ant-card-body .wmde-markdown span >> nth=2') }
    get addTestCaseBtn() { return this.page.locator('button', { hasText: 'Add Test Case' }) }

    //Getters for test case form
    get newTestCaseModalTitle() { return this.page.locator('#rcDialogTitle0') }
    get newTestCaseTitle() { return this.page.locator('#form_in_modal_title') }
    get newTestCasePriority() { return this.page.locator('#form_in_modal_priority') }
    get newTestCasePriorityDropdown() { return this.page.locator('div', { hasText: 'P1P2P1P2P3P4' }) }
    get newTestCaseRefId() { return this.page.locator('#form_in_modal_referenceKey') }
    get newTestCaseModalTextBox() { return this.page.locator('[aria-label="Rich Text Editor, main"]') }
    get createNewTestCaseBtn() { return this.page.locator('.ant-btn-primary', { hasText: 'Create' }) }
    get titleNeededAlert() { { return this.page.locator('div[role="alert"]', { hasText: 'Please input the title!' }) } }

    //Getter for edit test case form
    get editTestCaseTitle() { return this.page.locator('#edit-case_title') }
    get editTestCaseRefId() { return this.page.locator('#edit-case_referenceKey') }
    get testCasePriority() { return this.page.locator('.ant-select-selector') }

    //Getter for test casse form
    get testCaseInput() { return this.page.locator('input[type="text"].ant-input') }

    //Click new test case button
    async clickNewTestCaseBtn() {
        await this.newTestCaseBtn.waitFor()
        await this.newTestCaseBtn.click()
    }

    //Click create test case button
    async clickCreateNewTestCaseBtn() {
        await this.createNewTestCaseBtn.waitFor()
        await this.createNewTestCaseBtn.click()
    }

    //Click add test case button
    async clickAddTestCaseBtn() {
        await this.addTestCaseBtn.waitFor()
        await this.addTestCaseBtn.click()
        await this.newTestCaseModalTitle.waitFor()
    }

    //Function to choose edit test case priority 
    async chooseTestCasePriority(priority) {
        await this.testCasePriority.nth(-2).click()
        await this.page.locator('text=' + priority).nth(1).click()
    }

    //Function to fill in new test case form
    async fillTestCaseForm(
        title,
        priority,
        referenceId,
        precondition,
        testSteps,
        expectedResults
    ) {
        await this.clearThenSetValue(this.testCaseInput.nth(-3), title);
        await this.chooseTestCasePriority(priority)
        await this.clearThenSetValue(this.testCaseInput.nth(-2), referenceId);
        await this.clearThenSetValue(this.newTestCaseModalTextBox.nth(0), precondition);
        await this.clearThenSetValue(this.newTestCaseModalTextBox.nth(1), testSteps);
        await this.clearThenSetValue(this.newTestCaseModalTextBox.nth(2), expectedResults);
    }

    //Function to fill in test case title
    async fillNewTestCaseFormTitle(title) {
        await this.clearThenSetValue(this.newTestCaseTitle, title);
        await this.createNewTestCaseBtn.click();
    }

    //Function to count the amount of test cases in test suite
    async countTestCasesInSuite() {
        let testCaseCount = await this.testCaseTableRow.count();
        return await testCaseCount;
    }

    //Function to open test case details
    async openTestCaseDetails() {
        let testCasePostion = await this.countTestCasesInSuite() - 1
        await this.testCaseNumberTag.nth(testCasePostion).click()
    }

    //Fuction to delete new test case
    async deleteNewTestCase(testCase) {
        await this.testCaseCheckbox.nth(testCase).click()
        await this.deleteTestCaseBtn.click()
        await this.deleteTestCaseConfirmBtn.click()
    }

    //Function to wait on new test case to be added
    async waitForNewTestCase(testCaseNumber) {
        await this.page.waitForSelector(".ant-table-row >> nth=" + testCaseNumber)
    }
}