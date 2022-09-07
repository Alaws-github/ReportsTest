import type { Page } from '@playwright/test'
import { HeaderSection } from './sections/header.section'
import { BasePage } from './page'

export class ProjectPage extends BasePage {
    constructor(page: Page) {
        super({ page, url: '/' })
    }

    header = new HeaderSection(this.page);

    get newProjectBtn() { return this.page.locator('button:has-text("New Project")') }
    get createProjectSubmitBtn() { return this.page.locator('button:has-text("Create Project")') }
    get createProjectModalTitle() { return this.page.locator('#rcDialogTitle2') }
    get projectTypeField() { return this.page.locator('#register_type') }
    get projectDescriptionField() { return this.page.locator('#register_description') }
    get projectTitleField() { return this.page.locator('#register_title') }
    get newProjectDialogTitle() { return this.page.locator('.ant-modal-title') }
    get newProjectBody() { return this.page.locator('ant-modal-body') }
    get newProjectForm() { return this.page.locator('form.ant-form') }
    get closableAlert() { return this.page.locator('.ant-notification-notice.ant-notification-notice-closable') }
    get listOfProjects() { return this.page.locator('.ant-list-item >> nth= -1') }
    get newProjectCard() { return this.page.locator('.ant-list-item').last() }
    get newProjectCardTitle() { return this.page.locator('.ant-card-meta-detail>.ant-card-meta-title >> nth= -1') }
    get newProjectCardDescription() { return this.page.locator('.ant-card-meta-detail>.ant-card-meta-description >> nth= -1') }
    get newProjectCardType() { return this.page.locator('.ant-card-meta-detail>.ant-card-meta-description>.ant-tag >> nth= -1') }
    get profileBtn() { return this.page.locator('.ant-menu-submenu>.ant-menu-submenu-title>.ant-avatar-circle') }
    get firstSignUpOkBtn() { return this.page.locator('button:has-text("OK")') }
    get titleOnMenuBar() { return this.page.locator('div[role="button"]:has-text("Test Automation")') }
    get existingProject() { return this.page.locator('.ant-card-meta-title', { hasText: 'qwat-1224' }) }
    get existingProjectTwo() { return this.page.locator('.ant-card-meta-title', { hasText: 'testone' }) }

    get projectsInWorkspace() { return this.page.locator('.ant-list-item') }
    get projectTitleOnWorkspacePage() { return this.page.locator('.ant-list-item') }

    //archive created project
    get archiveProjectBtn() { return this.page.locator('[aria-label="minus-circle"] >> nth= -1') }
    get archiveProjectConfirmBtn() { return this.page.locator('button:has-text("OK")') }

    //This is used to achieve created project for clean up
    async archiveProject() {
        await this.page.reload({ waitUntil: "load" })
        await this.loadingSpinner.waitFor({
            state: 'detached',
        })
        await this.archiveProjectBtn.click();
        await this.archiveProjectConfirmBtn.click();
    }

    //This is used to click the new project button
    async clickNewProjectBtn() {
        await this.newProjectBtn.click();
        await this.page.waitForSelector('form.ant-form')
    }

    //This is used to click the OK button after the new user creates their
    //first project, this button redirects the user to the new project
    async clickfirstProjectOkBtn() {
        await this.page.waitForSelector('.ant-modal-confirm-body-wrapper');
        await this.firstSignUpOkBtn.click();
    }

    //This is used to fill in the information for a new project and click the confirm button
    async fillProjectDetails(projectTitle, projectDescription, projectType) {
        await this.page.waitForSelector('form.ant-form')
        await this.clearThenSetValue(this.projectTitleField, projectTitle);
        await this.clearThenSetValue(this.projectDescriptionField, projectDescription);
        await this.clearThenSetValue(this.projectTypeField, projectType);
        await this.createProjectSubmitBtn.click();
    }

    //This is used to logout of the workspace
    async logout() {
        await this.page.reload({ waitUntil: "load" })
        await this.loadingSpinner.waitFor({
            state: 'detached',
        })
        await this.page.waitForSelector('.ant-menu-submenu>.ant-menu-submenu-title>.ant-avatar-circle');
        await this.profileBtn.click();
        await this.header.logoutLink.click();
        await this.page.waitForSelector('.ant-card-body');
    }

    async waitForProjectsTitleOnWorkspaceToLoad() {
        await this.page.waitForSelector('h1.ant-typography')
    }

    async countProjectsInWorkspace() {
        let projectCount = await this.projectsInWorkspace.count();
        return await projectCount;
    }

    async waitForProjectCountToIncreease() {
        let selector = '.ant-list-item >> nth=' + await this.countProjectsInWorkspace();
        await this.page.waitForSelector(selector)
    }

    async waitForProjectCreationNotification() {
        await this.page.waitForSelector('.ant-notification-notice');
    }


}