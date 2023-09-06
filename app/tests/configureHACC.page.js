import { Selector } from 'testcafe';

class ConfigureHACCPage {
  constructor() {
    this.pageId = '#configurePage';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.expect(this.pageSelector.exists).ok();
  }

  async gotoAddSkillPage(testController) {
    await testController.click('#addSkillButton');
  }
}

export const configurehaccPage = new ConfigureHACCPage();
