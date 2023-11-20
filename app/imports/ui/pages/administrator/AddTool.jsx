import React, { useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Tools } from '../../../api/tool/ToolCollection';
import { ROUTES } from '../../../startup/client/route-constants';

/**
 * Renders the Page for adding a tool. **deprecated**
 * @memberOf ui/pages
 */
const AddTool = () => {

  const [redirect, setRedirect] = useState(false);

  // Create a schema to specify the structure of the data to appear in the form.
  const schema = new SimpleSchema({
    name: String,
    description: String,
  });

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  const submit = (data, formRef) => {
    const { name, description } = data;
    const definitionData = { name, description };
    const collectionName = Tools.getCollectionName();
    defineMethod.call({ collectionName, definitionData },
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
    return <Redirect to={ROUTES.CONFIGURE_HACC}/>;
  }

  let fRef = null;
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Container className='add-edit' fluid id='add-tool-page'>
      <Col>
        <Row className='text-center add-edit-header'>
          <h2 style={{ textAlign: 'center' }}>Add a Tool</h2>
        </Row>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
          <Container>
            <Card>
              <Card.Body>
                <TextField id='name' name='name'/>
                <TextField id='description' name='description'/>
                <ErrorsField/>
                <Row className='text-center'>
                  <Col className='text-end'><SubmitField id='add-tool-submit' value='Submit'/></Col>
                  <Col className='text-start'><Button id='add-tool-cancel' variant='danger'
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

export default AddTool;
