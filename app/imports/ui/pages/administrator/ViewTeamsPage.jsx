import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ViewTeams from '../../components/administrator/ViewTeams';

const ViewTeamsPage = () => (
    <ViewTeams />
);

export default withAllSubscriptions(ViewTeamsPage);
