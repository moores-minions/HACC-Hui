import { Selector } from 'testcafe';

class ListteamswidgetPage {
  constructor() {
    this.pageId = '#open-teams';
    this.pageSelector = new Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(10001).expect(this.pageSelector.exists).ok();
  }
}

export const listteamswidgetPage = new ListteamswidgetPage();
