import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Button, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
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

const ProfileWidget = ({ participant, devChallenges, devSkills, devTools }) => {
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
          <ProfileCard model={model} />
          <Button id="edit-profile-button" color="black" >
            <Link to={ROUTES.EDIT_PROFILE}>Edit Profile</Link>
          </Button>
        </Container>

        <Container style={{ paleBlueStyle, textAlign: 'center' }}>
          <h2>Team Membership</h2>
          <TeamMembershipWidget id="team-card" />
        </Container>
      </div>
  );
};

ProfileWidget.propTypes = {
  participant: PropTypes.object.isRequired,
  devChallenges: PropTypes.arrayOf(
      PropTypes.object,
  ),
  devSkills: PropTypes.arrayOf(
      PropTypes.object,
  ),
  devTools: PropTypes.arrayOf(
      PropTypes.object,
  ),
};

const ProfileWidgetCon = withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  const participantID = participant._id;
  const devChallenges = ParticipantChallenges.find({ participantID }).fetch();
  const devSkills = ParticipantSkills.find({ participantID }).fetch();
  const devTools = ParticipantTools.find({ participantID }).fetch();
  return {
    participant,
    devChallenges,
    devSkills,
    devTools,
  };
})(ProfileWidget);

export default withRouter(ProfileWidgetCon);
