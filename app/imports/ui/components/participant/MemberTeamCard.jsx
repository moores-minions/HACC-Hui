import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenge } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { Tools } from '../../../api/tool/ToolCollection';

const MemberTeamCard = ({ team, teamParticipants }) => {
  const teamID = team._id;
  const teamChallenges = _.map(TeamChallenges.find({ teamID }).fetch(),
  (tc) => Challenge.findDoc(tc.challengeID).title);
  const teamSkills = _.map(TeamSkills.find({ teamID }).fetch(), (ts) => Skills.findDoc(ts.skillID).name);
  const teamTools = _.map(TeamTools.find({ teamID }).fetch(), (tt) => Tools.findDoc(tt.toolID).name);
  return (
      <Container className='team-card'>
        <Row>
          <h5 className='team-name'>
            <Icon.PeopleFill size={32}/>
            {' '}
            <b>{team.name}</b>
          </h5>
        </Row>
        <Row>
          <Col>
            GitHub: {team.gitHubRepo}<br />
            DevPost: {team.devPostPage}
            <Image src={team.image} rounded size='large' />
          </Col>
          <Col>
            <h5>Challenges</h5>
            {teamChallenges.map((skill) => <p key={skill}>{skill}</p>)}
          </Col>
          <Col>
            <h5>Skills</h5>
            {teamSkills.map((skill) => <p key={skill}>{skill}</p>)}
          </Col>
          <Col>
            <h5>Tools</h5>
            {teamTools.map((skill) => <p key={skill}>{skill}</p>)}
          </Col>
          <Col>
            <h5>Members</h5>
            {teamParticipants.map((participant) => <p key={participant}>
              {participant.firstName} {participant.lastName}</p>)}
          </Col>
        </Row>
      </Container>
  );
};

MemberTeamCard.propTypes = {
  team: PropTypes.object.isRequired,
  teamParticipants: PropTypes.array.isRequired,
};

export default MemberTeamCard;
