import React, { useState } from 'react';
import { Card, Container, ListGroup } from 'react-bootstrap';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
} from 'uniforms-bootstrap5';
import _ from 'lodash';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import SimpleSchema from 'simpl-schema';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { ROUTES } from '../../../startup/client/route-constants';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */

const schema = new SimpleSchema({
  name: String,
  description: String,
  gitHubRepo: String,
});

const AdminEditTeamWidget = (props) => {
  const [redirect, setRedirect] = useState(false);

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  const submit = (data) => {

    const {
      name, description, gitHubRepo, _id,
    } = data;

    const updateData = {
      id: _id,
      name,
      description,
      gitHubRepo,
    };

    const collectionName = Teams.getCollectionName();
    updateMethod.call({ collectionName, updateData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Item edited successfully', 'success');
            setRedirect(true);

          }
        });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms

    const formSchema = new SimpleSchema2Bridge(schema);
    const memberNamesAndGitHub = _.map(props.members, (p) => {
      const fullName = Participants.getFullName(p._id);
      const gitHub = p.gitHub;
      return `${fullName}, (${gitHub})`;
    });
  if (redirect) {
    return <Redirect to={ROUTES.VIEW_TEAMS}/>;
  }

    return (
        <Container>
            <div style={{
              backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
              borderRadius: '2rem',
            }}>
              <h2 className='text-center'>Edit Team</h2>
            </div>
            <AutoForm schema={formSchema} onSubmit={data => submit(data)} model={props.team}
                      style={{
                        paddingBottom: '4rem',
                      }}>
              <Card style={{
                borderRadius: '1rem',
                backgroundColor: '#E5F0FE',
              }} className={'teamCreate'}>
                  <Card.Body style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                    <TextField name='name' disabled />
                    <LongTextField name='description' required/>
                    <h4>Team Members:</h4>
                    <ListGroup>
                      {memberNamesAndGitHub.map((n) => <ListGroup.Item key={n}>{n}</ListGroup.Item>)}
                    </ListGroup>
                    <TextField name='gitHubRepo' required/>
                  </Card.Body>
                <div style="text-align: center;">
                  <SubmitField value='Submit'
                               style={{
                                 color: 'white',
                                 margin: '2rem 0rem',
                               }}/>
                </div>
                <ErrorsField/>
              </Card>
            </AutoForm>
        </Container>
    );
};

AdminEditTeamWidget.propTypes = {
  team: PropTypes.object,
  members: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  model: PropTypes.object,
};

const AdminEditTeamCon = withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const team = Teams.findDoc(documentId);
  const members = _.map(TeamParticipants.find({ teamID: team._id }).fetch(),
      (tp) => Participants.findDoc(tp.participantID));
  return {
    team,
    members,
  };
})(AdminEditTeamWidget);

export default withRouter(AdminEditTeamCon);
