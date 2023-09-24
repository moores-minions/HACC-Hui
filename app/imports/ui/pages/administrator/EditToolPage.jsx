import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditToolWidget from '../../components/administrator/EditToolWidget';

const EditToolPage = () => (
  <EditToolWidget />
);

export default withAllSubscriptions(EditToolPage);
