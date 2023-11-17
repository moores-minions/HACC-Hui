import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Button, Container } from 'react-bootstrap';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { paleBlueStyle } from '../../styles';
import ProfileCard from './ProfileCard';
import { ROUTES } from '../../../startup/client/route-constants';
import TeamMembershipWidget from './TeamMembershipWidget';
import { Tools } from '../../../api/tool/ToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';

const ProfileWidget = () => {

  const { participant, devChallenges, devSkills, devTools } = useTracker(() => {
    const getParticipant = Participants.findDoc({ userID: Meteor.userId() });
    const participantID = getParticipant._id;
    const getDevChallenges = ParticipantChallenges.find({ participantID }).fetch();
    const getDevSkills = ParticipantSkills.find({ participantID }).fetch();
    const getDevTools = ParticipantTools.find({ participantID }).fetch();
    return {
      participant: getParticipant,
      devChallenges: getDevChallenges,
      devSkills: getDevSkills,
      devTools: getDevTools,
    };
  });

  const buildTheModel = () => {
    const model = participant;
    model.challenges = devChallenges.map((challenge) => {
      const c = Challenges.findDoc(challenge.challengeID);
      return c.title;
    });
    model.skills = devSkills.map((skills) => {
      const s = Skills.findDoc(skills.skillID);
      return s.name;
    });
    model.tools = devTools.map((tools) => {
      const t = Tools.findDoc(tools.toolID);
      return t.name;
    });
    return model;
  };

  const model = buildTheModel();
  return (
    <div style={{ paddingBottom: '50px', paddingTop: '40px' }}>
      <Container id="profile-page" style={{ paleBlueStyle, textAlign: 'center' }}>
        <h2>Your Profile</h2>
        <ProfileCard model={model}/>
        <Button id="edit-profile-button" variant="success">
          <Link to={ROUTES.EDIT_PROFILE} style={{ color: 'white', textDecoration: 'none' }}>Edit Profile</Link>
        </Button>
      </Container>

      <TeamMembershipWidget id="team-card"/>
    </div>
  );
};

export default ProfileWidget;
