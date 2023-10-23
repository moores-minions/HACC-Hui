import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { _ } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import ListSuggestionsCard from './ListSuggestionsCard';
import ListSuggestionsFilter from './ListSuggestionsFilter';
import SuggestToolSkillWidgetAdmin from '../../components/administrator/SuggestToolSkillWidgetAdmin';

const ListSuggestionsWidget = () => {

  const suggestions = useTracker(() => Suggestions.find({}).fetch());

  const [search, setSearch] = useState('');
  const [type, setType] = useState([]);
  const [result, setResult] = useState(_.orderBy(suggestions, ['name'], ['asc']));

  // eslint-disable-next-line no-unused-vars
  function componentWillReceiveProps(nextProps) {
    if ((_.orderBy(nextProps.suggestions, ['name'], ['asc'])) !== (_.orderBy(suggestions,
      ['name'], ['asc']))) {
      setResult(_.orderBy(nextProps.suggestions, ['name'], ['asc']));
    }
  }

    if (suggestions.length === 0) {
      return (
          <Container id='no-suggestions' fluid>
            <h4 className='text-center'>
              <Icon.PeopleFill />
              {' '}
              There are no suggestions at the moment.
              <h5>
                Please check back later.
              </h5>
            </h4>
          </Container>
      );
    }

    // eslint-disable-next-line no-unused-vars
    const sortBy = [
      { key: 'teams', text: 'teams', value: 'teams' },
      { key: 'challenges', text: 'challenges', value: 'challenges' },
      { key: 'skills', text: 'skills', value: 'skills' },
      { key: 'tools', text: 'tools', value: 'tools' },
    ];

    const sticky = {
      position: '-webkit-sticky',
      // eslint-disable-next-line no-dupe-keys
      position: 'sticky',
      top: '6.5rem',
    };

    const filters = new ListSuggestionsFilter();

    const setFilters = () => {
      const searchResults = filters.filterBySearch(suggestions, search);
      const typeResults = filters.typeResults(searchResults, type);
      const sorted = filters.sortBy(typeResults, 'names');
      setResult(sorted);
    };

    useEffect(setFilters, [search, type]);

    // useEffect(() => setResult(suggestions), [result]);
    const handleSearchChange = (event) => {
      setSearch(event.target.value);
    };

    const getType = (event) => {
      setType(event.target.value);
    };

    return (
      <Container id='list-suggestions' fluid style={{ paddingBottom: '4rem' }}>
        <Row>
          <h4 className='text-center' style={{ paddingTop: '2rem' }}>
            Suggestions
          </h4>
        </Row>
        <Row>
          <Col xs={3}>
            <Card style={sticky}>
              <Card.Body>
                <h5>
                  Total Suggestions: {result.length}
                </h5>
                <div style={{ paddingTop: '2rem' }}>
                  <InputGroup>
                    <InputGroup.Text><Icon.Search/></InputGroup.Text>
                    <Form.Control id='search-filter' onChange={handleSearchChange}/>
                  </InputGroup>
                  <div style={{ paddingTop: '2rem' }}>
                    <h5>Suggestion Types</h5>
                    <Form.Control id='type-filter' as='select' onChange={getType}>
                      <option id='all' value='All'>All</option>
                      <option id='tool' value='Tool'>Tool</option>
                      <option id='skill' value='Skill'>Skill</option>
                    </Form.Control>
                  </div>
                </div>
                <div style={{ paddingTop: '2rem' }}>
                  <SuggestToolSkillWidgetAdmin/>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
              {result.map((s) => <ListSuggestionsCard
                key={s._id}
                type={s.type}
                username={s.username}
                name={s.name}
                description={s.description}
                suggestionObj={s}
              />)}
          </Col>
        </Row>
      </Container>
    );
};

export default ListSuggestionsWidget;
