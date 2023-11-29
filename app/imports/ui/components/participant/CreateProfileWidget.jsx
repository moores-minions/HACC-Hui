import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import {
  AutoForm, BoolField, ErrorsField,
  LongTextField, SelectField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';
import { Skills } from '../../../api/skill/SkillCollection';
import { Challenge } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { demographicLevels } from '../../../api/level/Levels';
import { ROUTES } from '../../../startup/client/route-constants';
import { Slugs } from '../../../api/slug/SlugCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

const CreateProfileWidget = () => {

  const [redirect, setRedirect] = useState(false);

  const { participant, challenges, skills, tools } = useTracker(() => {
      const getParticipant = Participants.findDoc({ userID: Meteor.userId() });
      const getChallenges = Challenge.find({}).fetch();
      const getSkills = Skills.find({}).fetch();
      const getTools = Tools.find({}).fetch();
      return {
        participant: getParticipant,
        challenges: getChallenges,
        skills: getSkills,
        tools: getTools,
      };
    });

    const challengeNames = _.map(challenges, (c) => c.title);
    const skillNames = _.map(skills, (s) => s.name);
    const toolNames = _.map(tools, (t) => t.name);
    const schema = new SimpleSchema({
      firstName: String,
      lastName: String,
      username: String,
      demographicLevel: { type: String },
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

  const submit = (data) => {
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
        const doc = Challenge.findDoc({ title });
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
          footer: '<a href>Why do I have this issue?</a>',
        });
      } else {
        Swal.fire({
          icon: 'success',
          text: 'Your profile is updated.',
        });
      }
    });
    setRedirect(true);
  };

  const model = participant;
  const formSchema = new SimpleSchema2Bridge(schema);
  const firstname = model.firstName;
  if (redirect) {
    return <Redirect to={ ROUTES.YOUR_PROFILE } />;
  }
  return (
    <Container id='create-profile' style={{ paddingBottom: '4rem' }}>
      <h3 style={{ paddingTop: '2rem' }}>
        Hello {firstname}, this is your first time to login, so please fill out your profile
      </h3>
      <hr/>
      <AutoForm schema={formSchema} model={participant}
                onSubmit={data => submit(data)}>
        <Row>
          <Col><TextField name="username" disabled/></Col>
          <Col xs={5} sm={3}><BoolField name="isCompliant" disabled/></Col>
        </Row>
        <Row>
          <Col sm={4}><TextField id='first-name' name="firstName"/></Col>
          <Col sm={4}><TextField id='last-name' name="lastName"/></Col>
          <Col sm={4}><SelectField id='demographic-level' name="demographicLevel"
                            options={demographicLevels.map((val) => ({ label: val, value: val }))}/></Col>
        </Row>
        <Row>
          <Col xs={6} sm={3}><TextField id='linked-in' name="linkedIn"/></Col>
          <Col xs={6} sm={3}><TextField id='github' name="gitHub"/></Col>
          <Col xs={6} sm={3}><TextField id='slack-username' name="slackUsername"/></Col>
          <Col xs={6} sm={3}><TextField id='website' name="website"/></Col>
        </Row>
        <Row>
          <LongTextField id='about-me' name="aboutMe"/>
        </Row>
        <Row>
          <Col sm={4}><SelectField id='challenges' name="challenges" multiple
                            options={challengeNames.map((val) => ({ label: val, value: val }))}/>
          </Col>
          <Col sm={4}><SelectField id='skills' name="skills" multiple
                            options={skillNames.map((val) => ({ label: val, value: val }))}/></Col>
          <Col sm={4}><SelectField id='tools' name="tools" multiple
                            options={toolNames.map((val) => ({ label: val, value: val }))}/></Col>
        </Row>
        <ErrorsField />
        <SubmitField id='create-profile-submit' />
      </AutoForm>
    </Container>
  );
};

export default CreateProfileWidget;
