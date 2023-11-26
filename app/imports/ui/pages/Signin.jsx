import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import { Participants } from '../../api/user/ParticipantCollection';
import { ROUTES } from '../../startup/client/route-constants';
import { Administrators } from '../../api/user/AdministratorCollection';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 * @memberOf ui/pages
 */
const Signin = ({ location }) => {

  const [emailState, setEmail] = useState('');
  const [passwordState, setPassword] = useState('');
  const [errorState, setError] = useState('');
  const [redirect, setRedirect] = useState(false);

  /** Update the form controls each time the user interacts with them. */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  /** Handle Signin submission using Meteor's account mechanism. */
  const submit = (event) => {
    event.preventDefault();
    const email = emailState;
    const password = passwordState;
    if (Administrators.findOne({ username: email }) === undefined &&
      Participants.findOne({ username: email }) === undefined) {
      setError('User not found');
    } else {
      Meteor.loginWithPassword(email, password, (err) => {
        if (err) {
          setError(err.reason);
        } else {
          setError('');
          setRedirect(true);
        }
      });
    }
  };

  let pathname = ROUTES.LANDING;
  if (Participants.isDefined(Meteor.userId())) {
    const dev = Participants.findDoc({ userID: Meteor.userId() });
    if (dev.isCompliant) {
      if (dev.editedProfile) {
        pathname = ROUTES.LANDING;
      } else {
        pathname = ROUTES.CREATE_PROFILE;
      }
    } else {
      pathname = ROUTES.AGE_CONSENT;
    }
  }

  const { from } = location.state || { from: { pathname } };

  if (redirect) {
    return <Redirect to={from}/>;
  }

  return (
    <Container id="signin-page"
               fluid style={{ paddingLeft: 250, paddingRight: 250, paddingTop: 30, paddingBottom: 75 }}>
      <Row className="justify-content-md-center align-items-center">
        <Col md={6}>
          <h2 className="text-center" style={{ paddingBottom: 10 }}>
            Login to your account
          </h2>
          <Form onSubmit={submit}>
            <div
              className="modal show"
              style={{ display: 'block', position: 'initial' }}
            >
              <Modal.Dialog size={'lg'}>
                <Modal.Body>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      id="signin-form-email"
                      type="email"
                      placeholder="E-mail address"
                      name="email"
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      id="signin-form-password"
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Button id="signin-form-submit" variant="primary" type="submit">
                    Submit
                  </Button>
                </Modal.Body>
              </Modal.Dialog>
            </div>
          </Form>
          {errorState && (
            <Alert variant="danger" className="mt-3">
              <Alert.Heading>Login was not successful</Alert.Heading>
              <p>{errorState}</p>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

Signin.propTypes = {
  location: PropTypes.object,
};

export default Signin;
