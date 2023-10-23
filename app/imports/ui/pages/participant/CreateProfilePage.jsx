import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import CreateProfileWidget from '../../components/participant/CreateProfileWidget';

const CreateProfilePage = () => (
  <CreateProfileWidget />
);

export default withAllSubscriptions(CreateProfilePage);
