import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
const Landing = () => (
  <Container id='landing-page' fluid className='landingPage'>
    <Row style={{ margin: 50 }}>
      <Col className='landingCol1'>
        <b className='landingHeader'>
          Welcome to HACC-Hui
        </b>
        <p>
          Our goal is to simplify team formation and ongoing team management
          for the Hawaii Annual Code Challenge.
        </p>
        <br/>
        <p>
          Here you can create a new team or join an already made one. Our
          application can help you find the perfect team for you, or help
          you look for members that fit your team’s requirements.
          {/* keeps the following elements aligned to the left */}
          <br/>
          <br/>
          <b>Deadlines:</b> <br/>
          Team Formation: <b>October 18th, 5 pm.</b><br/>
          Team Challenge selection: <b>October 18th, 5 pm.</b>
        </p>
      </Col>
      <Col className='landingCol1'>
        <Image fluid style={{
          width: 300,
          display: 'block',
          margin: 'auto',
        }} src='/images/HACC_icon_2022.png'/>
      </Col>
    </Row>
    <Row style={{ backgroundColor: '#E5F0FE' }}>
      <Row>
        <Col className='landingCol2'>
          <Image fluid src='/images/profile8.png'/>
          <b>
            Develop your profile
          </b>
          <p>
            Create your profile to participate in HACC
          </p>
        </Col>
        <Col className='landingCol2'>
          <Image fluid src='/images/team.png'/>
          <b>
            Create a team
          </b>
          <p>
            Create your team to solve a challenge and win the HACC
          </p>
        </Col>
      </Row>
      <Row>
        <Col className='landingCol2'>
          <Image fluid src='/images/join.png'/>
          <b>
            Join a team
          </b>
          <p>
            Find a team to join and tackle a challenge together
          </p>
        </Col>
        <Col className='landingCol2'>
          <Image fluid src='/images/slackicon.png'/>
          <b>
            Utilize Slack
          </b>
          <p>
            Communicate with your team through Slack
          </p>
        </Col>
      </Row>
      <Row>
        <Col className='landingCol2'>
          <Icon.EyeFill size={132}/>
          <b>
            <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
          </b>
        </Col>
        <Col className='landingCol2'>
          <Image fluid style={{ width: 132 }} src='/images/gavel.png'/>
          <b>
            <a href="https://hacc.hawaii.gov/hacc-judging-criteria/">HACC Judging Criteria</a>
          </b>
        </Col>
      </Row>
    </Row>
  </Container>
);

export default Landing;
