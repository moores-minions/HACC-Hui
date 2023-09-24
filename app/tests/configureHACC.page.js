import { Selector } from 'testcafe';
// import { Challenges } from '../imports/api/challenge/ChallengeCollection';

class ConfigureHACCPage {
  constructor() {
    this.pageId = '#configurePage';
    this.pageSelector = Selector(this.pageId);
    // this.testId = Challenges.findOne({ title: 'test' })._id;
    this.challengeId = 'Zcmy269MoDFCAzooX';
    this.skillId = 'KCnEyPjjWLnygGzT5';
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

  async gotoEditChallengePage(testController) {
    await testController.scroll(Selector(`#edit-${this.challengeId}`), 'bottomRight');
    await testController.click(`#edit-${this.challengeId}`);
  }

  async gotoEditSkillPage(testController) {
    await testController.scroll(Selector(`#edit-${this.skillId}`), 'bottomRight');
    await testController.click(`#edit-${this.skillId}`);
  }
}

export const configurehaccPage = new ConfigureHACCPage();
