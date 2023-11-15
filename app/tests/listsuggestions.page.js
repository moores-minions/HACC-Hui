import { Selector } from 'testcafe';

class ListsuggestionsPage {
  constructor() {
    this.pageId = '#list-suggestions';
    this.altId = '#no-suggestions';
    this.pageSelector = new Selector(this.pageId);
    this.emptySelector = new Selector(this.altId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await (testController.wait(2500).expect(this.pageSelector.exists).ok() ||
      testController.wait(2500).expect(this.emptySelector.exists).ok());
  }
}

export const listSuggestionsPage = new ListsuggestionsPage();
