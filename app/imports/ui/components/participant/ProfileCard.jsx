import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const ProfileCard = ({ model }) => (
        <Card fluid>
          <Card.Body>
            <Card.Title><h2>{model.firstName} {model.lastName}</h2></Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {model.username} <br /> {model.demographicLevel}
            </Card.Subtitle>
            <Card.Text>
              <Row>
                <Col><Icon.Github/> GitHub:<br />
                  <a href={model.gitHub}>{model.gitHub}</a>
                </Col>
                <Col><Icon.Linkedin/> Linked In:<br />
                  <a href={model.linkedIn}>{model.linkedIn}</a>
                </Col>
                <Col><Icon.Server/> Website:<br />
                  <a href={model.website}>{model.website}</a>
                </Col>
                <Col><Icon.Slack/> Slack:<br />
                  <a href={model.slackUsername}>{model.slackUsername}</a>
                </Col>
              </Row>
              <br />
              <Row>
                <Col><Icon.ChatDotsFill/> About me: <br />
                  {model.aboutMe}</Col>
              </Row>
            </Card.Text>
          </Card.Body>
              <Row style={{ padding: 15 }}>
                <Col>
                  <h5>Challenges</h5>
                  <hr/>
                  {model.challenges.map((item) => <p key={item}>{item}</p>)}
                </Col>
                <Col>
                  <h5>Skills</h5>
                  <hr/>
                    {model.skills.map((item) => <p key={item}>{item}</p>)}
                </Col>
                <Col>
                  <h5>Tools</h5>
                  <hr/>
                    {model.tools.map((item) => <p key={item}>{item}</p>)}
                </Col>
              </Row>
          <br />
        </Card>
);

ProfileCard.propTypes = {
  model: PropTypes.object.isRequired,
};

export default ProfileCard;
