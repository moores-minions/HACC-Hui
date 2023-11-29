import React from 'react';
import { Card, Accordion, Container, Row, Col, Modal } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as Icon from 'react-bootstrap-icons';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';

const ListParticipantCardAdmin = () => {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */

    const changeBackground = (e) => {
      e.currentTarget.style.backgroundColor = '#fafafa';
      e.currentTarget.style.cursor = 'pointer';
    };

    const onLeave = (e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
    };
    const isMinor = this.props.participants.minor;
    return (
      // Start of what is shown on List Participants
      <>
      <Card id="part-card-page-admin" onMouseEnter={changeBackground} onMouseLeave={onLeave}>
        <Card.Body>
          <Card.Title>{this.props.participants.firstName} {this.props.participants.lastName}</Card.Title>
          <Card.Text>
              {this.props.teams.length === 0 ? (
                <Card.Subtitle>
                  <Icon.XCircleFill color="crimson"/> No team <Icon.XCircleFill color="crimson"/>
                </Card.Subtitle>) : ''}
              {_.uniq(this.props.teams).length > 1 ? (<Card.Subtitle>Multiple teams</Card.Subtitle>) : ''}
              {isMinor ? (<Card.Subtitle>Minor</Card.Subtitle>) : ''}
          </Card.Text>
          <Card.Text>
            <Container>
              <Row>
                <Col>
                  <Card.Subtitle>Challenges</Card.Subtitle>
                  {this.props.challenges.slice(0, 3).map((challenge, i) => <p
                    style={{ color: 'rgb(89, 119, 199)' }}
                    key={challenge + i}>
                    {challenge}</p>)}
                  {_.uniq(this.props.challenges).length === 0 ? (<Card.Subtitle>N/A</Card.Subtitle>) : ''}
                </Col>
                <Col>
                  <Card.Subtitle>Skills</Card.Subtitle>
                  {this.props.skills.slice(0, 3).map((skill, i) => <p key={skill + i}>
                    {skill.name}</p>)}
                  {_.uniq(this.props.skills).length === 0 ? (<p>N/A</p>) : ''}
                </Col>
                <Col>
                  <Card.Subtitle>Tools</Card.Subtitle>
                  {this.props.tools.slice(0, 3).map((tool, i) => <p key={tool + i}>
                    {tool.name}</p>)}
                  {_.uniq(this.props.tools).length === 0 ? (<p>N/A</p>) : ''}
                </Col>
                <Col>
                  <Card.Subtitle>Slack Username</Card.Subtitle>
                  {this.props.participants.username}
                  {this.props.participants.username.length === 0 ? (<p>Username not in database</p>) : ''}
                </Col>
                <Col>
                  <Card.Subtitle>GitHub</Card.Subtitle>
                  {this.props.participants.gitHub}
                  {_.uniq(this.props.participants.gitHub).length === 0 ? (<p>GitHub not in database</p>) : ''}
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
                          <Row>{this.props.participants.firstName} {this.props.participants.lastName}</Row>
                          <Row>{this.props.participants.demographicLevel}</Row>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Row>
                          <Col>
                            <Icon.Github/> GitHub:
                            <a href={this.props.participants.gitHub}>{this.props.participants.gitHub}</a>
                            {_.uniq(this.props.participants.gitHub).length === 0 ? (<p>GitHub not in database</p>) : ''}
                          </Col>
                          <Col>
                            <Icon.Linkedin/> LinkedIn:
                            <a href={this.props.participants.linkedIn}>{this.props.participants.linkedIn}</a>
                            {_.uniq(this.props.participants.linkedIn).length === 0 ?
                              (<p>LinkedIn not in database</p>) : ''}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Icon.Server/> Website:
                            <a href={this.props.participants.website}>{this.props.participants.website}</a>
                            {_.uniq(this.props.participants.website).length === 0 ? (<p>Website not listed</p>) : ''}
                          </Col>
                          <Col>
                            <Icon.Slack/> Slack Username:
                            <a href={this.props.participants.username}> {this.props.participants.username}</a>
                            {_.uniq(this.props.participants.username).length === 0 ?
                              (<p>Username not in database</p>) : ''}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            Challenges<hr style={ { marginTop: 1, marginBottom: 1 } }/>
                            {this.props.challenges.map((challenge, i) => (
                              <p key={challenge + i}>- {challenge}</p>
                            ))}
                            {_.uniq(this.props.challenges).length === 0 ? (<Card.Subtitle>N/A</Card.Subtitle>) : ''}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            Skills<hr style={ { marginTop: 1, marginBottom: 1 } }/>
                            {this.props.skills.map((skill, i) => <p key={skill + i}>- {skill.name}</p>)}
                            {_.uniq(this.props.skills).length === 0 ? (<p>N/A</p>) : ''}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            Tools<hr style={ { marginTop: 1, marginBottom: 1 } }/>
                            {this.props.tools.map((tool, i) => <p key={tool + i}>- {tool.name}</p>)}
                            {_.uniq(this.props.tools).length === 0 ? (<p>N/A</p>) : ''}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            Teams<hr style={ { marginTop: 1, marginBottom: 1 } }/>
                            {_.uniq(this.props.teams).map((team, i) => <p key={team + i}>{team}</p>)}
                            {this.props.teams.length === 0 ? (
                              <p> No team </p>) : ''}
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

ListParticipantCardAdmin.propTypes = {
  participantID: PropTypes.string.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
  teamInvitations: PropTypes.array,
};
export default withTracker(() => {
  const teamInvitations = TeamInvitations.find({}).fetch();
  // console.log(minors);
  return {
    teamInvitations,
  };
})(ListParticipantCardAdmin);
