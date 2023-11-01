import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Form, Container, Row, Col, Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  BoolField,
  ErrorsField,
  LongTextField,
  SelectField,
  TextField,
} from 'uniforms-semantic';
import Swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { demographicLevels } from '../../../api/level/Levels';
import MultiSelectField from '../form-fields/MultiSelectField';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROUTES } from '../../../startup/client/route-constants';

const EditProfileWidget = () => {

    const allChallenges = useTracker(() => Challenges.find({}).fetch());
    const allSkills = useTracker(() => Skills.find({}).fetch());
    const allTools = useTracker(() => Tools.find({}).fetch());
    const participant = useTracker(() => Participants.findDoc({ userID: Meteor.userId() }));
    const participantID = participant._id;
    const devChallenges = useTracker(() => ParticipantChallenges.find({ participantID }).fetch());
    const devSkills = useTracker(() => ParticipantSkills.find({ participantID }).fetch());
    const devTools = useTracker(() => ParticipantTools.find({ participantID }).fetch());

  const [redirectToReferer, setRedirectToReferer] = useState(false);
  // const newSkillRef = React.createRef();
  // const newSkillLevelRef = React.createRef();
  // const newToolRef = React.createRef();
  // const newToolLevelRef = React.createRef();

    // constructor(props) {
    // super(props);
    // this.state = { redirectToReferer: false };
    // this.newSkillRef = React.createRef();
    // this.newSkillLevelRef = React.createRef();
    // this.newToolRef = React.createRef();
    // this.newToolLevelRef = React.createRef();
  // }

  const buildTheFormSchema = () => {
    const challengeNames = _.map(allChallenges, (c) => c.title);
    const skillNames = _.map(allSkills, (s) => s.name);
    const toolNames = _.map(allTools, (t) => t.name);
    const schema = new SimpleSchema({
      firstName: String,
      lastName: String,
      username: String,
      demographicLevel: { type: String, allowedValues: demographicLevels, optional: true },
      linkedIn: { type: String, optional: true },
      gitHub: { type: String, optional: true },
      slackUsername: { type: String, optional: true },
      website: { type: String, optional: true },
      aboutMe: { type: String, optional: true },
      userID: { type: SimpleSchema.RegEx.Id, optional: true },
      lookingForTeam: { type: Boolean, optional: true },
      isCompliant: { type: Boolean, optional: true },
      challenges: { type: Array, optional: true },
      'challenges.$': { type: String, allowedValues: challengeNames },
      skills: { type: Array, optional: true },
      'skills.$': { type: String, allowedValues: skillNames },
      tools: { type: Array, optional: true },
      'tools.$': { type: String, allowedValues: toolNames },
    });
    return schema;
  };

  const buildTheModel = () => {
    const model = participant;
    model.challenges = _.map(devChallenges, (challenge) => {
      const c = Challenges.findDoc(challenge.challengeID);
      return c.title;
    });
    model.skills = _.map(devSkills, (skill) => {
      const s = Skills.findDoc(skill.skillID);
      return s.name;
    });
    model.tools = _.map(devTools, (tool) => {
      const t = Tools.findDoc(tool.toolID);
      return t.name;
    });
    return model;
  };

  const submitData = (data) => {
    const collectionName = Participants.getCollectionName();
    const updateData = {};
    updateData.id = data._id;
    updateData.firstName = data.firstName;
    updateData.lastName = data.lastName;
    if (data.demographicLevel) {
      updateData.demographicLevel = data.demographicLevel;
    }
    if (data.challenges) {
      // build an array of challenge slugs
      updateData.challenges = data.challenges.map((title) => {
        const doc = Challenges.findDoc({ title });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.skills) {
      updateData.skills = data.skills.map((name) => {
        const doc = Skills.findDoc({ name });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.tools) {
      updateData.tools = data.tools.map((name) => {
        const doc = Tools.findDoc({ name });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.linkedIn) {
      updateData.linkedIn = data.linkedIn;
    }
    if (data.gitHub) {
      updateData.gitHub = data.gitHub;
    }
    if (data.slackUsername) {
      updateData.slackUsername = data.slackUsername;
    }
    if (data.website) {
      updateData.website = data.website;
    }
    if (data.aboutMe) {
      updateData.aboutMe = data.aboutMe;
    }
    updateData.editedProfile = true;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      } else {
        Swal.fire({
          icon: 'success',
          text: 'Your profile is updated.',
        });
      }
    });
    setRedirectToReferer(true);
  };

    if (redirectToReferer) {
      const from = { pathname: ROUTES.YOUR_PROFILE };
      return <Redirect to={from} />;
    }
    const model = buildTheModel();
    const schema = buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
      <Container style={{ paddingBottom: '50px' }}>
        <Row className="justify-content-center">
          <Col>
            <Card className="text-center" style={{
              backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
              borderRadius: '2rem',
            }}>
              <Card.Header as="h2">Edit Profile</Card.Header>
              <Card.Body>
                <AutoForm schema={formSchema} model={model} onSubmit={data => {
                  submitData(data);
                }}>
                  <Form.Group as={Row}>
                    <Col>
                      <TextField name="username" disabled className="form-control" />
                    </Col>
                    <Col>
                      <BoolField name="isCompliant" disabled className="form-control" />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Col><TextField name="firstName" className="form-control" /></Col>
                    <Col><TextField name="lastName" className="form-control" /></Col>
                    <Col><SelectField name="demographicLevel" className="form-control" /></Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Col><TextField name="linkedIn" className="form-control" /></Col>
                    <Col><TextField name="gitHub" className="form-control" /></Col>
                    <Col><TextField name="slackUsername" className="form-control" /></Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Col><TextField name="website" className="form-control" /></Col>
                    <Col><LongTextField name="aboutMe" className="form-control" /></Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Col><MultiSelectField name="challenges" /></Col>
                    <Col><MultiSelectField name="skills" /></Col>
                    <Col><MultiSelectField name="tools" /></Col>
                  </Form.Group>
                  <Button type="submit" style={{
                    color: 'white', backgroundColor: '#DB2828',
                    margin: '2rem 0rem',
                  }}>Submit</Button>
                  <ErrorsField />
                </AutoForm>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  };

EditProfileWidget.propTypes = {
  allChallenges: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  allSkills: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  allTools: PropTypes.arrayOf(
      PropTypes.object,
  ).isRequired,
  participant: PropTypes.object.isRequired,
  devChallenges: PropTypes.arrayOf(
      PropTypes.object,
  ),
  devSkills: PropTypes.arrayOf(
      PropTypes.object,
  ),
  devTools: PropTypes.arrayOf(
      PropTypes.object,
  ),
};
export default EditProfileWidget;
