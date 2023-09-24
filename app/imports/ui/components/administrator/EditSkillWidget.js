import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { useParams } from 'react-router';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Skills } from '../../../api/skill/SkillCollection';

const EditSkillWidget = () => {

  const documentId = useParams();
  const { doc } = useTracker(() => {
    const document = Skills.findOne(documentId);
    return {
      doc: document,
    };
  });

    /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  const submit = (data) => {
    const {
      name, description,
    } = data;

    const id = documentId._id;

    const updateData = {
      id, name, description,
    };

    const collectionName = Skills.getCollectionName();
    updateMethod.call({ collectionName: collectionName, updateData: updateData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Item edited successfully', 'success');
          }
        });
  };

  const formSchema = new SimpleSchema2Bridge(Skills.getSchema());
  return (
    <Container fluid className='edit-page' id='edit-skill-page'>
      <Col>
        <Row className='text-center'>
          <h2>Edit Skill</h2>
        </Row>
        <AutoForm schema={formSchema} onSubmit={data => submit(data)} model={doc}>
          <Container className='team-create'>
            <Card>
              <Card.Body>
                <TextField id='name' name='name'/>
                <LongTextField id='description' name='description'/>
                <ErrorsField/>
                <SubmitField id='edit-skill-submit' value='Submit'/>
              </Card.Body>
            </Card>
          </Container>
        </AutoForm>
      </Col>
    </Container>
  );
};

export default EditSkillWidget;
