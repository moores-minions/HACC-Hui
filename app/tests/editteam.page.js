import { Selector } from 'testcafe';

class EditTeamPage {
  constructor() {
    this.pageId = '#edit-team-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async editTeam(testController, description) {
    await this.isDisplayed(testController);
    await testController.typeText('#affiliation', description);
    await testController.scroll(Selector('#submit'), 'bottomRight');
    await testController.click('#submit');
  }
}

export const editTeamPage = new EditTeamPage();
