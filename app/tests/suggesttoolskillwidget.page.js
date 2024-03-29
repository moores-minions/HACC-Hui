import { Selector } from 'testcafe';

class SuggesttoolskillwidgetPage {
  constructor() {
    this.pageId = '#suggest-tool-skill';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(2500).expect(this.pageSelector.exists).ok();
  }
}
export const suggesttoolskillwidgetPage = new SuggesttoolskillwidgetPage();
