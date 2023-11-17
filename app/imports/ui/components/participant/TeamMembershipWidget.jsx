import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { Container } from 'react-bootstrap';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import TeamCard from './TeamCard';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { paleBlueStyle } from '../../styles';

const TeamMembershipWidget = () => {
  const { teams, participantID } = useTracker(() => {
    const findParticipantID = Participants.findDoc({ userID: Meteor.userId() })._id;
    const teamParts = TeamParticipants.find({ participantID: findParticipantID }).fetch();
    const findTeams = _.map(teamParts, (tP) => Teams.findDoc(tP.teamID));
    return {
      teams: findTeams,
      participantID: findParticipantID,
    };
  });
  return (teams.length > 0) ? (
    <Container style={{ paleBlueStyle, textAlign: 'center' }}>
      <h2>Team Membership</h2>
      {teams.map((team) => <TeamCard team={team} key={team._id} participantID={participantID}/>)}
    </Container>
  ) : '';
};

export default TeamMembershipWidget;
