import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Alert, Container, Form, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { AutoForm, BoolField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import { ROUTES } from '../../../startup/client/route-constants';
import { Participants } from '../../../api/user/ParticipantCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { userInteractionDefineMethod } from '../../../api/user/UserInteractionCollection.methods';
import { USER_INTERACTIONS } from '../../../startup/client/user-interaction-constants';
import { darkerBlueStyle } from '../../styles';

const schema = new SimpleSchema({
  lastName: String,
  firstName: String,
  agree: { type: Boolean, optional: false },
});

/**
 * A simple static component to render some text for the HACC Participation form page.
 * @memberOf ui/pages
 */
const ParticipationForm = () => {

  const [redirect, setRedirect] = useState(false);

  const submit = (formData) => {
    const { firstName, lastName, agree } = formData;
    if (agree) {
      const dev = Participants.findDoc({ userID: Meteor.userId() });
      const collectionName = Participants.getCollectionName();
      const updateData = {
        id: dev._id,
        isCompliant: agree,
      };
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          swal('Error', error.message, 'Could not update Participant');
        }
      });
      const interactionData = {
        username: dev.username,
        type: USER_INTERACTIONS.SIGNED_CONSENT,
        typeData: [firstName, lastName],
      };
      userInteractionDefineMethod.call(interactionData, (error) => {
        if (error) {
          swal('Error', error.message, 'Could not define user interaction');
        }
      });
      setRedirect(true);
    }
  };

    const formSchema = new SimpleSchema2Bridge(schema);
    if (redirect) {
      return <Redirect to={ROUTES.CREATE_PROFILE}/>;
    }
    return (
        <Container style={darkerBlueStyle}>
          <h2 className='text-center mt-3'>HACC Registration</h2>
          <AutoForm schema={formSchema} onSubmit={data => submit(data)}>
              <Alert className='text-center'>
                <Alert.Heading>
                  Read the <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>.
                  <br />
                  Then agree to the terms.
                </Alert.Heading>
              </Alert>
                <Form.Group widths="equal">
                  <Row>
                    <Col xs={6}><TextField name="firstName" /></Col>
                    <Col xs={6}><TextField name="lastName" /></Col>
                  </Row>
                </Form.Group>
                <BoolField name="agree" label="I have read the rules and agree to the terms" />
                <SubmitField />
            </AutoForm>
        </Container>
    );
};

export default ParticipationForm;
