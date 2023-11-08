import React, { useState } from 'react';
import { Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';

const InterestedParticipantCard = ({ teams, skills, tools, challenges, developers }) => {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClick = (tID, dID) => {
    const thisTeam = tID;
    const devID = dID;
    const definitionData = { team: thisTeam, participant: devID };
    let collectionName = TeamParticipants.getCollectionName();
    defineMethod.call({ collectionName: collectionName, definitionData: definitionData },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          collectionName = WantsToJoin.getCollectionName();
          const intID = WantsToJoin.findDoc({ participantID: devID })._id;
          removeItMethod.call({ collectionName: collectionName, instance: intID }, (err) => {
            if (err) {
              swal('Error', err.message, 'error');
            } else {
              swal('Success', 'Member added successfully', 'success');
            }
          });
        }
      });
  };

  const removeDev = (dID) => {
    const devID = dID;
    const collectionName = WantsToJoin.getCollectionName();
    const intID = WantsToJoin.findDoc({ participantID: devID });
    removeItMethod.call({ collectionName: collectionName, instance: intID }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Removed interested developer', 'success');
      }
    });
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
        <Container id='modal' onClick={handleShow}>
          <h5 style={{ color: '#263763', paddingTop: '2rem' }}>
            <Icon.PersonFill size={32}/>
            {developers.firstName} {developers.lastName}
          </h5>
          <Row>
            <Col>
              <h5>Challenges</h5>
              {challenges.slice(0, 3).map((challenge) => <p
                style={{ color: 'rgb(89, 119, 199)' }}
                key={challenge}>
                {challenge}</p>)}
            </Col>
            <Col>
              <h5>Skills</h5>
              {skills.slice(0, 3).map((skill) => <p key={skill}>
                {skill.name}</p>)}
            </Col>
            <Col>
              <h5>Tools</h5>
              {tools.slice(0, 3).map((tool) => <p key={tool}>
                {tool.name}</p>)}
            </Col>
            <Col>
              <h5>Slack Username</h5>
              {developers.username}
            </Col>
          </Row>
        </Container>
        <Button id={`add-${developers._id}`} variant='success'
                onClick={() => handleClick(teams[0]._id, developers._id)}>
          Add member
        </Button>
        <Button id={`del-${developers._id}`} variant='danger'
                onClick={() => removeDev(developers._id)}>
          Remove
        </Button></Card.Body>
      <Modal onHide={handleClose} show={show}>
        <Modal.Header closeButton>
          <Modal.Title>{developers.firstName} {developers.lastName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>About Me</h5>
          <p>
            {developers.aboutMe}
          </p>
          <h5>Slack Username</h5>
          <p>
            {developers.username}
          </p>
          <h5>LinkedIn</h5>
          <p>
            {developers.linkedIn}
          </p>
          <h5>GitHub</h5>
          <p>
            {developers.gitHub}
          </p>
          <h5>Website</h5>
          <p>
            {developers.website}
          </p>
          <h5>Challenges</h5>
          <p>
            {challenges.map((challenge) => <p key={challenge}>
              {challenge}</p>)}
          </p>
          <h5>Skills</h5>
          <p>
            {skills.map((skill) => <p key={skill}>
              {skill.name}</p>)}
          </p>
          <h5>Tools</h5>
          <p>
            {tools.map((tool) => <p key={tool}>
              {tool.name}</p>)}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button id={`add-${developers._id}-inner`} variant='success'
                  onClick={() => handleClick(teams[0]._id, developers._id)}>
            <Icon.Plus/>
            Add member
          </Button>
          <Button id={`del-${developers._id}-inner`} variant='danger'
                  onClick={() => removeDev(developers._id)}>
            <Icon.Dash/>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

InterestedParticipantCard.propTypes = {
  teams: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developers: PropTypes.object.isRequired,
};
export default InterestedParticipantCard;
