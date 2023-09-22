import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
const Landing = () => (
  <Container id='landing-page' fluid className='LandingPage'>
    <Row style={{ margin: 50 }}>
      <Col
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <b
          style={{
            color: '#0B2C52',
            fontSize: 30,
            alignSelf: 'flex-start',
            paddingLeft: 20,
            marginBottom: 15,
          }}
        >
          Welcome to HACC-Hui
        </b>
        <p style={{ fontSize: 20, paddingLeft: 20, color: '#0B2C52' }}>
          Our goal is to simplify team formation and ongoing team management
          for the Hawaii Annual Code Challenge.
          <br/>
          <br/>
          Here you can create a new team or join an already made one. Our
          application can help you find the perfect team for you, or help
          you look for members that fit your team’s requirements.
          <br/>
          <br/>
          <b>Deadlines:</b> <br/>
          Team Formation: <b>October 18th, 5 pm.</b><br/>
          Team Challenge selection: <b>October 18th, 5 pm.</b>
        </p>
      </Col>
      <Col
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image fluid style={{
          width: 300,
          display: 'block',
          margin: 'auto',
        }} src='/images/HACC_icon_2022.png'/>
      </Col>
    </Row>
    <Row style={{ backgroundColor: '#E5F0FE' }}>
      <Row>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Image fluid style={{
            width: 150,
            display: 'block',
          }} src='/images/profile8.png'/>
          <b style={{ fontSize: 30, fontStyle: 'italic', margin: 15 }}>
            Develop your profile
          </b>
          <p style={{ fontSize: 20, fontStyle: 'italic' }}>
            Create your profile to participate in HACC
          </p>
        </Col>
          <Col
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Image fluid style={{
              width: 150,
              display: 'block',
              margin: 'auto',
            }} src='/images/team.png'/>
            <b style={{ fontSize: 30, fontStyle: 'italic', margin: 15 }}>
              Create a team
            </b>
            <p style={{ fontSize: 20, fontStyle: 'italic' }}>
              Create your team to solve a challenge and win the HACC
            </p>
          </Col>
      </Row>
      <Row>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Image fluid style={{
            width: 150,
            display: 'block',
            margin: 'auto',
          }} src='/images/join.png'/>
          <b style={{ fontSize: 30, fontStyle: 'italic', margin: 15 }}>
            Join a team
          </b>
          <p style={{ fontSize: 20, fontStyle: 'italic' }}>
            Find a team to join and tackle a challenge together
          </p>
        </Col>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Image fluid style={{
            width: 150,
            display: 'block',
            margin: 'auto',
          }} src='/images/slackicon.png'/>
          <b style={{ fontSize: 30, fontStyle: 'italic', margin: 15 }}>
            Utilize Slack
          </b>
          <p style={{ fontSize: 20, fontStyle: 'italic' }}>
            Communicate with your team through Slack
          </p>
        </Col>
      </Row>
      <Row>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Icon.EyeFill size={132}/>
          <b style={{ fontSize: 30, fontStyle: 'italic', margin: 15 }}>
            <a className='landing-link' href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
          </b>
        </Col>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {/* <Icon.Hammer size={132}/> */}
          <Image fluid style={{
            width: 132,
          display: 'block',
          margin: 'auto',
          }} src='/images/gavel.png'/>
          <b style={{ fontSize: 30, fontStyle: 'italic', margin: 15 }}>
            <a className='landing-link' href="https://hacc.hawaii.gov/hacc-judging-criteria/">HACC Judging Criteria</a>
          </b>
        </Col>
      </Row>
    </Row>
  </Container>
);

export default Landing;
