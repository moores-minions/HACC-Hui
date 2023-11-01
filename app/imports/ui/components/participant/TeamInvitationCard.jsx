import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Button, Card, Col, Container, Image, Modal, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';

const TeamInvitationCard = ({ teams, skills, tools, challenges, participants }) => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const removeClick = (tID) => {
    const thisTeamID = tID;
    const collectionName = TeamInvitations.getCollectionName();
    const intID = TeamInvitations.findDoc({ teamID: thisTeamID,
      participantID: Participants.findDoc({ userID: Meteor.userId() })._id });
    removeItMethod.call({ collectionName: collectionName, instance: intID }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Team invitation declined', 'success');
      }
    });
  };

  const handleClick = (tID) => {
    const thisTeam = tID;
    const devID = Participants.findDoc({ userID: Meteor.userId() })._id;
    const definitionData = { team: thisTeam, participant: devID };
    let collectionName = TeamParticipants.getCollectionName();
    if (TeamParticipants.find({ teamID: thisTeam, participantID: devID }).fetch().length === 0) {
      defineMethod.call({ collectionName: collectionName, definitionData: definitionData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            collectionName = TeamInvitations.getCollectionName();
            const intID = TeamInvitations.findDoc({ teamID: thisTeam,
              participantID: Participants.findDoc({ userID: Meteor.userId() })._id });
            removeItMethod.call({ collectionName: collectionName, instance: intID }, (err) => {
              if (error) {
                swal('Error', err.message, 'error');
              } else {
                swal('Success', 'Team invitation accepted', 'success');
              }
            });
          }
        });
    }
  };

  const changeBackground = (e) => {
    e.currentTarget.style.backgroundColor = '#fafafa';
    e.currentTarget.style.cursor = 'pointer';
  };

  const onLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  return (
    <Card onMouseEnter={changeBackground} onMouseLeave={onLeave}
          style={{ backgroundColor: 'transparent', padding: '0rem 2rem 0rem 2rem' }}>
      <Card.Body>
        <Container onClick={handleShow}>
          <h5 style={{ color: '#263763', paddingTop: '2rem' }}>
            <Icon.PeopleFill size={32}/>
            {teams.name}
          </h5>
          <Row>
            <Col>
              <Image src={teams.image} rounded size='small'/>
              <Col style={{ paddingBottom: '0.3rem' }}>
                {challenges.slice(0, 3).map((challenge) => <p
                  style={{ color: 'rgb(89, 119, 199)' }}
                  key={challenge}>
                  {challenge}</p>)}
              </Col>

            </Col>
            <Col>
              <h5>Skills</h5>
              {skills.slice(0, 3).map((skill) => <p key={skill}>
                {skill}</p>)}
            </Col>
            <Col>
              <h5>Tools</h5>
              {tools.slice(0, 3).map((tool) => <p key={tool}>
                {tool}</p>)}
            </Col>
            <Col><Button id={`accept-${teams._id}`} variant='success'
                         onClick={() => handleClick(teams._id)}>
              Accept Request
            </Button></Col>
            <Col><Button id={`decline-${teams._id}`} variant='danger' onClick={() => removeClick(teams._id)}>
              Decline Request
            </Button></Col>

          </Row>
        </Container>
      </Card.Body>

      <Modal onHide={handleClose} show={show}>
        <Modal.Header closeButton>
          <Modal.Title>{teams.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image size='medium' src={teams.image}/>
          <h5>Description</h5>
          <p>
            {teams.description}
          </p>
          <h5>Challenges</h5>
          {challenges.map((challenge) => <p key={`modal-${challenge}`}>
            {challenge}</p>)}
          <h5>Skills</h5>
          {skills.map((skill) => <p key={`modal-${skill}`}>
            {skill}</p>)}
          <h5>Tools</h5>
          {tools.map((tool) => <p key={`modal-${tool}`}>
            {tool}</p>)}
          <h5>Members</h5>
          {participants.map((participant) => <p key={`modal-${participant}`}>
            {participant.firstName} {participant.lastName}</p>)}
        </Modal.Body>
        <Modal.Footer>
          <Button id={`mod-acc-${teams._id}`} variant='success'
                  onClick={() => handleClick(teams._id)}>
            <Icon.Plus/>
            Accept Request
          </Button>
          <Button id={`mod-del-${teams._id}`} variant='danger'
                  onClick={() => removeClick(teams._id)}>
            <Icon.Dash/>
            Decline Request
          </Button>
        </Modal.Footer>
      </Modal>

    </Card>
  );
};

TeamInvitationCard.propTypes = {
  teams: PropTypes.object.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default TeamInvitationCard;
