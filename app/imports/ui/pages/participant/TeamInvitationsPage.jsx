import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import TeamInvitationsWidget from '../../components/participant/TeamInvitationsWidget';

const TeamInvitationsPage = () => <TeamInvitationsWidget />;

export default withAllSubscriptions(TeamInvitationsPage);
