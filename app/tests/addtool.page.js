import { Selector } from 'testcafe';

class AddtoolPage {
  constructor() {
    this.pageId = '#add-tool-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async addTool(testController, name, description) {
    await this.isDisplayed(testController);
    await testController.typeText('#name', name);
    await testController.typeText('#description', description);
    await testController.click('#add-tool-submit');
  }
}

export const addtoolPage = new AddtoolPage();
