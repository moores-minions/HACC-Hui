import React from 'react';
import { Card, Accordion, Container, Row, Col, Modal } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as Icon from 'react-bootstrap-icons';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';

const ListParticipantCard = (props) => {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
    const changeBackground = (e) => {
      e.currentTarget.style.backgroundColor = '#fafafa';
      e.currentTarget.style.cursor = 'pointer';
    };

    const onLeave = (e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
    };
    return (
      // Start of what is shown on List Participants
      <>
        <Card id="part-card-page" onMouseEnter={changeBackground} onMouseLeave={onLeave}>
          <Card.Body>
            <Card.Title>{props.participants.firstName} {props.participants.lastName}</Card.Title>
            <Card.Text>
              <Container>
                <Row>
                  <Col>
                    <Card.Subtitle>Challenges</Card.Subtitle>
                    {props.challenges.slice(0, 3).map((challenge, i) => <p
                      style={{ color: 'rgb(89, 119, 199)' }}
                      key={challenge + i}>
                      {challenge}</p>)}
                    {_.uniq(props.challenges).length === 0 ? (<Card.Subtitle>N/A</Card.Subtitle>) : ''}
                  </Col>
                  <Col>
                    <Card.Subtitle>Skills</Card.Subtitle>
                    {props.skills.slice(0, 3).map((skill, i) => <p key={skill + i}>
                      {skill.name}</p>)}
                    {_.uniq(props.skills).length === 0 ? (<p>N/A</p>) : ''}
                  </Col>
                  <Col>
                    <Card.Subtitle>Tools</Card.Subtitle>
                    {props.tools.slice(0, 3).map((tool, i) => <p key={tool + i}>
                      {tool.name}</p>)}
                    {_.uniq(props.tools).length === 0 ? (<p>N/A</p>) : ''}
                  </Col>
                  <Col>
                    <Card.Subtitle>Slack Username</Card.Subtitle>
                    {props.participants.username}
                    {props.participants.username.length === 0 ? (<p>Username not in database</p>) : ''}
                  </Col>
                  <Col>
                    <Card.Subtitle>GitHub</Card.Subtitle>
                    {props.participants.gitHub}
                    {_.uniq(props.participants.gitHub).length === 0 ? (<p>GitHub not in database</p>) : ''}
                  </Col>
                </Row>
              </Container>
              <Accordion id="more-info-tab">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>More info...</Accordion.Header>
                  <Accordion.Body>
                    <Modal.Dialog size="lg">
                      <Modal.Header>
                        <Modal.Title>
                          <Row>{props.participants.firstName} {props.participants.lastName}</Row>
                          <Row>{props.participants.demographicLevel}</Row>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Row>
                          <Col>
                            <Icon.Github/> GitHub:
                            <a href={props.participants.gitHub}>{props.participants.gitHub}</a>
                            {_.uniq(props.participants.gitHub).length === 0 ? (<p>GitHub not in database</p>) : ''}
                          </Col>
                          <Col>
                            <Icon.Linkedin/> LinkedIn:
                            <a href={props.participants.linkedIn}>{props.participants.linkedIn}</a>
                            {_.uniq(props.participants.linkedIn).length === 0 ?
                              (<p>LinkedIn not in database</p>) : ''}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Icon.Server/> Website:
                            <a href={props.participants.website}>{props.participants.website}</a>
                            {_.uniq(props.participants.website).length === 0 ? (<p>Website not listed</p>) : ''}
                          </Col>
                          <Col>
                            <Icon.Slack/> Slack Username:
                            <a href={props.participants.username}> {props.participants.username}</a>
                            {_.uniq(props.participants.username).length === 0 ?
                              (<p>Username not in database</p>) : ''}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            Challenges<hr style={ { marginTop: 1, marginBottom: 1 } }/>
                            {props.challenges.map((challenge, i) => (
                              <p key={challenge + i}>- {challenge}</p>
                            ))}
                            {_.uniq(props.challenges).length === 0 ? (<Card.Subtitle>N/A</Card.Subtitle>) : ''}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            Skills<hr style={ { marginTop: 1, marginBottom: 1 } }/>
                            {props.skills.map((skill, i) => <p key={skill + i}>- {skill.name}</p>)}
                            {_.uniq(props.skills).length === 0 ? (<p>N/A</p>) : ''}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            Tools<hr style={ { marginTop: 1, marginBottom: 1 } }/>
                            {props.tools.map((tool, i) => <p key={tool + i}>- {tool.name}</p>)}
                            {_.uniq(props.tools).length === 0 ? (<p>N/A</p>) : ''}
                          </Col>
                        </Row>
                      </Modal.Body>
                    </Modal.Dialog>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Text>
          </Card.Body>
        </Card>
      </>
    );
};

ListParticipantCard.propTypes = {
  participantID: PropTypes.string.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.object.isRequired,
};
export default withTracker(() => {
  const teamInvitations = TeamInvitations.find({}).fetch();
  // console.log(minors);
  return {
    teamInvitations,
  };
})(ListParticipantCard);
