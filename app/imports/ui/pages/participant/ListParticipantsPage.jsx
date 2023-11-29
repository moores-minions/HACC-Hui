import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListParticipantsWidget from '../../components/participant/ListParticipantsWidget';

const ListParticipantsPage = () => (
    <ListParticipantsWidget />
);

export default withAllSubscriptions(ListParticipantsPage);
