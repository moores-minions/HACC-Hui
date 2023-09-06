import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { Participants } from '../../api/user/ParticipantCollection';
import { ROUTES } from '../../startup/client/route-constants';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 * @memberOf ui/pages
 */
class Signin extends React.Component {

  /** Initialize component state with properties for login and redirection.
   * @param props {Object} the properties.
   */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', redirectToReferer: false, role: '' };
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  /** Handle Signin submission using Meteor's account mechanism. */
  submit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        let role = ROLE.PARTICIPANT;
        if (Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN)) {
          role = ROLE.ADMIN;
        }
        this.setState({ error: '', redirectToReferer: true, role });
      }
    });
  }

  // Render the signin form.
  render() {
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

    const { from } = this.props.location.state || { from: { pathname } };

    if (this.state.redirectToReferer) {
      return <Redirect to={from} />;
    }

    return (
      <Container id="signin-page" fluid
                 style={ { paddingLeft: 250, paddingRight: 250, paddingTop: 30, paddingBottom: 75 } }>
        <Row className="justify-content-md-center align-items-center">
          <Col md={6}>
            <h2 className="text-center" style={ { paddingBottom: 10 } }>
              Login to your account
            </h2>
            <Form onSubmit={this.submit}>
              <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
              >
                <Modal.Dialog size={'lg'}>
                  <Modal.Body>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="E-mail address"
                        name="email"
                        id="signin-form-email"
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        id="signin-form-password"
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                    <Button id="signin-form-submit" variant="primary" type="submit">
                      Submit
                    </Button>
                  </Modal.Body>
                </Modal.Dialog>
              </div>
            </Form>
            {this.state.error && (
              <Alert variant="danger" className="mt-3">
                <Alert.Heading>Login was not successful</Alert.Heading>
                <p>{this.state.error}</p>
              </Alert>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

Signin.propTypes = {
  location: PropTypes.object,
};

export default Signin;
