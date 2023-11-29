import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Form, Container, Row, Col, Card, Button } from 'react-bootstrap';
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
} from 'uniforms-bootstrap5';
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
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROUTES } from '../../../startup/client/route-constants';

const EditProfileWidget = () => {

  const {
    allChallenges, allSkills, allTools, participant,
    devChallenges, devSkills, devTools,
  } = useTracker(() => {
    const getParticipant = Participants.findDoc({ userID: Meteor.userId() });
    const participantID = getParticipant._id;
    return {
      allChallenges: Challenges.find({}).fetch(),
      allSkills: Skills.find({}).fetch(),
      allTools: Tools.find({}).fetch(),
      participant: getParticipant,
      devChallenges: ParticipantChallenges.find({ participantID }).fetch(),
      devSkills: ParticipantSkills.find({ participantID }).fetch(),
      devTools: ParticipantTools.find({ participantID }).fetch(),
    };
  });

  const [redirectToReferer, setRedirectToReferer] = useState(false);

  const challengeNames = _.map(allChallenges, (c) => c.title);
  const skillNames = _.map(allSkills, (s) => s.name);
  const toolNames = _.map(allTools, (t) => t.name);
  const buildTheFormSchema = () => {
    const schema = new SimpleSchema({
      firstName: String,
      lastName: String,
      username: String,
      demographicLevel: { type: String, optional: true },
      linkedIn: { type: String, label: 'LinkedIn', optional: true },
      gitHub: { type: String, label: 'GitHub', optional: true },
      slackUsername: { type: String, optional: true },
      website: { type: String, optional: true },
      aboutMe: { type: String, optional: true },
      userID: { type: SimpleSchema.RegEx.Id, optional: true },
      lookingForTeam: { type: Boolean, optional: true },
      isCompliant: { type: Boolean, optional: true },
      challenges: { type: Array, optional: true },
      'challenges.$': { type: String },
      skills: { type: Array, optional: true },
      'skills.$': { type: String },
      tools: { type: Array, optional: true },
      'tools.$': { type: String },
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
    return <Redirect to={from}/>;
  }
  const model = buildTheModel();
  const schema = buildTheFormSchema();
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Container id='editprofile-page' style={{ paddingBottom: '50px' }}>
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
                    <TextField name="username" disabled className="form-control"/>
                  </Col>
                  <Col xs={5} sm={3}>
                    <BoolField name="isCompliant" disabled className="form-control"/>
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Col sm={4}>
                    <TextField id='first-name' name="firstName" className="form-control"/>
                  </Col>
                  <Col sm={4}>
                    <TextField id='last-name' name="lastName" className="form-control"/>
                  </Col>
                  <Col sm={4}>
                    <SelectField id='demographic-level' name="demographicLevel" className="form-control"
                                 options={demographicLevels.map((val) => ({ label: val, value: val }))}/>
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Col xs={6} sm={3}><TextField id='linked-in' name="linkedIn" className="form-control"/></Col>
                  <Col xs={6} sm={3}><TextField id='github' name="gitHub" className="form-control"/></Col>
                  <Col xs={6} sm={3}><TextField id='slack-username' name="slackUsername"
                                                className="form-control"/></Col>
                  <Col xs={6} sm={3}><TextField id='website' name="website" className="form-control"/></Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <LongTextField id='about-me' name="aboutMe" className="form-control"/>
                </Form.Group>
                <Form.Group as={Row}>
                  <Col sm={4}><SelectField id='challenges' name="challenges" multiple
                                           options={challengeNames.map((val) => ({ label: val, value: val }))}/></Col>
                  <Col sm={4}><SelectField id='skills' name="skills" multiple
                                           options={skillNames.map((val) => ({ label: val, value: val }))}/></Col>
                  <Col sm={4}><SelectField id='tools' name="tools" multiple
                                           options={toolNames.map((val) => ({ label: val, value: val }))}/></Col>
                </Form.Group>
                <ErrorsField/>
                <Row className='text-center-center'>
                  <Col className='text-end'>
                    <Button id="edit-profile-submit" type="submit" variant='success'>Submit</Button>
                  </Col>
                  <Col className='text-start'>
                    <Button id='edit-profile-cancel' variant='danger'
                             onClick={() => setRedirectToReferer(true)}>Cancel</Button>
                  </Col>
                </Row>
              </AutoForm>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfileWidget;
