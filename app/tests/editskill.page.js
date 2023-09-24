import { Selector } from 'testcafe';

class EditSkillPage {
  constructor() {
    this.pageId = '#edit-skill-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async editSkill(testController, description) {
    await this.isDisplayed(testController);
    await testController.typeText('#description', description);
    await testController.click('#edit-skill-submit');
  }
}

export const editSkillPage = new EditSkillPage();
