import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import AdminEditTeamWidget from '../../components/administrator/AdminEditTeamWidget';

const AdminEditTeamPage = () => (
    <AdminEditTeamWidget />
);

export default withAllSubscriptions(AdminEditTeamPage);
