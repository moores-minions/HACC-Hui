import React from 'react';
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
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import { paleBlueStyle } from '../../styles';

class SuggestToolSkillWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirectToReferer: false };
  }

  buildTheFormSchema() {
    const schema = new SimpleSchema({
      type: {
        type: String,
        allowedValues: ['Tool', 'Skill'],
        optional: false },
      name: String,
      description: String,
    });
    return schema;
  }

  submit(data, formRef) {
    // console.log('CreateProfileWidget.submit', data);
    const collectionName = Suggestions.getCollectionName();
    const newData = {};
    const model = this.props.participant;
    newData.username = model.username;
    newData.name = data.name;
    newData.type = data.type;
    newData.description = data.description;
    console.log(newData);

    defineMethod.call({ collectionName: collectionName, definitionData: newData },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Thank you for your suggestion', 'success');
          formRef.reset();
        }
      });
  }

  render() {
    let fRef = null;
    const model = this.props.participant;
    const schema = this.buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    console.log(schema);

    const firstname = model.firstName;
    console.log(formSchema);
    return (
      <Container id="suggest-tool-skill" style={{ paddingBottom: '50px', paddingTop: '40px' }}>
        <Card style = { paleBlueStyle }>
          <Card.Header as="h2" className="text-center">
            Hello {firstname}, please fill out the form to suggest a new tool or skill.
          </Card.Header>
          <Card.Body>
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
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
  }
}

SuggestToolSkillWidget.propTypes = {
  participant: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  return {
    participant,
  };
})(SuggestToolSkillWidget);
