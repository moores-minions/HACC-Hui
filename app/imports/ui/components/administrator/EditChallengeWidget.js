import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import SimpleSchema from 'simpl-schema';
import { useParams } from 'react-router';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';

const EditChallengeWidget = () => {

  // Document ID object of form { _id: "..." }
  const documentId = useParams();
  const schema = new SimpleSchema({
    title: String,
    description: String,
    submissionDetail: String,
    pitch: String,
  });

  const { doc } = useTracker(() => {
    const document = Challenges.findOne(documentId);
    return {
      doc: document,
    };
  });

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   */
  const submit = (data) => {
    const {
      description, submissionDetail, pitch,
    } = data;

    // Document id
    const id = documentId._id;
    const updateData = {
      id, description, submissionDetail, pitch,
    };
    const collectionName = Challenges.getCollectionName();
    updateMethod.call({ collectionName: collectionName, updateData: updateData },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item edited successfully', 'success');
        }
      });
  };

  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Container fluid className='edit-page' id='edit-challenge-page'>
      <Col>
        <Row className='text-center'>
          <h2>Edit Challenge</h2>
        </Row>
        <AutoForm schema={formSchema} onSubmit={data => submit(data)} model={doc}>
          <Container className='team-create'>
            <Card>
              <Card.Body>
                <LongTextField id='description' name='description'/>
                <TextField id='submission-detail' name='submissionDetail' />
                <TextField id='pitch' name='pitch' />
                <ErrorsField/>
                <SubmitField id='edit-challenge-submit' value='Submit'/>
              </Card.Body>
            </Card>
          </Container>
        </AutoForm>
      </Col>
    </Container>
  );
};

export default EditChallengeWidget;
