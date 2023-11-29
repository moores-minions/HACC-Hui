import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Navbar, Offcanvas, NavDropdown, Nav, Container } from 'react-bootstrap';
// import * as Icon from 'react-bootstrap-icons';
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
          <Navbar inverted fixed={'top'} className={'mobileBar'}>
            <Navbar.Toggle aria-controls={'offcanvasNavbar-expand-false'}/>
            <Navbar.Collapse id="navbar-offcanvas"></Navbar.Collapse>
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-false"
              aria-labelledby={'offcanvasNavbarLabel-expand-false'}
            >
              <Offcanvas.Header closeButton/>
            <Offcanvas.Body>
            <div onClick={() => setVisible(!this.state.visible)} style={{ padding: '5px' }}>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <NavDropdown title="..." id="offcanvasNavbarDropdown-expand-false"
                             >
            <NavDropdown.Item as={NavLink} activeClassName="" exact to={ROUTES.LANDING}
                         onClick={() => setVisible(!this.state.visible)}>
                <h1>HACC-Hui</h1>
              </NavDropdown.Item>
              {isParticipant ? (
                  [
                      <NavDropdown.Item as={NavLink}
                               activeClassName="active"
                               disabled={!isCompliant}
                               exact
                               to={ROUTES.CREATE_TEAM}
                               key='team-creation'>Create a Team</NavDropdown.Item>,
                    <NavDropdown.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.YOUR_PROFILE}
                               key='edit-profile'>Your Profile</NavDropdown.Item>,
                    <NavDropdown.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.BEST_FIT}
                               key='list-teams'>List the Teams ({numTeams})</NavDropdown.Item>,
                    <NavDropdown.Item as={NavLink}
                               activeClassName="active"
                               disabled={!isCompliant}
                               exact
                               to={ROUTES.YOUR_TEAMS}
                               key='your-teams'>Your
                      Teams</NavDropdown.Item>,
                    <NavDropdown.Item as={NavLink}
                               activeClassName="active"
                               exact to={ROUTES.LIST_PARTICIPANTS}
                               key='list-participants'>List the Participants ({numParticipants})</NavDropdown.Item>,
                    <NavDropdown.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.SUGGEST_TOOL_SKILL}
                               key='suggest-tool-skill'>Suggest Tool/Skill</NavDropdown.Item>,
                    <NavDropdown.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.TEAM_INVITATIONS}
                               key='team-invitations'>Your Invitations</NavDropdown.Item>,
                  ]
              ) : ''}
              {isAdmin ? (
                  [
                    <NavDropdown.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.CONFIGURE_HACC}
                               key={ROUTES.CONFIGURE_HACC}>Configure HACC</NavDropdown.Item>,
                    <NavDropdown.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.UPDATE_MP}
                               key={ROUTES.UPDATE_MP}>
                      Update Minor Participants Status ({uncompliantMinors})
                    </NavDropdown.Item>,
                    <NavDropdown.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.LIST_SUGGESTIONS}
                               key={ROUTES.LIST_SUGGESTIONS}>Suggestions List ({suggestionCount})</NavDropdown.Item>,
                    <NavDropdown.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.VIEW_TEAMS}
                               key={ROUTES.VIEW_TEAMS}>View Team ({teamCount})</NavDropdown.Item>,
                    <NavDropdown.Item as={NavLink}
                               activeClassName="active"
                               exact
                               to={ROUTES.DUMP_DATABASE}
                               key={ROUTES.DUMP_DATABASE}>Dump Database</NavDropdown.Item>,
                  ]
              ) : ''}
              <NavDropdown.Item>
                {this.props.currentUser === '' ? (
                    <NavDropdown.Item as={NavLink} activeClassName="active" exact to={ROUTES.SIGN_IN}
                               key={ROUTES.SIGN_IN}
                               onClick={() => setVisible(!this.state.visible)}>Sign In</NavDropdown.Item>
                ) : (
                    [<NavDropdown.Item as={NavLink} activeClassName="active" exact to={ROUTES.SIGN_OUT}
                               key={ROUTES.SIGN_OUT}
                               onClick={() => setVisible(!this.state.visible)}>Sign Out</NavDropdown.Item>,
                      <NavDropdown.Item as={NavLink} activeClassName="active" exact to={ROUTES.DELETE_ACCOUNT}
                                 key={ROUTES.DELETE_ACCOUNT}
                                 onClick={() => setVisible(!this.state.visible)}>Delete Account</NavDropdown.Item>,
                    ]
                )}
              </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </div>
            </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Navbar>
            <Container style={{ paddingTop: '5rem' }} fluid="md">
              {this.props.children}
            </Container>
        </div>

    );
  }
}

SideBar.propTypes = {
  currentUser: PropTypes.string,
  children: PropTypes.array,
  visible: PropTypes.bool,
};

const SideBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(SideBar);

export default withRouter(SideBarContainer);
