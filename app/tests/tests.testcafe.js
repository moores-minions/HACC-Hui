import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signoutPage } from './signout.page';
import { navBar } from './navbar.component';
import { helpPage } from './help.page';
import { notFoundPage } from './notFound.page';
import { addSkillPage } from './addskill.page';
import { configurehaccPage } from './configureHACC.page';
import { addToolPage } from './addtool.page';
import { addChallengePage } from './addchallenge.page';
import { dumpdatabasePage } from './dumpdatabase.page';
import { allTeamsInvitationPage } from './allteamsinvitationpage';
import { agePage } from './age.page';
import { listparticipantscardadminPage } from './listparticipantscardadmin.page';
import { yourTeamsPage } from './yourteams.page';
import { listSuggestionsPage } from './listsuggestions.page';
import { listParticipantsPage } from './listparticipants.page';
import { profilePage } from './profile.page';
import { deleteAccountPage } from './deleteaccount.page';
import { suggesttoolskillwidgetPage } from './suggesttoolskillwidget.page';
import { listteamswidgetPage } from './listteamswidget.page';
import { createProfilePage } from './createprofile.page';
import { editSkillPage } from './editskill.page';
import { editToolPage } from './edittool.page';
import { editChallengePage } from './editchallenge.page';
import { updateMinorsPage } from './updateminorparticipantscompliant.page';
import { teamInvitationsPage } from './teaminvitations.page';
import { editProfileWidgetPage } from './editprofilewidget.page';
import { interestedParticipantPage } from './interestedparticipant.page';
import { editTeamPage } from './editteam.page';
/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'admin@hacchui.ics.foo.com', password: 'changeme' };
const userCred = { username: 'jenny@foo.com', password: 'changeme' };

const testAddSkill = { name: 'test', description: 'testing' };
const testAddTool = { name: 'test', description: 'testing' };
const testAddChallenge = { title: 'test', description: 'testing', subDetail: 'ok', pitch: 'bruh' };
const testDumpDatabase = { database: './Downloads/hacchui-db.zip', teams: './Downloads/hacchui-teams.zip' };
const testEditProfile = { aboutme: 'test' };

fixture('HACC-HUI Test')
  .page('http://127.0.0.1:3400/');

test('Test that landing page shows up and all pages work', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that a user can sign in and signout work', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that a user can access the helppage', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoHelpPage(testController);
  await helpPage.isDisplayed(testController);
});

test('Test that NotFound page shows up and all pages work', async (testController) => {
  await notFoundPage.isDisplayed(testController);
}).page('http://localhost:3400/#/NotFound');

test('Test that the add challenge page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoConfigureHACC(testController);
  await configurehaccPage.gotoAddChallengePage(testController);
  await addChallengePage.addChallenge(testController, testAddChallenge.title,
    testAddChallenge.description, testAddChallenge.subDetail, testAddChallenge.pitch);
});

test('Test that add skill page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoConfigureHACC(testController);
  await configurehaccPage.gotoAddSkillPage(testController);
  await addSkillPage.addSkill(testController, testAddSkill.name, testAddSkill.description);
});

test('Test that the add tool page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoConfigureHACC(testController);
  await configurehaccPage.gotoAddToolPage(testController);
  await addToolPage.addTool(testController, testAddTool.name, testAddTool.description);
});

test('Test that the edit challenge page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoConfigureHACC(testController);
  await configurehaccPage.gotoEditChallengePage(testController);
  await editChallengePage.editChallenge(testController, 'amer');
});

test('Test that the edit skill page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoConfigureHACC(testController);
  await configurehaccPage.gotoEditSkillPage(testController);
  await editSkillPage.editSkill(testController, 'icles');
});

test('Test that the edit tool page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoConfigureHACC(testController);
  await configurehaccPage.gotoEditToolPage(testController);
  await editToolPage.editTool(testController, 'nananananana batman');
});

test('Test that an admin can access and download files from the Dump Database page', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoDumpDatabasePage(testController);
  await dumpdatabasePage.dumpDatabase(testController, testDumpDatabase.database, testDumpDatabase.teams);
});

test('Test that an admin can access the View All Team Invitations page ', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoAllTeamInvitationsPage(testController);
  await allTeamsInvitationPage.isDisplayed(testController);
});

test('Test that the age page shows up and works', async (testController) => {
  await testController.navigateTo('http://localhost:3400/#/age-consent');
  await signinPage.signin(testController, userCred.username, userCred.password);
  await agePage.isDisplayed(testController);
});

test('Test that an admin can access the list participants page and its features', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoListPartsPage(testController);
  await listparticipantscardadminPage.listPartsCardAdmin(testController);
});

test('Test that a regular user can access the list participants page and its features', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, userCred.username, userCred.password);
  await navBar.gotoListParticipantsPage(testController);
  await listParticipantsPage.isDisplayed(testController);
});

test('Test that the Your Teams page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, 'aung@foo.com', userCred.password);
  await navBar.gotoYourTeamsPage(testController);
  await yourTeamsPage.invite(testController, 'angeli@foo.com');
});

test('Test that the List Suggestions page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoListSuggestionsPage(testController);
  await listSuggestionsPage.isDisplayed(testController);
});

test('Test that a user can access the "List Participants" page', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, userCred.username, userCred.password);
  await navBar.gotoListParticipantsPage(testController);
  await listParticipantsPage.isDisplayed(testController);
});

test('Test that a user can delete their account', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, userCred.username, userCred.password);
  await navBar.gotoDeleteAccount(testController);
  await deleteAccountPage.isDisplayed(testController);
});

test('Test that the Profile/Edit Profile page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, userCred.username, userCred.password);
  await navBar.gotoProfilePage(testController);
  await profilePage.isDisplayed(testController);
  await profilePage.gotoEditProfilePage(testController);
  await editProfileWidgetPage.editProfile(testController, testEditProfile.aboutme);
});

test('Test that the Suggest Tool/Skill page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, userCred.username, userCred.password);
  await navBar.gotoSuggestToolSkill(testController);
  await suggesttoolskillwidgetPage.isDisplayed(testController);
});

test('Test that the Open Teams page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, userCred.username, userCred.password);
  await navBar.gotoOpenTeams(testController);
  await listteamswidgetPage.isDisplayed(testController);
});

test('Test that the Create Profile page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, 'kentung@foo.com', userCred.password);
  await createProfilePage.isDisplayed(testController);
  await createProfilePage.createProfile(testController, 'test');
});

test('Test that the Update Minor Participants Status page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoUpdateMinors(testController);
  await updateMinorsPage.isDisplayed(testController);
});

test('Test that the participant Team Invitations shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, 'angeli@foo.com', userCred.password);
  await navBar.gotoTeamInvitations(testController);
  await teamInvitationsPage.isDisplayed(testController);
  await teamInvitationsPage.acceptInvitation(testController);
});

test('Test that the interested participant page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, 'aung@foo.com', userCred.password);
  await navBar.gotoYourTeamsPage(testController);
  await yourTeamsPage.seeInterested(testController);
  await interestedParticipantPage.isDisplayed(testController);
});

test('Test that the edit team page and team membership widget show up and work', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, 'aung@foo.com', userCred.password);
  await navBar.gotoYourTeamsPage(testController);
  await yourTeamsPage.gotoEditTeamPage(testController);
  await editTeamPage.editTeam(testController, 'beef');
});

test('Test that the Team Membership widget shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, 'angeli@foo.com', userCred.password);
  await navBar.gotoProfilePage(testController);
  await profilePage.leaveTeam(testController);
});
