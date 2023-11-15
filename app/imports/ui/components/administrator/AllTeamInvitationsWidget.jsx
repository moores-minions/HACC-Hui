import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import AllTeamInvitationCard from '../administrator/AllTeamInvitationCard';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class AllTeamInvitationsWidget extends React.Component {

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */

  render() {
    // eslint-disable-next-line no-unused-vars
    const sortBy = [
      { key: 'teams', text: 'teams', value: 'teams' },
      { key: 'challenges', text: 'challenges', value: 'challenges' },
      { key: 'skills', text: 'skills', value: 'skills' },
      { key: 'tools', text: 'tools', value: 'tools' },
    ];

    const universalTeams = this.props.teams;

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

    const universalSkills = this.props.skills;

    const getTeamSkills = (teamID, teamSkills) => {
      const data = [];
      const skills = _.filter(teamSkills, { teamID: teamID });
      for (let i = 0; i < skills.length; i++) {
        for (let j = 0; j < universalSkills.length; j++) {
          if (skills[i].skillID === universalSkills[j]._id) {
            data.push(universalSkills[j].name);
          }
        }
      }
      return data;
    };

    const universalTools = this.props.tools;

    const getTeamTools = (teamID, teamTools) => {
      const data = [];
      const tools = _.filter(teamTools, { teamID: teamID });
      for (let i = 0; i < tools.length; i++) {
        for (let j = 0; j < universalTools.length; j++) {
          if (tools[i].toolID === universalTools[j]._id) {
            data.push(universalTools[j].name);
          }
        }
      }
      return data;
    };

    const universalChallenges = this.props.challenges;

    const getTeamChallenges = (teamID, teamChallenges) => {
      const data = [];
      const challenges = _.filter(teamChallenges, { teamID: teamID });
      for (let i = 0; i < challenges.length; i++) {
        for (let j = 0; j < universalChallenges.length; j++) {
          if (challenges[i].challengeID === universalChallenges[j]._id) {
            data.push(universalChallenges[j].title);
          }
        }
      }
      return data;
    };

    const allDevelopers = this.props.participants;

    const getTeamDevelopers = (teamID, teamParticipants) => {
      const data = [];
      const participants = _.filter(teamParticipants, { teamID: teamID });
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
      <Container className="py-3">
        <Row className="justify-content-center">
          <Col>
            <Col className="text-center">
              <h2>Team Invitations</h2>
            </Col>
            <Row className="justify-content-center g-4">
              {getTeamInvitations(this.props.teamInvitations).map((teams) => <AllTeamInvitationCard
                          key={teams._id}
                           teams={teams}
                           skills={getTeamSkills(teams._id, this.props.teamSkills)}
                           tools={getTeamTools(teams._id, this.props.teamTools)}
                           challenges={getTeamChallenges(teams._id, this.props.teamChallenges)}
                           participants={getTeamDevelopers(teams._id, this.props.teamParticipants)}/>)}
            </Row>
          </Col>
        </Row>
      </Container>
      //   <Grid container doubling relaxed stackable>
      //     <Grid.Row centered>
      //       <Header as={'h2'} style={{ paddingTop: '2rem' }}>
      //         Team Invitations
      //       </Header>
      //     </Grid.Row>
      //     <Grid.Column width={16}>
      //       <Item.Group divided>
      //         {getTeamInvitations(this.props.teamInvitations).map((teams) => <AllTeamInvitationCard
      //             key={teams._id}
      //             teams={teams}
      //             skills={getTeamSkills(teams._id, this.props.teamSkills)}
      //             tools={getTeamTools(teams._id, this.props.teamTools)}
      //             challenges={getTeamChallenges(teams._id, this.props.teamChallenges)}
      //             participants={getTeamDevelopers(teams._id, this.props.teamParticipants)}/>)}
      //       </Item.Group>
      //     </Grid.Column>
      //   </Grid>
    );
  }
}

AllTeamInvitationsWidget.propTypes = {
  teamChallenges: PropTypes.array.isRequired,
  teamSkills: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  teamTools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  teamParticipants: PropTypes.array.isRequired,
  teamInvitations: PropTypes.array.isRequired,

};

export default withTracker(() => ({
  teamChallenges: TeamChallenges.find({}).fetch(),
  teamInvitations: TeamInvitations.find().fetch(),
  teamSkills: TeamSkills.find({}).fetch(),
  teamTools: TeamTools.find({}).fetch(),
  teams: Teams.find({}).fetch(),
  skills: Skills.find({}).fetch(),
  challenges: Challenges.find({}).fetch(),
  tools: Tools.find({}).fetch(),
  participants: Participants.find({}).fetch(),
  teamParticipants: TeamParticipants.find({}).fetch(),
}))(AllTeamInvitationsWidget);
