import { Selector } from 'testcafe';

class TeamInvitationsPage {
  constructor() {
    this.pageId = '#team-invitations';
    this.emptyId = '#no-invitations';
    this.pageSelector = Selector(this.pageId);
    this.emptySelector = Selector(this.emptyId);
    this.accept = Selector('.btn').withText('Accept Request');
    this.decline = Selector('btn').withText('Decline Request');
  }

  async isDisplayed(testController) {
    await testController.wait(2500).expect(this.pageSelector.exists).ok();
  }

  async acceptInvitation(testController) {
    await testController.click(this.accept);
    await testController.pressKey('esc');
  }
}

export const teamInvitationsPage = new TeamInvitationsPage();
