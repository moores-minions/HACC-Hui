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
    await testController.scroll(Selector('#addSkillButton'), 'bottomRight');
    await testController.click('#addSkillButton');
  }

  async gotoAddToolPage(testController) {
    await testController.scroll(Selector('#addToolButton'), 'bottomRight');
    await testController.click('#addToolButton');
  }

  async gotoAddChallengePage(testController) {
    await testController.scroll(Selector('#addChallengeButton'), 'bottomRight');
    await testController.click('#addChallengeButton');
  }
}

export const configurehaccPage = new ConfigureHACCPage();
