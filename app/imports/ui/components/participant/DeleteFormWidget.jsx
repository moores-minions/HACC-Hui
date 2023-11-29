import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SelectField,
} from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Participants } from '../../../api/user/ParticipantCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import {
  deleteAccountMethod,
  userInteractionDefineMethod,
} from '../../../api/user/UserInteractionCollection.methods';
import { USER_INTERACTIONS } from '../../../startup/client/user-interaction-constants';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';

const DeleteFormWidget = (props) => {
  const submit = (data) => {
    const username = props.participant.username;
    const type = USER_INTERACTIONS.DELETE_ACCOUNT;
    const typeData = [data.feedback, data.other];
    const userInteraction = {
      username,
      type,
      typeData,
    };
    userInteractionDefineMethod.call(userInteraction, (error) => (error
        ? swal('Error', error.message, 'error')
        : swal('Account deleted', 'We hope to see you again!', 'success').then(
            () => {
              // eslint-disable-next-line no-undef
              window.location = '/';
            },
          )));
    const selector = { owner: props.participant._id };
    const ownedTeams = Teams.find(selector).fetch();
    _.forEach(ownedTeams, (team) => {
      const selector2 = { teamID: team._id };
      const teamParticipants = TeamParticipants.find(selector2).fetch();
      if (teamParticipants.length === 1) {
        const instance = team._id;
        const collectionName = Teams.getCollectionName();
        removeItMethod.call({ collectionName, instance });
      } else {
        let newOwner = teamParticipants[0].participantID;
        if (newOwner === props.participant._id) {
          newOwner = teamParticipants[1].participantID;
        }
        Teams.update(team._id, { newOwner });
      }
    });
    const collectionName = Participants.getCollectionName();
    const instance = props.participant._id;
    removeItMethod.call({ collectionName, instance });
    deleteAccountMethod.call();
  };

    const reasons = [
      {
        label: 'No challenge was interesting for me',
        value: 'No challenge was interesting for me',
      },

      {
        label: 'The challenges were too hard',
        value: 'The challenges were too hard',
      },

      {
        label: "Couldn't find a team I liked being on",
        value: "Couldn't find a team I liked being on",
      },

      {
        label: 'My schedule conflicts with the HACC',
        value: 'My schedule conflicts with the HACC',
      },

      {
        label: 'Other',
        value: 'Other',
      },
    ];
    const schema = new SimpleSchema({
      feedback: {
        type: String,
        allowedValues: reasons,
        defaultValue: 'Other',
      },
      other: { type: String, required: false },
    });
    const formSchema = new SimpleSchema2Bridge(schema);

    return (
      <Container id="delete-account" className="mt-3">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h2 className="text-center">Feedback</h2>
            <AutoForm
              schema={formSchema}
              onSubmit={data => {
                swal({
                  text: 'Are you sure you want to delete your account?',
                  icon: 'warning',
                  buttons: true,
                  dangerMode: true,
                })
                    .then((willDelete) => {
                      if (willDelete) {
                        submit(data);
                      } else {
                        swal('Canceled deleting your account');
                      }
                    });
              }}>
              <Form.Group>
                <h3>
                  We&apos;re sorry to hear you&apos;re deleting your account.
                </h3>
                <h4>
                  Please provide feedback on why you&apos;re leaving to improve
                  the HACC experience for next year.
                </h4>
                <Row>
                  <Col>
                    <SelectField name="feedback" options={reasons} />
                  </Col>
                  <Col>
                    <LongTextField name="other" />
                  </Col>
                </Row>
                <Button variant="outline-danger" type="submit" className="mb-3">
                  Delete Account
                </Button>
                <ErrorsField />
              </Form.Group>
            </AutoForm>
          </Col>
        </Row>
      </Container>
    );
  };

DeleteFormWidget.propTypes = {
  participant: PropTypes.object.isRequired,
};

const DeleteFormWidgetCon = withTracker(() => {
  const userID = Meteor.userId();
  let participant;
  if (Participants.isDefined(userID)) {
    participant = Participants.findDoc({ userID: Meteor.userId() });
  } else {
    participant = {};
  }
  return {
    participant,
  };
})(DeleteFormWidget);

export default withRouter(DeleteFormWidgetCon);
