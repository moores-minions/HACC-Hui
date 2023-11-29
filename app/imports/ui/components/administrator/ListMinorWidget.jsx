import React from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
const ListMinorWidget = (props) => {
  const removeItem = (docID) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this participant!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: MinorParticipants.getCollectionName(),
              instance: MinorParticipants.getID(docID),
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Participant removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  };

    return (
        <Table.Row>
          <Table.Cell width={2}>{props.minorParticipants.username}</Table.Cell>
          <Table.Cell width={5}>{props.minorParticipants.parentFirstName}</Table.Cell>
          <Table.Cell width={5}>{props.minorParticipants.parentLastName}</Table.Cell>
          <Table.Cell width={5}>{props.minorParticipants.parentEmail}</Table.Cell>
          {/* eslint-disable-next-line max-len */}
          <Table.Cell width={2}><Button><Link to={`/edit-challenge/${props.minorParticipants._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button></Table.Cell>
          {/* eslint-disable-next-line max-len */}
          <Table.Cell width={2}><Button negative onClick={() => removeItem(props.minorParticipants._id)}>Delete</Button></Table.Cell>
        </Table.Row>
    );
};

/** Require a document to be passed to this component. */
ListMinorWidget.propTypes = {
  minorParticipants: PropTypes.object.isRequired,
};

export default ListMinorWidget;
