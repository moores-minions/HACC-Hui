import React from 'react';
import { Container } from 'react-bootstrap';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import AllTeamInvitationsWidget from '../../components/administrator/AllTeamInvitationsWidget';

class AllTeamInvitationsPage extends React.Component {
  render() {
    return (
      <Container id="allteamsinvitationPage">
        <AllTeamInvitationsWidget />
      </Container>
    );
  }
}

export default withAllSubscriptions(AllTeamInvitationsPage);
