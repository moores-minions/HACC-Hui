import { Selector } from 'testcafe';

class NavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector('#navbar-current-user').exists;
    if (loggedInUser) {
      await testController.click('#navbar-current-user');
      await testController.click('#navbar-sign-out');
    }
  }

  async gotoSigninPage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#login-dropdown');
    await testController.click('#login-dropdown-sign-in');
  }

  async gotoHelpPage(testController) {
    await testController.click('#help-page');
  }

  async gotoAllTeamInvitationsPage(testController) {
    await testController.click('#al-in');
  }

  async gotoConfigureHACC(testController) {
    await testController.click('#configHACC');
  }

  async gotoAddSkillPage(testController) {
    await testController.click('#add-skills-nav');
  }

  async gotoDatabasePage(testController) {
    await testController.click('#databaseMenuItem');
  }

  async gotoInterestsPage(testController) {
    await testController.click('#interestsMenuItem');
  }

  async gotoEditInterests(testController) {
    await testController.click('#adminMenuItem');
  }

  async gotoAdminEditUser(testController) {
    await testController.click('#adminMenuItemUser');
  }

  async gotoAddClubPage(testController) {
    await testController.click('#addClubMenuItem');
  }

  async gotoDumpDatabasePage(testController) {
    await testController.click('#dump-page');
  }

  async gotoListPartsPage(testController) {
    await testController.click('#list-parts');
  }

  async gotoYourTeamsPage(testController) {
    await testController.click('#your-teams');
  }

  async gotoListSuggestionsPage(testController) {
    await testController.click('#list-suggestions');
  }

  async gotoListParticipantsPage(testController) {
    await testController.click('#list-participants');
  }

  async gotoDeleteAccount(testController) {
    await testController.click('#navbar-current-user');
    await testController.click('#delete-account');
  }

  /** Check that the specified user is currently logged in. */
  async isLoggedIn(testController, username) {
    await testController.expect(Selector('#navbar-current-user').innerText).eql(username);
  }

  /** Check that someone is logged in, then click items to logout. */
  async logout(testController) {
    await testController.expect(Selector('#navbar-current-user').exists).ok();
    await testController.click('#navbar-current-user');
    await testController.click('#navbar-sign-out');
  }

  /** Pull down login menu, go to sign up page. */
  async gotoSignupPage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#login-dropdown');
    await testController.click('#login-dropdown-sign-up');
  }

  async gotoProfilePage(testController) {
    await testController.click('#profile');
  }

  async gotoSuggestToolSkill(testController) {
    await testController.click('#suggest-tool-skill');
  }

  async gotoOpenTeams(testController) {
    await testController.click('#open-teams');
  }

  async gotoUpdateMinors(testController) {
    await testController.click('#update-minors');
  }

  async gotoTeamInvitations(testController) {
    await testController.click('#invitations');
  }
}
export const navBar = new NavBar();
