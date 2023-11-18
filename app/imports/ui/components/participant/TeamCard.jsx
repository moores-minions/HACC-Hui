import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Button } from 'react-bootstrap';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import SkillItem from './SkillItem';
import ToolItem from './ToolItem';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { LeavingTeams } from '../../../api/team/LeavingTeamCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';

const TeamCard = ({ team, participantID }) => {
  const buildTheTeam = () => {
    const getTeam = team;
    const teamID = getTeam._id;
    const tCs = TeamChallenges.find({ teamID }).fetch();
    const challengeTitles = _.map(tCs, (tc) => Challenges.findDoc(tc.challengeID).title);
    getTeam.challenges = challengeTitles;
    getTeam.skills = TeamSkills.find({ teamID }).fetch();
    getTeam.tools = TeamTools.find({ teamID }).fetch();
    const teamPs = TeamParticipants.find({ teamID }).fetch();
    getTeam.members = _.map(teamPs, (tp) => Participants.getFullName(tp.participantID));
    return getTeam;
  };

  const handleLeaveTeam = () => {
    const getTeam = team;
    swal({
      title: 'Are you sure you want to leave the team?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          const pDoc = Participants.findDoc({ userID: Meteor.userId() });
          let collectionName = LeavingTeams.getCollectionName();
          const definitionData = {
            username: pDoc.username,
            team: getTeam._id,
          };
          defineMethod.call({ collectionName, definitionData }, (error) => {
            if (error) {
              swal('Error', error.message, 'Problem defining collection');
            }
          });
          const teamPart = TeamParticipants.findDoc({ teamID: getTeam._id, participantID: pDoc._id });
          collectionName = TeamParticipants.getCollectionName();
          const instance = teamPart._id;
          removeItMethod.call({ collectionName, instance }, (error) => {
            if (error) {
              swal('Error', error.message, 'Problem defining collection');
            } else {
              swal('Success', 'You have left the team', 'success');
            }
          });
        }
      });
  };

    const buildTeam = buildTheTeam();
    const isOwner = buildTeam.owner === participantID;
    return (
        <Card>
          <Card.Body>
            <Card.Title>{buildTeam.name}</Card.Title>
            <Card.Text>
              <Row>
                <Col>
                  <h6>Challenges</h6>
                  {buildTeam.challenges.map((item) => <p key={item}>{ item }</p>)}
                  {_.uniq(buildTeam.challenges).length === 0 ? (<p>N/A</p>) : ''}
                </Col>
                <Col>
                  <h6>Desired Skills</h6>
                    {buildTeam.skills.map((item) => <SkillItem item={item} key={item._id} />)}
                    {_.uniq(buildTeam.skills).length === 0 ? (<p>N/A</p>) : ''}
                </Col>
                <Col>
                  <h6>Desired Tools</h6>
                    {buildTeam.tools.map((item) => <ToolItem item={item} key={item._id} />)}
                    {_.uniq(buildTeam.tools).length === 0 ? (<p>N/A</p>) : ''}
                </Col>
                <Col>
                  <h6>Members</h6>
                    {buildTeam.members.map((item) => <p key={item}>{ item }</p>)}
                    {_.uniq(buildTeam.members).length === 0 ? (<p>No members listed</p>) : ''}
                </Col>
                <Col>
                  <Button team={buildTeam} disabled={isOwner} variant="danger" id={`leave-${team._id}`}
                          onClick={handleLeaveTeam}>Leave team</Button>
                </Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>
    );
};

TeamCard.propTypes = {
  team: PropTypes.object.isRequired,
  participantID: PropTypes.string.isRequired,
};

export default TeamCard;
