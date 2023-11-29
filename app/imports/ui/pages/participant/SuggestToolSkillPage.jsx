import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import SuggestToolSkillWidget from '../../components/participant/SuggestToolSkillWidget';

const SuggestToolSkillPage = () => (
    <SuggestToolSkillWidget />
);

export default withAllSubscriptions(SuggestToolSkillPage);
