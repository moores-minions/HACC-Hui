import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditSkillWidget from '../../components/administrator/EditSkillWidget';

const EditSkillPage = () => (
  <EditSkillWidget />
);

export default withAllSubscriptions(EditSkillPage);
