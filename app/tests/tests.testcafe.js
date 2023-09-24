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
import { editChallengePage } from './editchallenge.page';
import { editSkillPage } from './editskill.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'admin@hacchui.ics.foo.com', password: 'changeme' };
const userCred = { username: 'jenny@foo.com', password: 'changeme' };

const testAddSkill = { name: 'test', description: 'testing' };
const testAddTool = { name: 'test', description: 'testing' };
const testAddChallenge = { title: 'test', description: 'testing', subDetail: 'ok', pitch: 'bruh' };
const testDumpDatabase = { database: './Downloads/hacchui-db.zip', teams: './Downloads/hacchui-teams.zip' };
const testEditChallenge = { pitch: 'hehe' };
const testEditSkill = { description: ' tickle' };

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

test('Test that the add challenge page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoConfigureHACC(testController);
  await configurehaccPage.gotoAddChallengePage(testController);
  await addChallengePage.addChallenge(testController, testAddChallenge.title,
    testAddChallenge.description, testAddChallenge.subDetail, testAddChallenge.pitch);
});

test('Test that the edit challenge page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoConfigureHACC(testController);
  await configurehaccPage.gotoEditChallengePage(testController);
  await editChallengePage.editChallenge(testController, testEditChallenge.pitch);
});

test('Test that the edit skill page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoConfigureHACC(testController);
  await configurehaccPage.gotoEditSkillPage(testController);
  await editSkillPage.editSkill(testController, testEditSkill.description);
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
