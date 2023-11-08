import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Alert, Card, Col, Container, Form, Row } from 'react-bootstrap';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SubmitField,
  TextField,
  SelectField,
} from 'uniforms-bootstrap5';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';
import { Teams } from '../../../api/team/TeamCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { CanChangeChallenges } from '../../../api/team/CanChangeChallengeCollection';
import { ROUTES } from '../../../startup/client/route-constants';
import { paleBlueStyle } from '../../styles';

const EditTeamWidget = () => {

  const teamID = useParams()._id;
  const { team, skills, challenges, tools, members, participants, allChallenges,
    allSkills, allTools, canChangeChallenges } = useTracker(() => {
    const getTeam = Teams.findDoc(teamID);
    const challengeIDs = TeamChallenges.find({ teamID }).fetch();
    const getChallenges = _.map(challengeIDs, (doc) => Challenges.findDoc(doc.challengeID));
    const skillIDs = TeamSkills.find({ teamID }).fetch();
    const getSkills = _.map(skillIDs, (id) => Skills.findDoc(id.skillID));
    const toolIDs = TeamTools.find({ teamID }).fetch();
    const getTools = _.map(toolIDs, (id) => Tools.findDoc(id.toolID));
    const memberIDs = TeamParticipants.find({ teamID }).fetch();
    const getMembers = _.map(memberIDs, (id) => Participants.findDoc(id.participantID));
    const getParticipants = Participants.find({}).fetch();
    const getAllChallenges = Challenges.find({}).fetch();
    const getAllSkills = Skills.find({}).fetch();
    const getAllTools = Tools.find({}).fetch();
    const getCanChangeChallenges = CanChangeChallenges.findOne().canChangeChallenges;
    return {
      team: getTeam,
      skills: getSkills,
      challenges: getChallenges,
      tools: getTools,
      members: getMembers,
      participants: getParticipants,
      allChallenges: getAllChallenges,
      allSkills: getAllSkills,
      allTools: getAllTools,
      canChangeChallenges: getCanChangeChallenges,
    };
  });

  const [switchState, setSwitchState] = useState(team.open);
  const [redirect, setRedirect] = useState(false);

  const challengeNames = _.map(allChallenges, (c) => c.title);
  const skillNames = _.map(allSkills, (s) => s.name);
  const toolNames = _.map(allTools, (t) => t.name);
  const participantNames = _.map(participants, (p) => p.username);
  const buildTheFormSchema = () => {
    const schema = new SimpleSchema({
      open: {
        type: String,
        label: 'Availability',
      },
      name: { type: String },
      challenge: { type: String, allowedValues: challengeNames, optional: true },
      skills: { type: Array, label: 'Skills', optional: true },
      'skills.$': { type: String, allowedValues: skillNames },
      tools: { type: Array, label: 'Tools', optional: true },
      'tools.$': { type: String, allowedValues: toolNames },
      members: { type: Array, optional: true },
      'members.$': { type: String, allowedValues: participantNames },
      description: String,
      gitHubRepo: { type: String, optional: true },
      devPostPage: { type: String, optional: true },
      affiliation: { type: String, optional: true },
    });
    return schema;
  };

  const buildTheModel = () => {

    const model = team;
    model.challenges = _.map(challenges, (challenge) => challenge.title);
    model.challenge = team.challenges[0];
    model.skills = _.map(skills, (skill) => skill.name);
    model.tools = _.map(tools, (tool) => tool.name);
    model.members = _.uniq(_.map(members, (m) => m.username));
    return model;
  };

  const submitData = (data) => {
    const collectionName = Teams.getCollectionName();
    const updateData = {};
    updateData.id = data._id;
    updateData.name = data.name;
    updateData.description = data.description;
    updateData.gitHubRepo = data.gitHubRepo;
    updateData.devPostPage = data.devPostPage;
    updateData.affiliation = data.affiliation;
    updateData.open = switchState;
    if (data.challenge) {
      // build an array of challenge slugs
      updateData.challenges = [];
      const doc = Challenges.findDoc({ title: data.challenge });
      updateData.challenges.push(Slugs.getNameFromID(doc.slugID));
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
    if (data.image) {
      updateData.image = data.image;
    }
    if (data.members) {
      updateData.participants = data.members;
    }
    // console.log(collectionName, updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
          footer: '<a href>Why do I have this issue?</a>',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Team updated.',
        });
      }
    });
    setRedirect(true);
  };

    // let fRef = null;
    const formSchema = new SimpleSchema2Bridge(buildTheFormSchema());
    const model = buildTheModel();
  if (redirect) {
    return <Redirect to={ ROUTES.YOUR_TEAMS } />;
  }
    return (
        <Container id='edit-team' className='card-pages'>
          <Card style={paleBlueStyle} className='createTeam'>
            <Card.Body>
            <AutoForm schema={formSchema} model={model} onSubmit={(data) => {
              submitData(data);
            }}
                      style={{
                        paddingBottom: '40px',
                      }}>
                  <Col style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                  <h4 className='text-center'>Edit Team</h4>
                  <Alert className='text-center'>
                    <Alert.Heading>Team name and Devpost page ALL
                      have to use the same name</Alert.Heading>
                  </Alert>
                  <Row>
                    <Col><TextField name='name'/></Col>
                    <Col>
                      <Form.Label>Availability</Form.Label>
                      <Form.Check type='switch' id='availability'
                                  label={switchState ? 'Open' : 'Closed'} defaultChecked={switchState}
                                  onChange={() => {
                                    setSwitchState(!switchState);
                                  }}/>
                    </Col>
                  </Row>
                  <LongTextField name='description'/>
                  <SelectField name='challenge' disabled={!canChangeChallenges}/>
                  <Row>
                    <Col><SelectField id='skills' name='skills' multiple
                                      options={skillNames.map((val) => ({ label: val, value: val }))}/></Col>
                    <Col><SelectField id='tools' name='tools' multiple
                                      options={toolNames.map((val) => ({ label: val, value: val }))}/></Col>
                  </Row>
                  <TextField name="gitHubRepo" label="GitHub Repo" disabled/>
                  <TextField name="devPostPage" label="Devpost Page"/>
                  <TextField name="affiliation"/>
                  <SelectField id='members' name='members' multiple
                               options={participantNames.map((val) => ({ label: val, value: val }))}/>
                </Col>
                  <ErrorsField/>
                  <div align='center'>
                    <SubmitField value='Submit' />
                  </div>
            </AutoForm>
                </Card.Body>
              </Card>
        </Container>
    );
};

export default EditTeamWidget;
