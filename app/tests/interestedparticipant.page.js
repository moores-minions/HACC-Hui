import { Selector } from 'testcafe';

class InterestedParticipantPage {
  constructor() {
    this.pageId = '#interested-participants';
    this.emptyId = '#no-interested';
    this.pageSelector = Selector(this.pageId);
    this.emptySelector = Selector(this.emptyId);
    this.remove = Selector('btn').withText('Remove');
  }

  async isDisplayed(testController) {
    // change when interested participants show up
    await testController.wait(5000).expect(this.emptySelector.exists).ok();
  }

  async removeInterested(testController) {
    await this.isDisplayed(testController);
    await testController.click(this.remove);
  }
}

export const interestedParticipantPage = new InterestedParticipantPage();
