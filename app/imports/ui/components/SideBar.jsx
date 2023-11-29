import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Header, Sidebar, Segment, Icon } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import _ from 'lodash';
import { ROLE } from '../../api/role/Role';
import { ROUTES } from '../../startup/client/route-constants';
import { Participants } from '../../api/user/ParticipantCollection';
import { Teams } from '../../api/team/TeamCollection';
import { Suggestions } from '../../api/suggestions/SuggestionCollection';
import { MinorParticipants } from '../../api/user/MinorParticipantCollection';
import { HACCHui } from '../../api/hacc-hui/HACCHui';

/**
 * The SideBar appears on the side of every page. Rendered by the App Layout component.
 * @memberOf ui/components
 */
class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {

    let isCompliant = HACCHui.canCreateTeams;
    const isAdmin = this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
    const isParticipant = this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.PARTICIPANT);
    if (isParticipant) {
      const participant = Participants.findDoc({ userID: Meteor.userId() });
      isCompliant = isCompliant && participant.isCompliant;
    }

    const numParticipants = Participants.count();
    const numTeams = Teams.find({ open: true }).count();
    const teamCount = Teams.count();
    const suggestionCount = Suggestions.count();
    const minors = MinorParticipants.find({}).fetch();
    const uncompliantMinors = _.filter(minors, (m) => Participants.findDoc(m.participantID).isCompliant).length;

    const setVisible = (state) => {
      this.setState({ visible: state });
    };

    return (
        <div>
          <Menu borderless inverted fixed={'top'} className={'mobileBar'}>
            <Menu.Item position={'left'}>
              <div onClick={() => setVisible(!this.state.visible)} style={{ padding: '5px' }}>
                <Icon name='bars'/>
              </div>
            </Menu.Item>
          </Menu>
          <Sidebar.Pushable as={Segment} className={'sideBar'}>
            <Sidebar
                style={{ paddingTop: '4rem', backgroundColor: 'rgb(18, 72, 132)' }}
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                vertical
                onHide={() => setVisible(false)}
                visible={this.state.visible}
                width='thin'
            >
              <Menu.Item as={NavLink} activeClassName="" exact to={ROUTES.LANDING}
                         onClick={() => setVisible(!this.state.visible)}>
                <Header inverted as='h1'>HACC-Hui</Header>
              </Menu.Item>
              {isParticipant ? (
                  [
                      <Menu.Item as={NavLink}
                               activeClassName="active"
                               disabled={!isCompliant}
                               exact
                               to={ROUTES.CREATE_TEAM}
                               key='team-creation'>Create a Team</Menu.Item>,
                    <Menu.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.YOUR_PROFILE}
                               key='edit-profile'>Your Profile</Menu.Item>,
                    <Menu.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.BEST_FIT}
                               key='list-teams'>List the Teams ({numTeams})</Menu.Item>,
                    <Menu.Item as={NavLink}
                               activeClassName="active"
                               disabled={!isCompliant}
                               exact
                               to={ROUTES.YOUR_TEAMS}
                               key='your-teams'>Your
                      Teams</Menu.Item>,
                    <Menu.Item as={NavLink}
                               activeClassName="active"
                               exact to={ROUTES.LIST_PARTICIPANTS}
                               key='list-participants'>List the Participants ({numParticipants})</Menu.Item>,
                    <Menu.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.SUGGEST_TOOL_SKILL}
                               key='suggest-tool-skill'>Suggest Tool/Skill</Menu.Item>,
                    <Menu.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.TEAM_INVITATIONS}
                               key='team-invitations'>Your Invitations</Menu.Item>,
                  ]
              ) : ''}
              {isAdmin ? (
                  [
                    <Menu.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.CONFIGURE_HACC}
                               key={ROUTES.CONFIGURE_HACC}>Configure HACC</Menu.Item>,
                    <Menu.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.UPDATE_MP}
                               key={ROUTES.UPDATE_MP}>
                      Update Minor Participants Status ({uncompliantMinors})
                    </Menu.Item>,
                    <Menu.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.LIST_SUGGESTIONS}
                               key={ROUTES.LIST_SUGGESTIONS}>Suggestions List ({suggestionCount})</Menu.Item>,
                    <Menu.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.VIEW_TEAMS}
                               key={ROUTES.VIEW_TEAMS}>View Team ({teamCount})</Menu.Item>,
                    <Menu.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.DUMP_DATABASE}
                               key={ROUTES.DUMP_DATABASE}>Dump Database</Menu.Item>,
                  ]
              ) : ''}
              <Menu.Item>
                {this.props.currentUser === '' ? (
                    <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.SIGN_IN}
                               key={ROUTES.SIGN_IN}
                               onClick={() => setVisible(!this.state.visible)}>Sign In</Menu.Item>
                ) : (
                    [<Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.SIGN_OUT}
                               key={ROUTES.SIGN_OUT}
                               onClick={() => setVisible(!this.state.visible)}>Sign Out</Menu.Item>,
                      <Menu.Item as={NavLink} activeClassName="active" exact to={ROUTES.DELETE_ACCOUNT}
                                 key={ROUTES.DELETE_ACCOUNT}
                                 onClick={() => setVisible(!this.state.visible)}>Delete Account</Menu.Item>,
                    ]
                )}
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher style={{ paddingTop: '5rem' }}>
              {this.props.children}
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>

    );
  }
}

// Declare the types of all properties.
SideBar.propTypes = {
  currentUser: PropTypes.string,
  children: PropTypes.array,
  visible: PropTypes.bool,
};

const SideBarContainer = () => {
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);

  return <SideBar currentUser={currentUser}/>;
};
// Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(SideBarContainer);
