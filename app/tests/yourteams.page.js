import { Selector } from 'testcafe';

class YourTeamsPage {
  constructor() {
    this.pageId = '#your-teams';
    this.pageSelector = Selector(this.pageId);
    this.inviteId = '#inv-JhXPXRoTY7HQT24qm';
    this.interested = Selector('a').withText('See interested participants');
    this.edit = Selector('a').withText('Edit Team');
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(2500).expect(this.pageSelector.exists).ok();
  }

  async invite(testController, invitee) {
    // await testController.click(this.inviteId);
    await testController.click(Selector('btn').withText('Invite Participants'));
    await testController.typeText('#email', invitee);
    await testController.click('#submit');
    await testController.pressKey('esc');
    await testController.pressKey('esc');
  }

  async seeInterested(testController) {
    await testController.click(this.interested);
  }

  async gotoEditTeamPage(testController) {
    await testController.click(this.edit);
  }
}

export const yourTeamsPage = new YourTeamsPage();
