import React from 'react';
import { Card, Col, Container } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { _ } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenge } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import AllTeamInvitationCard from '../administrator/AllTeamInvitationCard';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { paleBlueStyle } from '../../styles';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
const AllTeamInvitationsWidget = () => {

  const {
    teamChallenges, teamInvitations, teamSkills, teamTools, allTeams, allSkills,
    allChallenges, allTools, allParticipants, teamParticipants,
  } = useTracker(() => ({
    teamChallenges: TeamChallenges.find({}).fetch(),
    teamInvitations: TeamInvitations.find().fetch(),
    teamSkills: TeamSkills.find({}).fetch(),
    teamTools: TeamTools.find({}).fetch(),
    allTeams: Teams.find({}).fetch(),
    allSkills: Skills.find({}).fetch(),
    allChallenges: Challenge.find({}).fetch(),
    allTools: Tools.find({}).fetch(),
    allParticipants: Participants.find({}).fetch(),
    teamParticipants: TeamParticipants.find({}).fetch(),
  }));

  if (teamInvitations.length === 0) {
    return (
      <Container id='admin-no-invitations' align={'center'}>
        <h4 className='text-center'>
          <Icon.PeopleFill/>
          {' '}
          There are no invitations at the moment.
          <h5>
            Please check back later.
          </h5>
        </h4>
      </Container>
    );
  }

  // eslint-disable-next-line no-unused-vars
  const sortBy = [
    { key: 'teams', text: 'teams', value: 'teams' },
    { key: 'challenges', text: 'challenges', value: 'challenges' },
    { key: 'skills', text: 'skills', value: 'skills' },
    { key: 'tools', text: 'tools', value: 'tools' },
  ];

  const universalTeams = allTeams;

  const getTeamInvitations = (invs) => {
    const data = [];
    for (let i = 0; i < invs.length; i++) {
      for (let j = 0; j < universalTeams.length; j++) {
        if (invs[i].teamID === universalTeams[j]._id) {
          data.push(universalTeams[j]);
        }
      }
    }
    return _.sortedUniq(data);
  };

  const universalSkills = allSkills;

  const getTeamSkills = (teamID, tSkills) => {
    const data = [];
    const skills = _.filter(tSkills, { teamID: teamID });
    for (let i = 0; i < skills.length; i++) {
      for (let j = 0; j < universalSkills.length; j++) {
        if (skills[i].skillID === universalSkills[j]._id) {
          data.push(universalSkills[j].name);
        }
      }
    }
    return data;
  };

  const universalTools = allTools;

  const getTeamTools = (teamID, tTools) => {
    const data = [];
    const tools = _.filter(tTools, { teamID: teamID });
    for (let i = 0; i < tools.length; i++) {
      for (let j = 0; j < universalTools.length; j++) {
        if (tools[i].toolID === universalTools[j]._id) {
          data.push(universalTools[j].name);
        }
      }
    }
    return data;
  };

  const universalChallenges = allChallenges;

  const getTeamChallenges = (teamID, tChallenges) => {
    const data = [];
    const challenges = _.filter(tChallenges, { teamID: teamID });
    for (let i = 0; i < challenges.length; i++) {
      for (let j = 0; j < universalChallenges.length; j++) {
        if (challenges[i].challengeID === universalChallenges[j]._id) {
          data.push(universalChallenges[j].title);
        }
      }
    }
    return data;
  };

  const allDevelopers = allParticipants;

  const getTeamDevelopers = (teamID, tParts) => {
    const data = [];
    const participants = _.filter(tParts, { teamID: teamID });
    for (let i = 0; i < participants.length; i++) {
      for (let j = 0; j < allDevelopers.length; j++) {
        if (participants[i].participantID === allDevelopers[j]._id) {
          data.push({
            firstName: allDevelopers[j].firstName,
            lastName: allDevelopers[j].lastName,
          });
        }
      }
    }
    return data;
  };

  return (
    <Container id='all-team-invitations' className="py-3 card-pages">
      <Card style={paleBlueStyle}>
        <Card.Body>
          <Col className="text-center">
            <h2>Team Invitations</h2>
          </Col>
          <Col>
            {getTeamInvitations(teamInvitations).map((teams) => <AllTeamInvitationCard
              key={teams._id}
              teams={teams}
              skills={getTeamSkills(teams._id, teamSkills)}
              tools={getTeamTools(teams._id, teamTools)}
              challenges={getTeamChallenges(teams._id, teamChallenges)}
              participants={getTeamDevelopers(teams._id, teamParticipants)}/>)}
          </Col>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AllTeamInvitationsWidget;
