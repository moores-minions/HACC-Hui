import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col } from 'react-bootstrap';

/**
 * After the user clicks the "Signout" link in the NavBar, log them out and display this page.
 * @memberOf ui/pages
 */
class Signout extends React.Component {
  render() {
    Meteor.logout();
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h2 className="text-center">You are signed out.</h2>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Signout;
