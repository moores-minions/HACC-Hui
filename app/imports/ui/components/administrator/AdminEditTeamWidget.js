import React from 'react';
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
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */

const schema = new SimpleSchema({
  name: String,
  description: String,
  gitHubRepo: String,
});

class AdminEditTeamWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirectToReferer: false };
  }

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(data) {

    const {
      name, description, gitHubRepo,
    } = data;

    const updateData = {};
    updateData.id = data._id;
    updateData.name = name;
    updateData.description = description;
    updateData.gitHubRepo = gitHubRepo;

    const collectionName = Teams.getCollectionName();
    console.log(updateData);
    console.log(collectionName);
    updateMethod.call({ collectionName, updateData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Item edited successfully', 'success');
          }
        });
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  render() {
    const formSchema = new SimpleSchema2Bridge(schema);
    const memberNamesAndGitHub = _.map(this.props.members, (p) => {
      const fullName = Participants.getFullName(p._id);
      const gitHub = p.gitHub;
      return `${fullName}, (${gitHub})`;
    });
    return (
        <Container>
          <Card>
            <div style={{
              backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
              borderRadius: '2rem',
            }}>
              <h2 textAlign="center">Edit Team</h2>
            </div>
            <AutoForm schema={formSchema} onSubmit={data => this.submit(data)} model={this.props.team}
                      style={{
                        paddingBottom: '4rem',
                      }}>
              <Card.Body style={{
                borderRadius: '1rem',
                backgroundColor: '#E5F0FE',
              }} className={'teamCreate'}>
                <Card container centered>
                  <Card.Body style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                    <TextField name='name' disabled />
                    <LongTextField name='description' required/>
                    <h4>Team Members:</h4>
                    <ListGroup>
                      {memberNamesAndGitHub.map((n) => <ListGroup.Item key={n}>{n}</ListGroup.Item>)}
                    </ListGroup>
                    <TextField name='gitHubRepo' required/>
                  </Card.Body>
                </Card>
                <div align='center'>
                  <SubmitField value='Submit'
                               style={{
                                 color: 'white', backgroundColor: '#dd000a',
                                 margin: '2rem 0rem',
                               }}/>
                </div>
                <ErrorsField/>
              </Card.Body>
            </AutoForm>
          </Card>
        </Container>
    );
  }
}

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
