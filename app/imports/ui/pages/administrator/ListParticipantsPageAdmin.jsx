import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListParticipantsWidgetAdmin from '../../components/administrator/ListParticipantsWidgetAdmin';

const ListParticipantsPageAdmin = () => <ListParticipantsWidgetAdmin />;

export default withAllSubscriptions(ListParticipantsPageAdmin);
