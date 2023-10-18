import React from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';

const ListSuggestionsCard = ({ type, username, name, description, suggestionObj }) => {

  const removeItem = () => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this suggestion!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: Suggestions.getCollectionName(),
              instance: suggestionObj._id,
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Suggestion removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  };

  const addSuggestion = (addType, addName, addDesc, instance) => {
    let collectionName;
    if (addType.toLowerCase() === 'skill') {
      collectionName = Skills.getCollectionName();
    } else if (addType.toLowerCase() === 'tool') {
      collectionName = Tools.getCollectionName();
    } else {
      swal('Error', 'Undefined type of suggestion', 'error');
      return false;
    }
    const definitionData = {
      name: addName,
      description: addDesc,
    };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        swal('Error defining', error.message, 'error');
      } else {
        collectionName = Suggestions.getCollectionName();
        removeItMethod.call({ collectionName, instance }, (err) => {
          if (err) {
            swal('Error removing', err.message, 'error');
          } else {
            swal('Success', `${addType} added`, 'success');
          }
        });
      }
    });
    return true;
  };

  return (
    <Card id={`${type}-${name}`}
        style={{ padding: '0rem 2rem 2rem 2rem' }}>
      <Card.Body>
        <Container>
          <h5 style={{ color: '#263763', paddingTop: '2rem' }}>
            {name}
          </h5>
            <p style={{ color: '#9e9e9e' }}> {type} </p>
            <p> {description} </p>
            <p> Suggested By: {username} </p>
            <Button id={`del-${suggestionObj._id}`} variant='danger' onClick={removeItem}>Delete</Button>
            <Button id={`add-${suggestionObj._id}`} variant='success' onClick={() => addSuggestion(type,
              name, description, suggestionObj._id)}>Add Suggestion</Button>
        </Container>
      </Card.Body>
    </Card>
  );
};

ListSuggestionsCard.propTypes = {
  type: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  suggestionObj: PropTypes.object.isRequired,
};

export default ListSuggestionsCard;
