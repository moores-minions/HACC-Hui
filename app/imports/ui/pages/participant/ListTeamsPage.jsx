import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListTeamsDefaultWidget from '../../components/participant/ListTeamsDefaultWidget';

const ListTeamsPage = () => (
    <ListTeamsDefaultWidget />
);

export default withAllSubscriptions(ListTeamsPage);
