import { Selector } from 'testcafe';

class UpdateMinorParticipantsCompliantPage {
  constructor() {
    this.pageId = '#minor-participant-list';
    this.emptyId = '#no-minors';
    this.pageSelector = Selector(this.pageId);
    this.emptySelector = Selector(this.emptyId);
  }

  async isDisplayed(testController) {
    // change when more minor participants are added
    await testController.expect(this.emptySelector().exists).ok();
  }
}

export const updateMinorsPage = new UpdateMinorParticipantsCompliantPage();
