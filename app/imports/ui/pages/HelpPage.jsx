import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class HelpPage extends React.Component {
  render() {
    return (
      <Container fluid style={{ margin: '30px', padding: '30px', backgroundColor: '#E5F0FE', borderRadius: '15px' }}>
        <div className="text-center">
          <p style={{ fontSize: '40px', paddingTop: '20px' }}>Questions By Category</p>
          <hr />
          <h5>GENERAL</h5>
          <Row className="justify-content-center">
            <Col md={5} className="mb-4" style={{ paddingTop: '30px' }}>
              <h1><b>How do I Register?</b></h1>
              <h2><a href="https://slack.com/signin#/signin">Join The Slack Workspace</a></h2>
              <p>
                <b>
                  {/* Broken down into separate strings and &apos; for ESLint */}
                  {'You will need to make a Slack account if you do not have a pre-existing one.'}
                  {' Join the Slack Workspace and type '}
                  &apos;register&apos;{'. '}
                  {'You will then be given a username and password to login.'}
                </b>
              </p>

            </Col>
            <Col md={5} className="mb-4" style={{ paddingTop: '30px' }}>
              <h1><b>What is HACC HUI?</b></h1>
              <h4><b>HACC HUI is an official HACC 2022 site to help participants create and manage their teams.</b></h4>
            </Col>
          </Row>

          <hr />
          <h5>TEAM MANAGEMENT</h5>
          <Row className="justify-content-center">
            <Col md={5} className="mb-4" style={{ paddingTop: '30px' }}>
              <h1><b>Where can I find Teammates?</b></h1>
              <h2><Link to='list-participants'>List Participants Page</Link></h2>
              <p><b>You can view/send an invitation to all participants through this page!</b></p>
            </Col>
            <Col md={5} className="mb-4" style={{ paddingTop: '30px' }}>
              <h1><b>How do I Create a Team?</b></h1>
              <h2><Link to='create-team'>Create Teams Page</Link></h2>
              <p><b>Make sure to fill out the team creation form fully.</b></p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={5} className="mb-4" style={{ paddingTop: '30px' }}>
              <h1><b>How do I Leave/Delete my Team?</b></h1>
              <h2><Link to='your-teams'>Edit Teams Page</Link></h2>
              <p><b>Here you can leave, delete, invite, and recruit for your team!</b></p>
            </Col>
            <Col md={5} className="mb-4" style={{ paddingTop: '30px' }}>
              <h1><b>Can I be on Multiple Teams?</b></h1>
              <h2>Yes!</h2>
              <p>
                <b>
                  Although it is suggested that you stay with one team, you are allowed to join multiple teams.
                </b>
              </p>
            </Col>
          </Row>

          <hr />
          <h5>UNEXPECTED ERRORS</h5>
          <div style={{ paddingTop: '10px', paddingBottom: '30px' }}>
            <h1><b>Site not Functioning Properly?</b></h1>
            <h3>Please screenshot the problem and direct message cmoore@hawaii.edu on Slack</h3>
          </div>
        </div>
      </Container>
    );
  }
}

export default HelpPage;
