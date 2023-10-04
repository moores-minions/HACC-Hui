import { Selector } from 'testcafe';

class YourTeamsPage {
  constructor() {
    this.pageId = '#your-teams';
    this.pageSelector = Selector(this.pageId);
    this.inviteId = '#inv-NoM5s2evYrCSjDxkr';
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(10001).expect(this.pageSelector.exists).ok();
  }

  async invite(testController, invitee) {
    await testController.click(this.inviteId);
    await testController.typeText('#email', invitee);
    await testController.click('#submit');
  }
}

export const yourTeamsPage = new YourTeamsPage();
