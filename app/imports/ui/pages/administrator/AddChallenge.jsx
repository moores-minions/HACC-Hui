import React from 'react';
import { Card, Col, Container } from 'react-bootstrap';
import swal from 'sweetalert';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';

/**
 * Renders the Page for adding a challenge.
 * @memberOf ui/pages
 */
const AddChallenge = () => {
  // Create a schema to specify the structure of the data to appear in the form.
  const schema = new SimpleSchema({
    title: String,
    description: String,
    submissionDetail: String,
    pitch: String,
  });

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  const submit = (data, formRef) => {
    const { title, description, submissionDetail, pitch } = data;
    const definitionData = { title, description, submissionDetail, pitch };
    const collectionName = Challenges.getCollectionName();
    defineMethod.call({ collectionName: collectionName, definitionData: definitionData },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      });
  };

  let fRef = null;
  const formSchema = new SimpleSchema2Bridge(schema);

  return (
    <Container fluid id='add-challenge-page'>
      <Col>
        <h2 style={{ textAlign: 'center' }}>Add a Challenge</h2>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
          <Container>
            <Card>
              <Card.Body>
                <TextField id='title' name='title'/>
                <TextField id='description' name='description'/>
                <TextField id='submissionDetail' name='submissionDetail'/>
                <TextField id='pitch' name='pitch'/>
                <SubmitField id='add-challenge-submit' value='Submit'/>
                <ErrorsField/>
              </Card.Body>
            </Card>
          </Container>
        </AutoForm>
      </Col>
    </Container>
  );
};

export default AddChallenge;
