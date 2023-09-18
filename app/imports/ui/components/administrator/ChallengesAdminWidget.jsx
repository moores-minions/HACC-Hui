import React from 'react';
// import { Button, Table } from 'semantic-ui-react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
class ChallengesAdminWidget extends React.Component {
  removeItem(docID) {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this challenge!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: Challenges.getCollectionName(),
              instance: Challenges.getID(docID),
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Challenge removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  }

  render() {
    return (
      <tr>
        <td>{this.props.challenges.title}</td>
        <td>{this.props.challenges.description}</td>
        <td>{this.props.challenges.submissionDetail}</td>
        <td>{this.props.challenges.pitch}</td>
        <td><Button variant="light"><Link to={`/edit-challenge/${this.props.challenges._id}`}>Edit</Link></Button></td>
        <td><Button variant="danger" onClick={() => this.removeItem(this.props.challenges._id)}>Delete</Button></td>
      </tr>
        // <Table.Row>
        //   <Table.Cell width={2}>{this.props.challenges.title}</Table.Cell>
        //   <Table.Cell width={5}>{this.props.challenges.description}</Table.Cell>
        //   <Table.Cell width={2}>{this.props.challenges.submissionDetail}</Table.Cell>
        //   <Table.Cell width={2}>{this.props.challenges.pitch}</Table.Cell>
        //   {/* eslint-disable-next-line max-len */}
      // eslint-disable-next-line max-len
        //   <Table.Cell width={2}><Button><Link to={`/edit-challenge/${this.props.challenges._id}`} style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Edit</Link></Button></Table.Cell>
        //   {/* eslint-disable-next-line max-len */}
      // eslint-disable-next-line max-len
        //   <Table.Cell width={2}><Button negative onClick={() => this.removeItem(this.props.challenges._id)}>Delete</Button></Table.Cell>
        // </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
ChallengesAdminWidget.propTypes = {
  challenges: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default ChallengesAdminWidget;
