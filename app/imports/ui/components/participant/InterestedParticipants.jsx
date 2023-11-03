import React from 'react';
// import {
//   Grid,
//   Header,
//   Item,
//   Icon,
// } from 'semantic-ui-react';
import { Card, Container, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Teams } from '../../../api/team/TeamCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import InterestedParticipantCard from './InterestedParticipantCard';
import { paleBlueStyle } from '../../styles';

/**
 * Renders the interested participants
 * @memberOf ui/pages
 */
const InterestedParticipants = () => {

  const {
    developers, developerChallenges, developerSkills, developerTools,
    interestedDevs, teams, skills, challenges, tools,
  } = useTracker(() => {
    const documentId = useParams()._id;
    console.log(documentId);
    // console.log(Teams.find({ _id: documentId }).fetch());
    // eslint-disable-next-line max-len
    // console.log(InterestedDevs.find({ teamID: TeamDevelopers.findDoc({ developerID: Developers.findDoc({ userID: Meteor.userId() })._id }).teamID }).fetch());
    return {
      developers: Participants.find({}).fetch(),
      developerChallenges: ParticipantChallenges.find({}).fetch(),
      developerSkills: ParticipantSkills.find({}).fetch(),
      developerTools: ParticipantTools.find({}).fetch(),
      interestedDevs: WantsToJoin.find({ teamID: documentId }).fetch(),
      teams: Teams.find({ _id: documentId }).fetch(),
      skills: Skills.find({}).fetch(),
      challenges: Challenges.find({}).fetch(),
      tools: Tools.find({}).fetch(),
    };
  });

  if (interestedDevs.length === 0) {
    return (
      <Container id='no-interested' align={'center'}>
        <h4 className='text-center'>
          <Icon.PeopleFill/>
          There are no interested participants at the moment.
          <h5>
            Please check back later.
          </h5>
        </h4>
      </Container>
    );
  }

  const universalSkills = skills;

  const getDeveloperSkills = (developerID, developerSkillsParam) => {
    const data = [];
    const getSkills = _.filter(developerSkillsParam, { developerID: developerID });
    for (let i = 0; i < getSkills.length; i++) {
      for (let j = 0; j < universalSkills.length; j++) {
        if (getSkills[i].skillID === universalSkills[j]._id) {
          data.push({ name: universalSkills[j].name });
        }
      }
    }
    return data;
  };

  const universalDevs = developers;

  const getInterestedDevelopers = (devs) => {
    const data = [];
    for (let i = 0; i < devs.length; i++) {
      for (let j = 0; j < universalDevs.length; j++) {
        if (devs[i].participantID === universalDevs[j]._id) {
          data.push(universalDevs[j]);
        }
      }
    }
    // console.log(data);
    return data;
  };

  const universalTools = tools;

  const getDeveloperTools = (developerID, developerToolsParam) => {
    const data = [];
    const getTools = _.filter(developerToolsParam, { developerID: developerID });
    for (let i = 0; i < getTools.length; i++) {
      for (let j = 0; j < universalTools.length; j++) {
        if (getTools[i].toolID === universalTools[j]._id) {
          data.push({ name: universalTools[j].name });
        }
      }
    }
    // console.log(data);
    return data;
  };

  const universalChallenges = challenges;

  const getDeveloperChallenges = (developerID, developerChallengesParam) => {
    const data = [];
    const getChallenges = _.filter(developerChallengesParam, { developerID: developerID });
    for (let i = 0; i < getChallenges.length; i++) {
      for (let j = 0; j < universalChallenges.length; j++) {
        if (getChallenges[i].challengeID === universalChallenges[j]._id) {
          data.push(universalChallenges[j].title);
        }
      }
    }
    return data;
  };

  return (
    <Container id='interested-participants' className='card-pages'>
      <Card style={paleBlueStyle}>
        <Card.Body>
          <h4 className='text-center'>
            Interested Participants for Team: {teams[0].name}
          </h4>
          <Col>
            {getInterestedDevelopers(interestedDevs).map((mapDevelopers) => <InterestedParticipantCard
              key={mapDevelopers._id} developers={mapDevelopers} teams={teams}
              skills={getDeveloperSkills(mapDevelopers._id, developerSkills)}
              tools={getDeveloperTools(mapDevelopers._id, developerTools)}
              challenges={getDeveloperChallenges(mapDevelopers._id, developerChallenges)}
            />)}
          </Col>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InterestedParticipants;
