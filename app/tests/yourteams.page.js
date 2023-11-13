import { Selector } from 'testcafe';

class YourTeamsPage {
  constructor() {
    this.pageId = '#your-teams';
    this.pageSelector = Selector(this.pageId);
    this.inviteId = '#inv-NoM5s2evYrCSjDxkr';
    this.interested = Selector('a').withText('See interested participants');
    this.edit = Selector('a').withText('Edit Team');
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

  async seeInterested(testController) {
    await testController.click(this.interested);
  }

  async gotoEditTeamPage(testController) {
    await testController.click(this.edit);
  }
}

export const yourTeamsPage = new YourTeamsPage();
