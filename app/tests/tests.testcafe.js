import { landingPage } from './landing.page';
import { notFoundPage } from './notFound.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
// const credentials = { username: 'admin@foo.com', password: 'changeme' };
// const newCreds = { username: 'abc@foo.com', licensePlate: 'ABC123', password: 'changeme', hasPass: 'True' };

fixture('HACC-HUI Test')
  .page('http://localhost:3400');

test('Test that landing page shows up and all pages work', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that NotFound page shows up and all pages work', async (testController) => {
  await notFoundPage.isDisplayed(testController);
}).page('http://localhost:3400/#/NotFound');