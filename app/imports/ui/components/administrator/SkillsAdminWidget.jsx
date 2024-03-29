import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Skills } from '../../../api/skill/SkillCollection';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
const SkillsAdminWidget = ({ skills }) => {
  const removeItem = (docID) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this skill!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
        .then((willDelete) => {
          if (willDelete) {
            removeItMethod.call({
              collectionName: Skills.getCollectionName(),
              instance: Skills.getID(docID),
            }, (error) => (error ?
                swal('Error', error.message, 'error') :
                swal('Success', 'Skill removed', 'success')));
          } else {
            swal('You canceled the deletion!');
          }
        });
  };

    return (
      <tr>
        <td>{skills.name}</td>
        <td>{skills.description}</td>
        <td><Button id={`edit-${skills._id}`} variant="light">
          <Link to={`/edit-skill/${skills._id}`}>Edit</Link>
        </Button></td>
        <td><Button id={`del-${skills._id}`} variant="danger"
                    onClick={() => removeItem(skills._id)}>Delete</Button></td>
      </tr>
    );
};

/** Require a document to be passed to this component. */
SkillsAdminWidget.propTypes = {
  skills: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default withRouter(SkillsAdminWidget);
