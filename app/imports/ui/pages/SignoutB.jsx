import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col } from 'react-bootstrap';

/**
 * After the user clicks the "Signout" link in the NavBar, log them out and display this page.
 * @memberOf ui/pages
 */
const SignoutB = () => {
  Meteor.logout();
  return (
      <Col id="signout-page" className ="text-center py-3"><h3><b>You are signed out.</b></h3></Col>
  );
};

export default SignoutB;
