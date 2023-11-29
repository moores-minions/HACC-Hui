import React, { useState } from 'react';
import {
  Card,
  Container,
  Row,
  Col,
  Modal, Image,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { Teams } from '../../../api/team/TeamCollection';

const AllTeamInvitationCard = ({ teams, skills, tools, challenges, participants }) => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const changeBackground = (e) => {
    e.currentTarget.style.backgroundColor = '#fafafa';
    e.currentTarget.style.cursor = 'pointer';
  };

  const onLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  const teamID = Teams.findDoc({ name: teams.name })._id;
  const invitations = TeamInvitations.find({ teamID }).fetch();

  for (let i = 0; i < invitations.length; i++) {
    invitations[i] = invitations[i].participantID;
  }

  const invitedMembers = [];
  _.forEach(invitations, (id) => {
    invitedMembers.push(Participants.getFullName(id));
  });

  return (
    <Card onMouseOver={changeBackground} onPointerOver={changeBackground} onMouseOut={onLeave}
          onPointerOut={onLeave} onMouseUp={onLeave} onTouchExit={onLeave}
          style={{ backgroundColor: 'transparent', padding: '0rem 2rem 0rem 2rem' }}>
      <Card.Body>
        <Container onClick={handleShow}>
          <Card.Title>
          <h3 style={{ color: '#263763', paddingTop: '2rem' }}>
            <i className="fas fa-users" style={{ fontSize: '1rem' }}></i>
            {teams.name}
          </h3>
        </Card.Title>
          <Card.Text>
            <Row>
              <Col>
                <img src={teams.image} alt={teams.name}
                     style={{ width: '100px', height: '100px' }}/>
                <div style={{ paddingBottom: '0.3rem' }}>
                  {challenges.slice(0, 3).map((challenge) => (
                    <p style={{ color: 'rgb(89, 119, 199)' }} key={challenge}>
                      {challenge}
                    </p>
                  ))}
                </div>
              </Col>
              <Col>
                <h5>Skills</h5>
                {skills.slice(0, 3).map((skill) => (
                  <p key={skill}>
                    {skill}
                  </p>
                ))}
              </Col>
              <Col>
                <h5>Tools</h5>
                {tools.slice(0, 3).map((tool) => (
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
          </Card.Text></Container>
      </Card.Body>

      <Modal onHide={handleClose} show={show}>
        <Modal.Header closeButton>
          <Modal.Title>{teams.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image size='medium' src={teams.image} />
          <h5>Description</h5>
          <p>{teams.description}</p>
          <h5>Challenges</h5>
          {challenges.map((challenge) => <p key={challenge}>
            {`modal-${challenge}`}</p>)}
          <h5>Skills</h5>
          {skills.map((skill) => <p key={`modal-${skill}`}>
            {skill}</p>)}
          <h5>Tools</h5>
          {tools.map((tool) => <p key={`modal-${tool}`}>
            {tool}</p>)}
          <h5>Members</h5>
          {participants.map((participant) => <p key={`modal-${participant}`}>
            {participant.firstName} {participant.lastName}</p>)}
          <h5>Member(s) Invited:</h5>
          {invitedMembers.slice(0, 3).map((members) => <p key={members}>
            {members}</p>)}
        </Modal.Body>
      </Modal>
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
