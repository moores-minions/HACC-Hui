import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { ROLE } from '../../api/role/Role';
import { ROUTES } from '../../startup/client/route-constants';
import { Participants } from '../../api/user/ParticipantCollection';
import { Teams } from '../../api/team/TeamCollection';
import { Suggestions } from '../../api/suggestions/SuggestionCollection';
import { CanCreateTeams } from '../../api/team/CanCreateTeamCollection';

class NavBar extends React.Component {
  render() {
    let isCompliant = this.props.canCreateTeams;
    const isAdmin =
      this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
    const isParticipant =
      this.props.currentUser &&
      Roles.userIsInRole(Meteor.userId(), ROLE.PARTICIPANT);

    if (isParticipant) {
      const participant = Participants.findDoc({ userID: Meteor.userId() });
      isCompliant = isCompliant && participant.isCompliant;
    }

    const numParticipants = Participants.count();
    const numTeams = Teams.find({ open: true }).count();
    const teamCount = Teams.count();
    const suggestionCount = Suggestions.count();

    return (
      <Navbar className="navbar-dark" expand="lg">
        <Navbar.Brand className="navbar-brand" as={NavLink} to={ROUTES.LANDING}>
          HACC-Hui
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-between"
        >
          <Nav className="mr-auto">
            {isParticipant ? (
              <>
                <Nav.Link id="profile" as={NavLink} to={ROUTES.YOUR_PROFILE}>
                  Profile
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to={ROUTES.CREATE_TEAM}
                  disabled={!isCompliant}
                >
                  Create Team
                </Nav.Link>
                <Nav.Link id="open-teams" as={NavLink} to={ROUTES.BEST_FIT}>
                  Open Teams ({numTeams})
                </Nav.Link>
                <Nav.Link id="your-teams" as={NavLink} to={ROUTES.YOUR_TEAMS}>
                  Your Teams
                </Nav.Link>
                <Nav.Link
                  id="list-participants"
                  as={NavLink}
                  to={ROUTES.LIST_PARTICIPANTS}
                >
                  List Participants ({numParticipants})
                </Nav.Link>
                <Nav.Link id="suggest-tool-skill" as={NavLink} to={ROUTES.SUGGEST_TOOL_SKILL}>
                  Suggest Tool/Skill
                </Nav.Link>
                <Nav.Link id='invitations' as={NavLink} to={ROUTES.TEAM_INVITATIONS}>
                  Invitations
                </Nav.Link>
              </>
            ) : (
              ''
            )}

            {isAdmin ? (
              <>
                <Nav.Link
                  id="configHACC"
                  as={NavLink}
                  to={ROUTES.CONFIGURE_HACC}
                >
                  Configure HACC
                </Nav.Link>
                <Nav.Link id='update-minors' as={NavLink} to={ROUTES.UPDATE_MP}>
                  Update Minor Participants Status
                </Nav.Link>
                <Nav.Link
                  id="list-suggestions"
                  as={NavLink}
                  to={ROUTES.LIST_SUGGESTIONS}
                >
                  Suggestions List ({suggestionCount})
                </Nav.Link>
                <Nav.Link
                  id="list-parts"
                  as={NavLink}
                  to={ROUTES.LIST_PARTICIPANTS_ADMIN}
                >
                  List Participants ({numParticipants})
                </Nav.Link>
                <Nav.Link as={NavLink} to={ROUTES.VIEW_TEAMS}>
                  View Teams ({teamCount})
                </Nav.Link>
                <Nav.Link
                  id="al-in"
                  as={NavLink}
                  to={ROUTES.ALL_TEAM_INVITATIONS}
                >
                  View All Team Invitations
                </Nav.Link>
                <Nav.Link id="dump-page" as={NavLink} to={ROUTES.DUMP_DATABASE}>
                  Manage Database
                </Nav.Link>
              </>
            ) : (
              ''
            )}
          </Nav>

          <Nav className="pr">
            <Nav.Link id="help-page" as={NavLink} to={ROUTES.HELP_PAGE}>
              Help
            </Nav.Link>
            {this.props.currentUser === '' ? (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item
                  id="login-dropdown-sign-in"
                  as={NavLink}
                  to={ROUTES.SIGN_IN}
                >
                  Sign In
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown
                id="navbar-current-user"
                title={this.props.currentUser}
              >
                <NavDropdown.Item
                  id="navbar-sign-out"
                  as={NavLink}
                  to={ROUTES.SIGN_OUT}
                >
                  Sign Out
                </NavDropdown.Item>
                {isParticipant ? (
                  <NavDropdown.Item
                    id="delete-account"
                    as={NavLink}
                    to={ROUTES.DELETE_ACCOUNT}
                  >
                    Delete Account
                  </NavDropdown.Item>
                ) : (
                  ''
                )}
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

NavBar.propTypes = {
  currentUser: PropTypes.string,
  canCreateTeams: PropTypes.bool,
};

const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
  canCreateTeams: CanCreateTeams.findOne().canCreateTeams,
}))(NavBar);

export default withRouter(NavBarContainer);
