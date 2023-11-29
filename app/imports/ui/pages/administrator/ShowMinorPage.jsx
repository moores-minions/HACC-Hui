import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ManageMinorWidget from '../../components/administrator/ManageMinorWidget';

const ShowMinorPage = () => (
    <ManageMinorWidget />
);

export default withAllSubscriptions(ShowMinorPage);
