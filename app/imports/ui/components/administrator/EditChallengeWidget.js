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

  SimpleSchema.debug = true;
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

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Container style={{ paddingBottom: '50px' }}>
      <Col>
        <Row style={{
          backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
          borderRadius: '2rem',
        }}>
          <h2>Edit Challenge</h2>
        </Row>
        <AutoForm schema={formSchema} onSubmit={data => submit(data)} model={doc}
                  style={{
                    paddingBottom: '4rem',
                  }}>
          <Container className='team-create'>
            <Card>
              <Card.Body style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
                <LongTextField name='description'/>
                <TextField name='submissionDetail' />
                <TextField name='pitch' />
                <SubmitField value='Submit'/>
              </Card.Body>
            </Card>
            <ErrorsField/>
          </Container>
        </AutoForm>
      </Col>
    </Container>
  );
};

export default EditChallengeWidget;
