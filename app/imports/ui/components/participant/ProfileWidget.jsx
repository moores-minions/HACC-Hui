import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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

class EditProfileWidget extends React.Component {

  buildTheModel() {
    const model = this.props.participant;
    model.challenges = _.map(this.props.devChallenges, (challenge) => {
      const c = Challenges.findDoc(challenge.challengeID);
      return c.title;
    });
    model.skills = _.map(this.props.devSkills, (skill) => {
      const s = Skills.findDoc(skill.skillID);
      return s.name;
    });
    model.tools = _.map(this.props.devTools, (tool) => {
      const t = Tools.findDoc(tool.toolID);
      return t.name;
    });
    return model;
  }

  render() {
    // console.log(this.props);
    const model = this.buildTheModel();
    return (
        <div style={{ paddingBottom: '50px', paddingTop: '40px' }}><Container id="profile-page">
          <Segment style={paleBlueStyle}>
            <Header as="h2" textAlign="center">Your Profile</Header>
            <ProfileCard model={model} />
            <Button id="edit-profile-button" color="olive"><Link to={ROUTES.EDIT_PROFILE}>Edit Profile</Link></Button>
          </Segment>
          <Segment style={paleBlueStyle}>
            <Header as="h2" textAlign="center">Team Membership</Header>
            <TeamMembershipWidget id="team-card" />
          </Segment>
        </Container>
        </div>
    );
  }
}

EditProfileWidget.propTypes = {
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

const EditProfileWidgetCon = withTracker(() => {
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
})(EditProfileWidget);

export default withRouter(EditProfileWidgetCon);
