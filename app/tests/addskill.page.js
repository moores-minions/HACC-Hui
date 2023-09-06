import { Selector } from 'testcafe';

class AddskillPage {
  constructor() {
    this.pageId = '#add-skill-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(10001).expect(this.pageSelector.exists).ok();
  }

  async add_skill(testController, name, description) {
    await testController.typeText('#name', name);
    await testController.typeText('#description', description);
    await testController.click('#add-skill-sub');
  }
}

export const addskillPage = new AddskillPage();
