import { Selector } from 'testcafe';

class EditToolPage {
  constructor() {
    this.pageId = '#edit-tool-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async editTool(testController, description) {
    await this.isDisplayed(testController);
    await testController.typeText('#description', description);
    await testController.click('#edit-tool-submit');
  }
}

export const editToolPage = new EditToolPage();
