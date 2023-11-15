import { Selector } from 'testcafe';

class TeamInvitationsPage {
  constructor() {
    this.pageId = '#team-invitations';
    this.emptyId = '#no-invitations';
    this.pageSelector = Selector(this.pageId);
    this.emptySelector = Selector(this.emptyId);
  }

  async isDisplayed(testController) {
    await testController.wait(5000).expect(this.pageSelector.exists).ok();
  }
}

export const teamInvitationsPage = new TeamInvitationsPage();
