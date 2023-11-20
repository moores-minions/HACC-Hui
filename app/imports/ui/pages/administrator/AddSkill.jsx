import React, { useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Skills } from '../../../api/skill/SkillCollection';
import { ROUTES } from '../../../startup/client/route-constants';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  name: String,
  description: String,
});

const formSchema = new SimpleSchema2Bridge(schema);

const AddSkill = () => {

  const [redirect, setRedirect] = useState(false);

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { name, description } = data;
    const definitionData = { name, description };
    const collectionName = Skills.getCollectionName();
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

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container className="add-edit" fluid id="add-skill-page">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Row className="text-center add-edit-header">
            <h2>Add a skill</h2>
          </Row>
          <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <TextField name="name" id="name" />
                <TextField name="description" id="description" />
                <ErrorsField />
                <Row className='text-center'>
                  <Col className='text-end'><SubmitField id='add-skill-submit' value='Submit'/></Col>
                  <Col className='text-start'><Button id='add-skill-cancel' variant='danger'
                                                      onClick={() => setRedirect(true)}>Cancel</Button></Col>
                </Row>
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default AddSkill;
