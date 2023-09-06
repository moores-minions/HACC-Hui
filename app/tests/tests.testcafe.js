import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signoutPage } from './signout.page';
import { navBar } from './navbar.component';
import { helpPage } from './help.page';
import { notFoundPage } from './notFound.page';
import { addskillPage } from './addskill.page';
import { configurehaccPage } from './configureHACC.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'admin@hacchui.ics.foo.com', password: 'changeme' };
// const newCreds = { username: 'abc@foo.com', licensePlate: 'ABC123', password: 'changeme', hasPass: 'True' };

const testaddskill = { name: 'test', description: 'testing' };

fixture('HACC-HUI Test')
  .page('http://localhost:3400/');

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
  await configurehaccPage.isDisplayed(testController);
  await configurehaccPage.gotoAddSkillPage(testController);
  await addskillPage.addSkill(testController, testaddskill.name, testaddskill.description);
});
