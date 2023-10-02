import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Tools } from '../../../api/tool/ToolCollection';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
const ToolsAdminWidget = ({ tools }) => {
  const removeItem = (docID) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this tool!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: Tools.getCollectionName(),
              instance: Tools.getID(docID),
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Tool removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  };

    return (
      <tr>
        <td>{tools.name}</td>
        <td>{tools.description}</td>
        <td><Button id={`edit-${tools._id}`} variant="light">
          <Link to={`/edit-tool/${tools._id}`}>Edit</Link>
        </Button></td>
        <td><Button id={`del-${tools._id}`} variant="danger"
                    onClick={() => removeItem(tools._id)}>Delete</Button></td>
      </tr>
    );
};

/** Require a document to be passed to this component. */
ToolsAdminWidget.propTypes = {
  tools: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default withRouter(ToolsAdminWidget);
