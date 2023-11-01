import React from 'react';
import {
  Card,
  Button,
  Row,
  Col,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { Teams } from '../../../api/team/TeamCollection';

const AllTeamInvitationCard = (props) => {
  const changeBackground = (e) => {
    e.currentTarget.style.backgroundColor = '#fafafa';
    e.currentTarget.style.cursor = 'pointer';
  }

  const onLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  }

  const teamID = Teams.findDoc({ name: props.teams.name })._id;
  const invitations = TeamInvitations.find({ teamID }).fetch();

  for (let i = 0; i < invitations.length; i++) {
    invitations[i] = invitations[i].participantID;
  }

  const invitedMembers = [];
  _.forEach(invitations, (id) => {
    invitedMembers.push(Participants.getFullName(id));
  });

  return (
    <Card onMouseEnter={changeBackground} onMouseLeave={onLeave} style={{ padding: '0rem 2rem 0rem 2rem' }}>
      <Card.Body>
        <Card.Title>
          <h3 style={{ color: '#263763', paddingTop: '2rem' }}>
            <i className="fas fa-users" style={{ fontSize: '1rem' }}></i>
            {props.teams.name}
          </h3>
        </Card.Title>
        <Card.Text>
          <Row>
            <Col>
              <img src={props.teams.image} alt={props.teams.name} roundedCircle style={{ width: '100px', height: '100px' }} />
              <div style={{ paddingBottom: '0.3rem' }}>
                {props.challenges.slice(0, 3).map((challenge) => (
                  <p style={{ color: 'rgb(89, 119, 199)' }} key={challenge}>
                    {challenge}
                  </p>
                ))}
              </div>
            </Col>
            <Col>
              <h5>Skills</h5>
              {props.skills.slice(0, 3).map((skill) => (
                <p key={skill}>
                  {skill}
                </p>
              ))}
            </Col>
            <Col>
              <h5>Tools</h5>
              {props.tools.slice(0, 3).map((tool) => (
                <p key={tool}>
                  {tool}
                </p>
              ))}
            </Col>
            <Col>
              <h5>Member(s) Invited:</h5>
              {invitedMembers.slice(0, 3).map((members) => (
                <p key={members}>
                  {members}
                </p>
              ))}
            </Col>
          </Row>
        </Card.Text>
      </Card.Body>
      <Button variant="primary" data-bs-toggle="modal" data-bs-target="#teamModal">
        Open Modal
      </Button>
    </Card>
  );
};

AllTeamInvitationCard.propTypes = {
  teams: PropTypes.object.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default AllTeamInvitationCard;
