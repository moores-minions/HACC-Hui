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

class TeamCard extends React.Component {
  buildTheTeam = () => {
    const { team } = this.props;
    const teamID = team._id;
    const tCs = TeamChallenges.find({ teamID }).fetch();
    const challengeTitles = _.map(tCs, (tc) => Challenges.findDoc(tc.challengeID).title);
    team.challenges = challengeTitles;
    team.skills = TeamSkills.find({ teamID }).fetch();
    team.tools = TeamTools.find({ teamID }).fetch();
    const teamPs = TeamParticipants.find({ teamID }).fetch();
    team.members = _.map(teamPs, (tp) => Participants.getFullName(tp.participantID));
    return team;
  }

  handleLeaveTeam = (e, inst) => {
    const { team } = inst;
    const pDoc = Participants.findDoc({ userID: Meteor.userId() });
    let collectionName = LeavingTeams.getCollectionName();
    const definitionData = {
      username: pDoc.username,
      team: team._id,
    };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        swal('Error', error.message, 'Problem defining collection');
      }
    });
    const teamPart = TeamParticipants.findDoc({ teamID: team._id, participantID: pDoc._id });
    collectionName = TeamParticipants.getCollectionName();
    const instance = teamPart._id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        swal('Error', error.message, 'Problem defining collection');
      }
    });
  }

  render() {
    const team = this.buildTheTeam();
    const isOwner = team.owner === this.props.participantID;
    return (
        <Card>
          <Card.Body>
            <Card.Title>{team.name}</Card.Title>
            <Card.Text>
              <Row>
                <Col>
                  <h6>Challenges</h6>
                  {team.challenges.map((item) => <p key={item}>{ item }</p>)}
                  {_.uniq(team.challenges).length === 0 ? (<p>N/A</p>) : ''}
                </Col>
                <Col>
                  <h6>Desired Skills</h6>
                    {team.skills.map((item) => <SkillItem item={item} key={item._id} />)}
                    {_.uniq(team.skills).length === 0 ? (<p>N/A</p>) : ''}
                </Col>
                <Col>
                  <h6>Desired Tools</h6>
                    {team.tools.map((item) => <ToolItem item={item} key={item._id} />)}
                    {_.uniq(team.tools).length === 0 ? (<p>N/A</p>) : ''}
                </Col>
                <Col>
                  <h6>Members</h6>
                    {team.members.map((item) => <p key={item}>{ item }</p>)}
                    {_.uniq(team.members).length === 0 ? (<p>No members listed</p>) : ''}
                </Col>
                <Col>
                  <Button team={team} disabled={isOwner} variant="danger"
                          onClick={this.handleLeaveTeam}>Leave team</Button>
                </Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>
    );
  }
}

TeamCard.propTypes = {
  team: PropTypes.object.isRequired,
  participantID: PropTypes.string.isRequired,
};

export default TeamCard;
