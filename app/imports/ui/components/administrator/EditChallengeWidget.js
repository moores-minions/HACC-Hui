import React, { useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Challenge } from '../../../api/challenge/ChallengeCollection';
import { ROUTES } from '../../../startup/client/route-constants';

const EditChallengeWidget = () => {

  const [redirect, setRedirect] = useState(false);

  // Document ID object of form { _id: "..." }
  const documentId = useParams();
  const { doc } = useTracker(() => {
    const document = Challenge.findOne(documentId);
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
    const collectionName = Challenge.getCollectionName();
    updateMethod.call({ collectionName: collectionName, updateData: updateData },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item edited successfully', 'success');
          setRedirect(true);
        }
      });
  };

  if (redirect) {
    return <Redirect to={ ROUTES.CONFIGURE_HACC } />;
  }

  const formSchema = new SimpleSchema2Bridge(Challenge.getSchema());
  return (
    <Container className='add-edit' id='edit-challenge-page'>
      <Row className='justify-content-center'><Col md={7} lg={5}>
        <Row className='text-center add-edit-header'>
          <h2>Edit Challenge</h2>
        </Row>
        <AutoForm schema={formSchema} onSubmit={data => submit(data)} model={doc}>
          <Container className='team-create'>
            <Card>
              <Card.Body>
                <LongTextField id='description' name='description'/>
                <TextField id='submission-detail' name='submissionDetail'/>
                <TextField id='pitch' name='pitch'/>
                <ErrorsField/>
                <Row className='text-center'>
                  <Col className='text-end'><SubmitField id='edit-challenge-submit' value='Submit'/></Col>
                  <Col className='text-start'><Button id='edit-challenge-cancel' variant='danger'
                                                      onClick={() => setRedirect(true)}>Cancel</Button></Col>
                </Row>
              </Card.Body>
            </Card>
          </Container>
        </AutoForm>
      </Col></Row>
    </Container>
  );
};

export default EditChallengeWidget;
