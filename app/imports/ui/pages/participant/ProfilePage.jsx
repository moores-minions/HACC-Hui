import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ProfileWidget from '../../components/participant/ProfileWidget';

const ProfilePage = () => <ProfileWidget />;

export default withAllSubscriptions(ProfilePage);
