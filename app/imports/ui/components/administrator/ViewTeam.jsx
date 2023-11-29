import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Row, ListGroup, Modal, Container } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { CheckCircleFill, ExclamationCircleFill } from 'react-bootstrap-icons';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';

const ViewTeam = ({ isCompliant, team, teamMembers }) => {
  const { participants: allParticipants, teamChallenges: allteamChallenges } = useTracker(() => {
    const participants = Participants.find({}).fetch();
    const teamChallenges = TeamChallenges.find({ teamID: team._id })
      .fetch().map(tc => Challenges.findDoc(tc.challengeID));

    return {
      participants, teamChallenges,
    };
  }, [team._id]);

  const captain = allParticipants.find(p => team.owner === p._id);
  const challenge = allteamChallenges[0];

  const [modal, setModal] = useState(false);

  const changeBackground = e => {
    e.currentTarget.style.backgroundColor = '#fafafa';
    e.currentTarget.style.cursor = 'pointer';
  };

  const onLeave = e => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  return (
    <>
      <Card onMouseEnter={changeBackground} onMouseLeave={onLeave}
            style={{ padding: '1.0rem 1.5rem 1.0rem 1.5rem' }} onClick={() => setModal(true)}>
        <Card.Body>
          <Card.Title>
            {team.name} {isCompliant ? <CheckCircleFill/> : <ExclamationCircleFill/> }
          </Card.Title>
          <Card.Text>
            <strong>Captain:</strong> {captain ? `${captain.firstName} 
            ${captain.lastName}: ${captain.username}` : 'None'},
            <strong>Challenge:</strong> {challenge ? challenge.title : 'None yet'}
          </Card.Text>
        </Card.Body>
      </Card>

      <Modal show={modal} onHide={() => setModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{team.name} {isCompliant ? <CheckCircleFill/> : <ExclamationCircleFill/> }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={4}>
                <h4>Challenges</h4>
                <ListGroup>
                  {allteamChallenges.map(c => <ListGroup.Item key={c._id}>{c.title}</ListGroup.Item>)}
                </ListGroup>
                <h5>Captain</h5>
                {captain ? `${captain.firstName} ${captain.lastName}: ${captain.username}` : 'None'}
              </Col>
              <Col xs={5}>
                <h4>Members</h4>
                <ListGroup>
                  {teamMembers.map(t => <ListGroup.Item key={t}>{t}</ListGroup.Item>)}
                </ListGroup>
              </Col>
              <Col xs={5}>
                <h5>{isCompliant ? 'Team is Compliant' : 'Team is not Compliant'}</h5>
                <p>Devpost Page: {team.devPostPage}</p>
                <p>Github Repo: {team.gitHubRepo}</p>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button><Link to={`/admin-edit-team/${team._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

  // return (
  //   <>
  //     <Card style={{ padding: '1.0rem 1.5rem 1.0rem 1.5rem' }}>
  //       <Card.Body closeIcon trigger={
  //         <Card.Title>
// eslint-disable-next-line max-len
  //           {team.name} {isCompliant ? <Icon className="green check"/> : <Icon name="exclamation circle" color="red"/> }
  //         </Card.Title>
  //         // <Card.Text>
  //         // <strong>Captain:</strong> {captain ? `${captain.firstName} ${captain.lastName}: ${captain.username}   `
  //         // : '   '},
  //         // <strong>Challenge:</strong> {challenge ? challenge.title : 'None yet.'}
  //         // </Card.Text>
  //         </Card.Body>
  //         </Card>
  //   </>

        // <Grid padded>
        //   <Grid.Row>
        //     <Grid.Column width={4}>
        //       <Header>{team.name}</Header>
        //       <List>
        //         {allteamChallenges.map((c) => <List.Item key={c._id}>{c.title}</List.Item>)}
        //       </List>
        //       <Header as="h4">Captain</Header>
        //       {captain ? `${captain.firstName} ${captain.lastName}: ${captain.username}` : ''}
        //     </Grid.Column>
        //     <Grid.Column width={5}>
        //       <Header>Members</Header>
        //       <List bulleted>
        //         {teamMembers.map((t) => <List.Item key={t}>{t}</List.Item>)}
        //       </List>
        //     </Grid.Column>
        //     <Grid.Column width={5}>
        //       {isCompliant ? <Header>Team is Compliant</Header> : <Header>
        //         <mark>Team is not Compliant</mark>
        //       </Header>}
        //       <Header>Devpost Page</Header>
        //       {team.devPostPage}
        //       <Header>Github Repo</Header>
        //       {team.gitHubRepo}
        //     </Grid.Column>
        //     <Grid.Column width={2}>
        //       {/* eslint-disable-next-line max-len */}
        //       <Button><Link to={`/admin-edit-team/${team._id}`}
        //                     style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button>
        //     </Grid.Column>
        //   </Grid.Row>
        // </Grid>

ViewTeam.propTypes = {
  team: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
  teamParticipants: PropTypes.arrayOf(PropTypes.object).isRequired,
  teamMembers: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  teamChallenges: PropTypes.arrayOf(PropTypes.object).isRequired,
  isCompliant: PropTypes.bool.isRequired,
};

export default ViewTeam;
