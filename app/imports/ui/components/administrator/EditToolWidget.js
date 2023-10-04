import React, { useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Tools } from '../../../api/tool/ToolCollection';
import { ROUTES } from '../../../startup/client/route-constants';

const EditToolWidget = () => {

  const [redirect, setRedirect] = useState(false);

  const documentId = useParams();
  const { doc } = useTracker(() => {
    const document = Tools.findOne(documentId);
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

    const collectionName = Tools.getCollectionName();
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

  // const { from } = { pathname: ROUTES.CONFIGURE_HACC } };
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirect) {
    return <Redirect to={ ROUTES.CONFIGURE_HACC } />;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */

  const formSchema = new SimpleSchema2Bridge(Tools.getSchema());
  return (
    <Container fluid className='edit-page' id='edit-tool-page'>
      <Col>
        <Row className='text-center'>
          <h2>Edit Tool</h2>
        </Row>
        <AutoForm schema={formSchema} onSubmit={data => submit(data)} model={doc}>
          <Container className='teamCreate'>
            <Card>
              <Card.Body>
                <TextField id='name' name='name'/>
                <LongTextField id='description' name='description' />
                <ErrorsField/>
                <SubmitField id='edit-tool-submit' value='Submit'/>
              </Card.Body>
            </Card>
          </Container>
        </AutoForm>
      </Col>
    </Container>
  );
};

export default EditToolWidget;
