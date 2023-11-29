import React from 'react';
import { Container } from 'react-bootstrap';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import AllTeamInvitationsWidget from '../../components/administrator/AllTeamInvitationsWidget';

const AllTeamInvitationsPage = () => (
    <Container id="all-teams-invitation-page">
      <AllTeamInvitationsWidget />
    </Container>
);

export default withAllSubscriptions(AllTeamInvitationsPage);
