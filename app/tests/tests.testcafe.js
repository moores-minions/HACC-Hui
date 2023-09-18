import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signoutPage } from './signout.page';
import { navBar } from './navbar.component';
import { helpPage } from './help.page';
import { notFoundPage } from './notFound.page';
import { addskillPage } from './addskill.page';
import { configurehaccPage } from './configureHACC.page';
import { addtoolPage } from './addtool.page';
import { addchallengePage } from './addchallenge.page';
import { dumpdatabasePage } from './dumpdatabase.page';
import { allteamsinvitationPage } from './allteamsinvitationpage'

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'admin@hacchui.ics.foo.com', password: 'changeme' };
// const newCreds = { username: 'abc@foo.com', licensePlate: 'ABC123', password: 'changeme', hasPass: 'True' };

const testaddskill = { name: 'test', description: 'testing' };
const testaddtool = { name: 'test', description: 'testing' };
const testaddchallenge = { title: 'test', description: 'testing', subDetail: 'ok', pitch: 'bruh' };
const testDumpDatabase = { database: './Downloads/hacchui-db.zip', teams: './Downloads/hacchui-teams.zip' };

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
  await addskillPage.addSkill(testController, testaddskill.name, testaddskill.description);
});

test('Test that the add tool page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoConfigureHACC(testController);
  await configurehaccPage.gotoAddToolPage(testController);
  await addtoolPage.addTool(testController, testaddtool.name, testaddtool.description);
});

test('Test that the challenge tool page shows up and works', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoConfigureHACC(testController);
  await configurehaccPage.gotoAddChallengePage(testController);
  await addchallengePage.addChallenge(testController, testaddchallenge.title,
    testaddchallenge.description, testaddchallenge.subDetail, testaddchallenge.pitch);
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
  await navBar.gotoHelpPage(testController);
  await allteamsinvitationPage.isDisplayed(testController);
});
