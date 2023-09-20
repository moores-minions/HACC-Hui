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
    await testController.scroll(Selector('#add-skill-button'), 'bottomRight');
    await testController.click('#add-skill-button');
  }

  async gotoAddToolPage(testController) {
    await testController.scroll(Selector('#add-tool-button'), 'bottomRight');
    await testController.click('#add-tool-button');
  }

  async gotoAddChallengePage(testController) {
    await testController.scroll(Selector('#add-challenge-button'), 'bottomRight');
    await testController.click('#add-challenge-button');
  }
}

export const configurehaccPage = new ConfigureHACCPage();
