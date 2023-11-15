import { Selector } from 'testcafe';

class AgePage {
  constructor() {
    this.pageId = '#age-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.wait(2500).expect(this.pageSelector.exists).ok();
  }
}

export const agePage = new AgePage();
