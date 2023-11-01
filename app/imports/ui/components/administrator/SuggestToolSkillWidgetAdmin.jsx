import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import {
  AutoForm,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import { Administrators } from '../../../api/user/AdministratorCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';

const SuggestToolSkillWidgetAdmin = () => {

  // const [redirectToReferer, setRedirectToReferer] = useState(false);
  const admin = useTracker(() => Administrators.findDoc({ userID: Meteor.userId() }));

  const buildTheFormSchema = () => {
    const schema = new SimpleSchema({
      type: { type: String, allowedValues: ['Tool', 'Skill'], optional: false },
      name: String,
      description: String,
    });
    return schema;
  };

  const submit = (data, formRef) => {
    const collectionName = Suggestions.getCollectionName();
    const newData = {};
    // const model = this.props.admin;
    newData.username = admin.username;
    newData.name = data.name;
    newData.type = data.type;
    newData.description = data.description;

    defineMethod.call({ collectionName: collectionName, definitionData: newData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Thank you for your suggestion', 'success');
            formRef.reset();
          }
        });
  };

    let fRef = null;
    const schema = buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
        <Card>
          <Card.Header className="text-center"> Add suggestion to list. </Card.Header>
          <Card.Body className="p-4">
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
              <Form.Group widths="equal">
                <SelectField name="type" options={[{ label: 'Tool', value: 'Tool' },
                  { label: 'Skill', value: 'Skill' }]} />
              </Form.Group>
              <Form.Group widths="equal">
                <TextField name="name" />
              </Form.Group>
              <Form.Group widths="equal">
                <TextField name="description" />
              </Form.Group>
              <SubmitField className="mt-3" />
            </AutoForm>
          </Card.Body>

        </Card>
    );
  };

SuggestToolSkillWidgetAdmin.propTypes = {
  admin: PropTypes.object.isRequired,
};

export default SuggestToolSkillWidgetAdmin;
