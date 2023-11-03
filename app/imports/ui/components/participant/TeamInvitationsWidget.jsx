import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import TeamInvitationCard from './TeamInvitationCard';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { paleBlueStyle } from '../../styles';

/**
 * Renders the Page for team invitations. **deprecated**
 * @memberOf ui/pages
 */
const TeamInvitationsWidget = () => {

  const { teamChallenges, teamInvitations, teamSkills, teamTools, teams, skills, challenges, tools,
    participants, teamParticipants } = useTracker(() => ({
      teamChallenges: TeamChallenges.find({}).fetch(),
      teamInvitations: TeamInvitations.find({ participantID: Participants.findDoc(
        { userID: Meteor.userId() },
        )._id }).fetch(),
      teamSkills: TeamSkills.find({}).fetch(),
      teamTools: TeamTools.find({}).fetch(),
      teams: Teams.find({}).fetch(),
      skills: Skills.find({}).fetch(),
      challenges: Challenges.find({}).fetch(),
      tools: Tools.find({}).fetch(),
      participants: Participants.find({}).fetch(),
      teamParticipants: TeamParticipants.find({}).fetch(),
    }));

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
    if (teamInvitations.length === 0) {
      return (
          <Container id='no-invitations' align={'center'}>
            <h4 className='text-center'>
              <Icon.PeopleFill/>
              {' '}
              You have no invitations at the moment.
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

    const universalTeams = teams;

    const getTeamInvitations = (invs) => {
      const data = [];
      for (let i = 0; i < invs.length; i++) {
        for (let j = 0; j < universalTeams.length; j++) {
          if (invs[i].teamID === universalTeams[j]._id) {
            data.push(universalTeams[j]);
          }
        }
      }
      return data;
    };

    const universalSkills = skills;

    const getTeamSkills = (teamID, teamSkillsParam) => {
      const data = [];
      const getSkills = _.filter(teamSkillsParam, { teamID: teamID });
      for (let i = 0; i < getSkills.length; i++) {
        for (let j = 0; j < universalSkills.length; j++) {
          if (getSkills[i].skillID === universalSkills[j]._id) {
            data.push(universalSkills[j].name);
          }
        }
      }
      return data;
    };

    const universalTools = tools;

    const getTeamTools = (teamID, teamToolsParam) => {
      const data = [];
      const getTools = _.filter(teamToolsParam, { teamID: teamID });
      for (let i = 0; i < getTools.length; i++) {
        for (let j = 0; j < universalTools.length; j++) {
          if (getTools[i].toolID === universalTools[j]._id) {
            data.push(universalTools[j].name);
          }
        }
      }
      return data;
    };

    const universalChallenges = challenges;

    const getTeamChallenges = (teamID, teamChallengesParam) => {
      const data = [];
      const getChallenges = _.filter(teamChallengesParam, { teamID: teamID });
      for (let i = 0; i < getChallenges.length; i++) {
        for (let j = 0; j < universalChallenges.length; j++) {
          if (getChallenges[i].challengeID === universalChallenges[j]._id) {
            data.push(universalChallenges[j].title);
          }
        }
      }
      return data;
    };

    const allDevelopers = participants;

    const getTeamDevelopers = (teamID, teamParticipantsParam) => {
      const data = [];
      const getParticipants = _.filter(teamParticipantsParam, { teamID: teamID });
      for (let i = 0; i < getParticipants.length; i++) {
        for (let j = 0; j < allDevelopers.length; j++) {
          if (getParticipants[i].participantID === allDevelopers[j]._id) {
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
        <Container id='team-invitations' className='card-pages'>
            <Card style={paleBlueStyle} >
              <Card.Body>
                <h4 className="text-center">
                  Team Invitations
                </h4>
                <Col>
                  {getTeamInvitations(teamInvitations).map((mapTeams) => <TeamInvitationCard key={mapTeams._id}
                                        teams={mapTeams} skills={getTeamSkills(mapTeams._id, teamSkills)}
                                        tools={getTeamTools(mapTeams._id, teamTools)}
                                        challenges={getTeamChallenges(mapTeams._id, teamChallenges)}
                                        participants={getTeamDevelopers(mapTeams._id, teamParticipants)}
                  />)}
                </Col>
              </Card.Body>
            </Card>
        </Container>
    );
};

export default TeamInvitationsWidget;
