import { Selector } from 'testcafe';

class OpenTeamPage {
  constructor() {
    this.pageId = '#open-teams';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 5 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(5001).expect(this.pageSelector.exists).ok();
  }

  async clickFilter(testController) {
    await testController.click('#filter-button');
  }
}

export const openteamPage = new OpenTeamPage();
