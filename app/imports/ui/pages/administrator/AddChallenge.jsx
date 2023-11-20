import React, { useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ROUTES } from '../../../startup/client/route-constants';

/**
 * Renders the Page for adding a challenge.
 * @memberOf ui/pages
 */
const AddChallenge = () => {

  const [redirect, setRedirect] = useState(false);

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
          setRedirect(true);
        }
      });
  };

  if (redirect) {
    return <Redirect to={ROUTES.CONFIGURE_HACC} />;
  }

  let fRef = null;
  const formSchema = new SimpleSchema2Bridge(schema);

  return (
    <Container className='add-edit' fluid id='add-challenge-page'>
      <Col>
        <Row className='text-center add-edit-header'>
          <h2>Add a Challenge</h2>
        </Row>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
          <Container>
            <Card>
              <Card.Body>
                <TextField id='title' name='title'/>
                <LongTextField id='description' name='description'/>
                <TextField id='submission-detail' name='submissionDetail'/>
                <TextField id='pitch' name='pitch'/>
                <ErrorsField/>
                <Row className='text-center'>
                  <Col className='text-end'><SubmitField id='add-challenge-submit' value='Submit'/></Col>
                  <Col className='text-start'><Button id='add-challenge-cancel' variant='danger'
                                                      onClick={() => setRedirect(true)}>Cancel</Button></Col>
                </Row>
              </Card.Body>
            </Card>
          </Container>
        </AutoForm>
      </Col>
    </Container>
  );
};

export default AddChallenge;
