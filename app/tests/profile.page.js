import { Selector } from 'testcafe';

class ProfilePage {
  constructor() {
    this.pageId = '#profile-page';
    this.pageSelector = Selector(this.pageId);
    this.leaveSelector = Selector('.btn').withText('Leave team');
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 5 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(2500).expect(this.pageSelector.exists).ok();
  }

  async gotoEditProfilePage(testController) {
    await testController.scroll(Selector('#edit-profile-button'), 'bottomLeft');
    await testController.click('#edit-profile-button');
  }

  async leaveTeam(testController) {
    await testController.scroll(this.leaveSelector, 'bottomLeft');
    await testController.click(this.leaveSelector);
    await testController.pressKey('tab');
    await testController.pressKey('enter');
  }

}

export const profilePage = new ProfilePage();
