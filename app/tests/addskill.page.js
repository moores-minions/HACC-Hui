import { Selector } from 'testcafe';

class AddSkillPage {
  constructor() {
    this.pageId = '#add-skill-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.expect(this.pageSelector.exists).ok();
  }

  async addSkill(testController, name, description) {
    await this.isDisplayed(testController);
    await testController.typeText('#name', name);
    await testController.typeText('#description', description);
    await testController.click('#add-skill-submit');
  }
}

export const addSkillPage = new AddSkillPage();
