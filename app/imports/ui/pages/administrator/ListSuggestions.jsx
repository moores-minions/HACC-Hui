import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListSuggestionsWidget from '../../components/administrator/ListSuggestionsWidget';

const ListSuggestions = () => (
  <ListSuggestionsWidget />
);

export default withAllSubscriptions(ListSuggestions);
