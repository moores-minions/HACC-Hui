import { Selector } from 'testcafe';
// import { NavBar } from './navbar.component';

class ListParticipantsCardPage {
  constructor() {
    this.pageId = '#part-card-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Fills out and submits the form to signin, then checks to see that login was successful. */
  async listPartsCard(testController) {
    await this.isDisplayed(testController);
    await testController.click('#more-info-tab');
  }
}

export const listparticipantscardPage = new ListParticipantsCardPage();
