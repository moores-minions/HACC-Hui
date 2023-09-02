import { Selector } from 'testcafe';

class LandingPage {
  constructor() {
    this.pageId = 'landing-page';
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.wait(20001).expect(this.pageSelector.exists).ok();
  }
}

export const landingPage = new LandingPage();
