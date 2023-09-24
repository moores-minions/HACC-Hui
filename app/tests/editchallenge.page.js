import { Selector } from 'testcafe';

class EditChallengePage {
  constructor() {
    this.pageId = '#edit-challenge-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async editChallenge(testController, pitch) {
    await this.isDisplayed(testController);
    await testController.typeText('#pitch', pitch);
    await testController.click('#edit-challenge-submit');
  }
}

export const editChallengePage = new EditChallengePage();