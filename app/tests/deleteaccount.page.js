import { Selector } from 'testcafe';
// import { NavBar } from './navbar.component';

class DeleteAccountPage {
  constructor() {
    this.pageId = '#delete-account';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

}

export const deleteAccountPage = new DeleteAccountPage();
