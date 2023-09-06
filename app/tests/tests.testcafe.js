import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { navBar } from './navbar.component';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'jenny@foo.com', password: 'changeme' };
// const newCreds = { username: 'abc@foo.com', licensePlate: 'ABC123', password: 'changeme', hasPass: 'True' };

fixture('HACC-HUI Test')
  .page('http://localhost:3400/');

test('Test that landing page shows up and all pages work', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that an admin can sign in', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.logout(testController);
  // await signoutPage.isDisplayed(testController);
});
