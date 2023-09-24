import { Selector } from 'testcafe';

class AddChallengePage {
  constructor() {
    this.pageId = '#add-challenge-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async addChallenge(testController, title, description, subDetail, pitch) {
    await this.isDisplayed(testController);
    await testController.typeText('#title', title);
    await testController.typeText('#description', description);
    await testController.typeText('#submission-detail', subDetail);
    await testController.typeText('#pitch', pitch);
    await testController.click('#add-challenge-submit');
  }
}

export const addChallengePage = new AddChallengePage();
