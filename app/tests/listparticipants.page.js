import { Selector } from 'testcafe';
// import { NavBar } from './navbar.component';

class ListParticipantsPage {
  constructor() {
    this.pageId = '#list-participants-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

}

export const listParticipantsPage = new ListParticipantsPage();
