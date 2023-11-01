import { Selector } from 'testcafe';

class EditProfileWidgetPage {
    constructor() {
        this.pageId = '#editprofile-page';
        this.pageSelector = Selector(this.pageId);
    }

    /** Asserts that this page is currently displayed. */
    async isDisplayed(testController) {
        // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
        await testController.expect(this.pageSelector.exists).ok();
    }

    async editProfile(testController, aboutme) {
        await this.isDisplayed(testController);
        await testController.typeText('#aboutme', aboutme);
        await testController.wait(5001);

        await testController.click('#edit-profile-submit');
  }
}

export const editProfileWidgetPage = new EditProfileWidgetPage();
