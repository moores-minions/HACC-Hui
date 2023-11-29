import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Button } from 'react-bootstrap';
import _ from 'underscore';
import swal from 'sweetalert';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

const ListTeamExampleWidget = (props) => {
    const [sent, setSent] = useState(false);

  const handleClick = (e, inst) => {
    const collectionName = WantsToJoin.getCollectionName();
    const teamDoc = Teams.findDoc(inst.id);
    const team = Slugs.getNameFromID(teamDoc.slugID);
    const participant = Participants.findDoc({ userID: Meteor.userId() }).username;
    const definitionData = {
      team,
      participant,
    };

    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        swal('Sent Request Fail', error, 'error');
      } else {
        swal('Success', 'Join Request Sent', 'success');
        setSent(true);
      }
    });
  };

  const renderButton = () => {
    const participant = Participants.findDoc({ userID: Meteor.userId() });
    const participantName = Participants.getFullName(participant._id);
    const isAMember = _.includes(props.teamMembers, participantName);

    const Joinrequests = WantsToJoin.find({ teamID: props.team._id }).fetch();
    const Joinsentusers = _.pluck(Joinrequests, 'participantID');
    const Requested = _.contains(Joinsentusers, participant._id);

    if (isAMember) {
      return (<Button id={props.team._id} variant="success"
                      disabled={true} style={{ width: `${100}px`,
        height: `${50}px`, textAlign: 'center' }} >You own the team</Button>);
    }
    if (sent || Requested) {
      return (<Button id={props.team._id} variant="success"
                      disabled={true} style={{ width: `${100}px`,
        height: `${50}px`, textAlign: 'center' }} >You sent the request</Button>);
    }
    return (<Button id={props.team._id} variant="success"
                    onClick={handleClick} style={{ width: `${100}px`,
      height: `${50}px`, textAlign: 'center' }} >Request to Join</Button>
    );
  };

    return (
      <Card style={ { marginTop: 15 } }>
        <Card.Body>
          <Row className="d-none d-md-flex">
            <Col>
              <h5>{props.team.name}</h5>
            </Col>
            <Col>
              <h5>Challenges</h5>
              {props.teamChallenges.map((item) => <p key={item}>{`\u2022 ${item}`}</p>)}
              {_.uniq(props.teamChallenges).length === 0 ? (<p>N/A</p>) : ''}
            </Col>
            <Col>
              <h5>Desired Skills</h5>
              {props.teamSkills.map((item) => <p key={item}>{`\u2022 ${item}`}</p>)}
              {_.uniq(props.teamSkills).length === 0 ? (<p>N/A</p>) : ''}
            </Col>
            <Col>
              <h5>Desired Tools</h5>
              {props.teamTools.map((item) => <p key={item}>{`\u2022 ${item}`}</p>)}
              {_.uniq(props.teamTools).length === 0 ? (<p>N/A</p>) : ''}
            </Col>
            <Col>
              {_.uniq(props.team.devPostPage).length === 1 ? (
                <a href={props.team.devPostPage}>Devpost Page</a>) : ''}
              {_.uniq(props.team.devPostPage).length === 0 ? (<p>DevPost page not listed</p>) : ''}
              <br />
              {_.uniq(props.team.gitHubRepo).length === 1 ? (
                <a href={props.team.gitHubRepo}>GitHub Repo</a>) : ''}
              {_.uniq(props.team.gitHubRepo).length === 0 ? (<p>GitHub Repo not listed</p>) : ''}
            </Col>
            <Col>
              <h5>Members</h5>
              {props.teamMembers.map((item) => <p key={item}>{`\u2022 ${item}`}</p>)}
              {_.uniq(props.teamMembers).length === 0 ? (<p>No members listed</p>) : ''}
            </Col>
            <Col textAlign='center'>
              {renderButton()}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

ListTeamExampleWidget.propTypes = {
  team: PropTypes.object.isRequired,
  teamChallenges: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  teamSkills: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  teamTools: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  teamMembers: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
};

export default ListTeamExampleWidget;
