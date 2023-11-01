import { Selector } from 'testcafe';

class ProfilePage {
  constructor() {
    this.pageId = '#profile-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 5 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(5001).expect(this.pageSelector.exists).ok();
  }

  async gotoEditProfilePage(testController) {
    await testController.scroll(Selector('#edit-profile-button'), 'bottomLeft');
    await testController.click('#edit-profile-button');
  }

}

export const profilePage = new ProfilePage();
