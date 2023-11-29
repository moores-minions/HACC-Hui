import React, { useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
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
import { Redirect } from 'react-router-dom';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import { paleBlueStyle } from '../../styles';
import { ROUTES } from '../../../startup/client/route-constants';

const SuggestToolSkillWidget = (props) => {

  const [redirect, setRedirect] = useState(false);

  const buildTheFormSchema = () => {
    const schema = new SimpleSchema({
      type: {
        type: String,
        allowedValues: ['Tool', 'Skill'],
        optional: false },
      name: String,
      description: String,
    });
    return schema;
  };

  const submit = (data, formRef) => {
    const collectionName = Suggestions.getCollectionName();
    const newData = {};
    const model = props.participant;
    newData.username = model.username;
    newData.name = data.name;
    newData.type = data.type;
    newData.description = data.description;

    defineMethod.call({ collectionName: collectionName, definitionData: newData },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Thank you for your suggestion', 'success');
          setRedirect(true);
          formRef.reset();
        }
      });
  };

  if (redirect) {
    return <Redirect to={ROUTES.SUGGEST_TOOL_SKILL}/>;
  }

    let fRef = null;
    const model = props.participant;
    const schema = buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);

    const firstname = model.firstName;
    return (
      <Container id="suggest-tool-skill" style={{ paddingBottom: '50px', paddingTop: '40px' }}>
        <Card style = { paleBlueStyle }>
          <Card.Header as="h2" className="text-center">
            Hello {firstname}, please fill out the form to suggest a new tool or skill.
          </Card.Header>
          <Card.Body>
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
              <Row>
                <Col><SelectField name="type"
                                  options={[{ label: 'Tool', value: 'Tool' },
                                    { label: 'Skill', value: 'Skill' }]} /></Col>
                <Col><TextField name="name" /></Col>
                <Col><TextField name="description" /></Col>
                <SubmitField className="text-center" value='Submit'/>
              </Row>
            </AutoForm>
          </Card.Body>
        </Card>
      </Container>
    );
};

SuggestToolSkillWidget.propTypes = {
  participant: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  return {
    participant,
  };
})(SuggestToolSkillWidget);
