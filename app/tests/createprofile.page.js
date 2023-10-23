import { Selector } from 'testcafe';

class CreateProfilePage {
  constructor() {
    this.pageId = '#create-profile';
    this.pageSelector = Selector(this.pageId);
    this.profileId = '#profile-page';
    this.profileSelector = Selector(this.profileId);
    this.demographicId = '#demographic-level';
    this.demographic = Selector(this.demographicId).withText('College');
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async createProfile(testController, bio) {
    await this.isDisplayed(testController);
    await testController.click('#demographic-level');
    await testController.click(this.demographic);
    await testController.typeText('#about-me', bio);
    await testController.click('#create-profile-submit');
  }
}

export const createProfilePage = new CreateProfilePage();
