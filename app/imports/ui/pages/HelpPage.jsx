import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HelpPage.css'; // Import the CSS file

const HelpPage = () => (
      <Container id="help-page" fluid className="help-page-container">
        <div className="text-center">
          <p className="large-font">Questions By Category</p>
          <hr />
          <h5>GENERAL</h5>
          <Row className="justify-content-center">
            <Col md={5} className="mb-4 pad-30">
              <h1 className="bold">How do I Register?</h1>
              <h2><a href="https://slack.com/signin#/signin">Join The Slack Workspace</a></h2>
              <p className="bold">
                {/* Broken down to segments to circumvent ESLint errors */}
                {'You will need to make a Slack account if you do not have a pre-existing one.'}
                {' Join the Slack Workspace and type '}
                &apos;register&apos;{'. '}
                {'You will then be given a username and password to login.'}
              </p>
            </Col>
            <Col md={5} className="mb-4 pad-30">
              <h1 className="bold">What is HACC HUI?</h1>
              <h4 className="bold">
                HACC HUI is an official HACC 2022 site to help participants create and manage their teams.
              </h4>
            </Col>
          </Row>
          <hr />
          <h5>TEAM MANAGEMENT</h5>
          <Row className="justify-content-center">
            <Col md={5} className="mb-4 pad-30">
              <h1 className="bold">Where can I find Teammates?</h1>
              <h2><Link to='list-participants'>List Participants Page</Link></h2>
              <p className="bold">You can view/send an invitation to all participants through this page!</p>
            </Col>
            <Col md={5} className="mb-4 pad-30">
              <h1 className="bold">How do I Create a Team?</h1>
              <h2><Link to='create-team'>Create Teams Page</Link></h2>
              <p className="bold">Make sure to fill out the team creation form fully.</p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={5} className="mb-4 pad-30">
              <h1 className="bold">How do I Leave/Delete my Team?</h1>
              <h2><Link to='your-teams'>Edit Teams Page</Link></h2>
              <p className="bold">Here you can leave, delete, invite, and recruit for your team!</p>
            </Col>
            <Col md={5} className="mb-4 pad-30">
              <h1 className="bold">Can I be on Multiple Teams?</h1>
              <h2>Yes!</h2>
              <p className="bold">
                Although it is suggested that you stay with one team, you are allowed to join multiple teams.
              </p>
            </Col>
          </Row>
          <hr />
          <h5>UNEXPECTED ERRORS</h5>
          <div className="pad-10-30">
            <h1 className="bold">Site not Functioning Properly?</h1>
            <h3>Please screenshot the problem and direct message cmoore@hawaii.edu on Slack</h3>
          </div>
        </div>
      </Container>
    );

export default HelpPage;
