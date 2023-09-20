import { Selector } from 'testcafe';
// import { NavBar } from './navbar.component';

class DumpdatabasePage {
  constructor() {
    this.pageId = '#dump-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Fills out and submits the form to signin, then checks to see that login was successful. */
  async dumpDatabase(testController, database, teams) {
    await this.isDisplayed(testController);
    await testController.click('#database-button');
    await testController.click('#teams-button');
    await testController.navigateTo(database);
    await testController.navigateTo(teams);
  }
}

export const dumpdatabasePage = new DumpdatabasePage();
