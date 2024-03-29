import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Row, Col, Card, Spinner, Form } from 'react-bootstrap';
import { Challenge } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import ListTeamsWidget from '../../components/participant/ListTeamsWidget';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { paleBlueStyle } from '../../styles';

/** Renders a table containing all of the Book documents. Use <BookItem> to render each row. */
const BestTeam = (props) => {
  const [select, setSelect] = useState('default');

  // constructor(props) {
  //   super(props);
  //   this.state = { select: 'default' };
  // }

  const getDeveloper = () => Participants.findOne({ username: Meteor.user().username });

  const getAllOpenTeams = () => {
    const teams = Teams.find({ open: true }).fetch();
    return teams;
    // console.log(this.AllOpenTeam);
  };

  const byAtoZ = () => {
    const allTeams = getAllOpenTeams();
    return _.sortBy(allTeams, (team) => team.name.toLowerCase());
  };

  const byChallengeMatch = () => {
    const participantID = getDeveloper()._id;
    const pChallenges = ParticipantChallenges.find({ participantID }).fetch();
    const allTeams = getAllOpenTeams();
    _.forEach(allTeams, (team) => {
      const tChallenges = TeamChallenges.find({ teamID: team._id }).fetch();
      // eslint-disable-next-line no-param-reassign
      team.priority = _.intersectionBy(pChallenges, tChallenges, 'challengeID').length;
    });
    return _.sortBy(allTeams, 'priority').reverse();
  };

  const bySkillMatch = () => {
    const participantID = getDeveloper()._id;
    const pSkills = ParticipantSkills.find({ participantID }).fetch();
    const allTeams = getAllOpenTeams();
    _.forEach(allTeams, (team) => {
      const tSkills = TeamSkills.find({ teamID: team._id }).fetch();
      // eslint-disable-next-line no-param-reassign
      team.priority = _.intersectionBy(pSkills, tSkills, 'skillID').length;
    });
    return _.sortBy(allTeams, 'priority').reverse();
  };

  const byToolMatch = () => {
    const participantID = getDeveloper()._id;
    const pTools = ParticipantTools.find({ participantID }).fetch();
    const allTeams = getAllOpenTeams();
    _.forEach(allTeams, (team) => {
      const tTools = TeamTools.find({ teamID: team._id }).fetch();
      // eslint-disable-next-line no-param-reassign
      team.priority = _.intersectionBy(pTools, tTools, 'toolID').length;
    });
    return _.sortBy(allTeams, 'priority').reverse();
  };

  const byBestMatch = () => {
    const participantID = getDeveloper()._id;
    const pChallenges = ParticipantChallenges.find({ participantID }).fetch();
    const pSkills = ParticipantSkills.find({ participantID }).fetch();
    const pTools = ParticipantTools.find({ participantID }).fetch();
    const allTeams = getAllOpenTeams();
    _.forEach(allTeams, (team) => {
      const tChallenges = TeamChallenges.find({ teamID: team._id }).fetch();
      const tSkills = TeamSkills.find({ teamID: team._id }).fetch();
      const tTools = TeamTools.find({ teamID: team._id }).fetch();
      // eslint-disable-next-line no-param-reassign
      team.priority = _.intersectionBy(pChallenges, tChallenges, 'challengeID').length * 5;
      // eslint-disable-next-line no-param-reassign
      team.priority = _.intersectionBy(pSkills, tSkills, 'skillID').length;
      // eslint-disable-next-line no-param-reassign
      team.priority = _.intersectionBy(pTools, tTools, 'toolID').length;
    });
    return _.sortBy(allTeams, 'priority').reverse();

  };

  const renderDropDown = () => {
    const _select = (e, data) => {
      setSelect(data.value);
      // const newState = { select: data.value };
      // this.setState(newState);
    };
    const options = [
      { key: 0, text: 'Sort the teams by the challenges that match your challenges', value: 'default' },
      { key: 1, text: 'Sort by best fit teams', value: 'best' },
      { key: 2, text: 'Sort the teams by the skills that match your skills', value: 'skill' },
      { key: 3, text: 'Sort the teams by the tools that match your tools', value: 'tool' },
      { key: 4, text: 'Sort the teams by the name in alphabet order', value: 'AToZ' },
    ];
    return (
      <div>
        <Row>
          <Col style={ { marginTop: '15px' } }>
            <h5 style={ { textAlign: 'center' } }>
              Please select a filter to reorder the teams:
            </h5>
          </Col>
          <Col style={ { marginTop: '10px', marginRight: '100px' } }>
            <Form.Select onChange={_select} id="#filter-button">
              {options.map((option) => (
                <option key={options.key} value={option.value}>
                  {option.text}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <hr />
      </div>
    );
  };

  // render() {
  //   return (this.props.ready) ? this.renderPage() : <Spinner animation="border" />;
  // }

  const renderPage = () => {
    let teams;
    switch (select) {
      case 'skill':
        teams = bySkillMatch();
        break;
      case 'tool':
        teams = byToolMatch();
        break;
      case 'AToZ':
        teams = byAtoZ();
        break;
      case 'best':
        teams = byBestMatch();
        break;
      default:
        teams = byChallengeMatch();
    }
    return (
      <div style={{ paddingBottom: '50px', paddingTop: '40px', paddingRight: '40px', paddingLeft: '40px' }}>
        <Card style={paleBlueStyle}>
          <h2 style={ { textAlign: 'center' } }>
            Open Teams
          </h2>
          <Card style={ { marginLeft: '30px', marginRight: '30px', marginBottom: '30px' } }>
            {renderDropDown()}
            <div style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
              <ListTeamsWidget teams={teams} />
            </div>
          </Card>
        </Card>
      </div>
    );
  };
  return (props.ready) ? renderPage() : <Spinner animation="border" />;
};

/** Require an array of Book documents in the props. */
BestTeam.propTypes = {
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  developerSkill: PropTypes.array.isRequired,
  teamSkills: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,

};

export default withTracker(() => {
  const subscriptionChallenges = Challenge.subscribe();
  const subscriptionSkills = Skills.subscribe();
  const subscriptionTools = Tools.subscribe();
  const subscriptionDevelopers = Participants.subscribe();
  const subscriptionTeams = Teams.subscribe();
  const subscriptionDeveloperChallenges = ParticipantChallenges.subscribe();
  const subscriptionTeamChallenges = TeamChallenges.subscribe();
  const subscriptionDeveloperSkill = ParticipantSkills.subscribe();
  const subscriptionDeveloperTools = ParticipantTools.subscribe();
  const subscriptionTeamSkill = TeamSkills.subscribe();
  const subscriptionTeamTool = TeamTools.subscribe();
  const subscriptionWantToJoin = WantsToJoin.subscribe();

  return {
    challenges: Challenge.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    developers: Participants.find({}).fetch(),
    teams: Teams.find({}).fetch(),
    developerSkill: ParticipantSkills.find({}).fetch(),
    teamSkills: TeamSkills.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready() && subscriptionDevelopers.ready() && subscriptionTeams.ready() && subscriptionDeveloperChallenges.ready() && subscriptionTeamChallenges.ready() && subscriptionDeveloperSkill.ready() && subscriptionTeamSkill.ready() && subscriptionTeamTool.ready() && subscriptionDeveloperTools.ready() && subscriptionWantToJoin.ready(),
  };
})(BestTeam);
