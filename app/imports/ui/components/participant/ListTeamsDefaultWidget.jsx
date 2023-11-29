import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Alert, Container } from 'react-bootstrap';
import ListTeamExampleWidget from './ListTeamExampleWidget';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenge } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';

const getTeam = (teamID) => Teams.findDoc(teamID);

const getTeamChallenges = (team) => {
  const teamID = team._id;
  const teamChallengeDocs = TeamChallenges.find({ teamID }).fetch();
  const challengeTitles = teamChallengeDocs.map((tc) => Challenge.findDoc(tc.challengeID).title);
  return challengeTitles;
};

const getTeamSkills = (team) => {
  const teamID = team._id;
  const teamSkills = TeamSkills.find({ teamID }).fetch();
  const skillNames = teamSkills.map((ts) => Skills.findDoc(ts.skillID).name);
  return skillNames;
};

const getTeamTools = (team) => {
  const teamID = team._id;
  const teamTools = TeamTools.find({ teamID }).fetch();
  const toolNames = teamTools.map((tt) => Tools.findDoc(tt.toolID).name);
  return toolNames;
};

const getTeamMembers = (team) => {
  const teamID = team._id;
  const teamParticipants = TeamParticipants.find({ teamID }).fetch();
  const memberNames = teamParticipants.map((tp) => Participants.getFullName(tp.participantID));
  return memberNames;
};

class ListTeamsWidget extends React.Component {
  render() {
    const closed = Teams.find({ open: false }).count();
    return (
      <Container>
        <Row className="d-none d-md-flex">
          <Col className="border">
            <h4>Name</h4>
          </Col>
          <Col className="border">
            <h4>Challenges</h4>
          </Col>
          <Col className="border">
            <h4>Desired Skills</h4>
          </Col>
          <Col className="border">
            <h4>Desired Tools</h4>
          </Col>
          <Col className="border">
            <h4>Devpost / Github</h4>
          </Col>
          <Col className="border">
            <h4>Members</h4>
          </Col>
          <Col className="border">
            <h4>Join?</h4>
          </Col>
        </Row>
        {this.props.teams.map((team) => (
          <ListTeamExampleWidget key={team._id}
                                 team={getTeam(team._id)}
                                 teamChallenges={getTeamChallenges(team)}
                                 teamSkills={getTeamSkills(team)}
                                 teamTools={getTeamTools(team)}
                                 teamMembers={getTeamMembers(team)}
          />
        ))}
        <Row>
          <Col className="mt-3">
            <Alert variant="danger">
              There are {closed} closed teams.
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }
}

ListTeamsWidget.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.object),
};

export default ListTeamsWidget;
