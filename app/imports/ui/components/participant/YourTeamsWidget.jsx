import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Card, Container, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { _ } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import YourTeamsCard from './YourTeamsCard';
import MemberTeamCard from './MemberTeamCard';
import { paleBlueStyle } from '../../styles';

/**
 * Widget to list teams
 * @memberOf ui/pages
 */
const YourTeamsWidget = () => {

  const { participant, teams, memberTeams, participants, teamParticipants, teamInvitation } = useTracker(() => {
    const part = Participants.findDoc({ userID: Meteor.userId() });
    const participantID = part._id;
    const tms = Teams.find({ owner: participantID }).fetch();
    const memTms = _.map(_.uniqBy(TeamParticipants.find({ participantID }).fetch(), 'teamID'),
      (tp) => Teams.findDoc(tp.teamID));
    const parts = Participants.find({}).fetch();
    const tmParts = TeamParticipants.find({}).fetch();
    const tmInv = TeamInvitations.find({}).fetch();
    return {
      participant: part,
      teams: tms,
      memberTeams: memTms,
      participants: parts,
      teamParticipants: tmParts,
      teamInvitation: tmInv,
    };
  });
  const allParticipants = participants;

  function getTeamParticipants(teamID, teamParts) {
    const data = [];
    const parts = _.uniqBy(_.filter(teamParts, { teamID: teamID }), 'participantID');
    for (let i = 0; i < parts.length; i++) {
      for (let j = 0; j < allParticipants.length; j++) {
        if (parts[i].participantID === allParticipants[j]._id) {
          data.push({
            firstName: allParticipants[j].firstName,
            lastName: allParticipants[j].lastName,
          });
        }
      }
    }
    return data;
  }

  if (!participant.isCompliant) {
    return (
      <Container id='invalid' className='align-items-center'>
        <h4>
          <Icon.HandThumbsDown />
          You have not agreed to the <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
          &nbsp;or we&apos;ve haven&apos;t received the signed form yet.
          <h5>
            You can&apos;t be the owner of a team until you do. Please check back later.
          </h5>
        </h4>
      </Container>
    );
  }
  if (teams.length + memberTeams.length === 0) {
    return (
      <Container id='no-teams' className='align-items-center'>
        <h4>
          <Icon.PeopleFill />
          You are not the owner or member of any teams
          <h5>
            Please check back later.
          </h5>
        </h4>
      </Container>
    );
  }

  return (
    <Container id='your-teams' style={{ paddingBottom: 50 }}>
      <Row>
        <h4 className='text-center your-teams'>
          Your Teams
        </h4>
      </Row>
      {teams.length === 0 ? '' : (
        <Container className='your-teams'><Card style={paleBlueStyle}>
          <Card.Body><Container fluid><h5 className='text-center'>Owner</h5>
            <Row>
              {teams.map((tms) => <YourTeamsCard key={tms._id} teams={tms}
                                                 teamParticipants={getTeamParticipants(tms._id,
                                                   teamParticipants)}
                                                 teamInvitation={teamInvitation}/>)}
            </Row></Container></Card.Body>
        </Card></Container>)
      }
      {memberTeams.length === 0 ? '' : (
        <Container className='your-teams'><Card>
          <Card.Body><Container><h5 className='text-center'>Member</h5>
            <Row>
              {memberTeams.map((team) => <MemberTeamCard key={team._id}
                                                         team={team}
                                                         teamParticipants={getTeamParticipants(
                                                           team._id,
                                                           teamParticipants,
                                                         )}/>)}
            </Row></Container></Card.Body>
        </Card></Container>
      )
      }
    </Container>
  );
};

export default YourTeamsWidget;
