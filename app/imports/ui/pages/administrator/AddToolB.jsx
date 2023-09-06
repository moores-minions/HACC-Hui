import React from 'react';
import { Card, Col, Container } from 'react-bootstrap';
import swal from 'sweetalert';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Tools } from '../../../api/tool/ToolCollection';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
const AddToolB = () => {
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
    // console.log(collectionName);
    defineMethod.call({ collectionName, definitionData },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
          console.error(error.message);
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
          // console.log('Success');
        }
      });
  };

  let fRef = null;
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Container fluid>
      <Col>
        <h2 style={{ textAlign: 'center' }}>Add a Tool</h2>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
          <Container>
            <Card>
              <Card.Body>
                <TextField name='name'/>
                <TextField name='description'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Card.Body>
            </Card>
          </Container>
        </AutoForm>
      </Col>
    </Container>
  );
};

export default AddToolB;
