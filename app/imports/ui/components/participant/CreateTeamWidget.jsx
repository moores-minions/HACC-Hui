import React from 'react';
import {
  Modal,
  Button,
  Form,
  Alert,
  Row,
  Col,
  Container,
  Header,
} from 'react-bootstrap';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
  ListField,
  ListItemField,
  SelectField,
} from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { CanCreateTeams } from '../../../api/team/CanCreateTeamCollection';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class CreateTeamWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferer: false,
      errorModal: false,
      isRegistered: [],
      notRegistered: [],
      selectedSkills: [],
      selectedTools: [],
    };
  }

  handleSkillsChange = (event) => {
    this.setState({
      selectedSkills: Array.from(
        event.target.selectedOptions,
        (option) => option.value,
      ),
    });
  };

  handleToolsChange = (event) => {
    this.setState({
      selectedTools: Array.from(
        event.target.selectedOptions,
        (option) => option.value,
      ),
    });
  };

  buildTheModel() {
    return {
      skills: [],
      tools: [],
    };
  }

  buildTheFormSchema() {
    const challengeNames = _.map(this.props.challenges, (c) => c.title);
    const skillNames = _.map(this.props.skills, (s) => s.name);
    const toolNames = _.map(this.props.tools, (t) => t.name);
    const schema = new SimpleSchema({
      open: {
        type: String,
        allowedValues: ['Open', 'Close'],
        label: 'Availability',
        optional: true,
      },
      name: { type: String, label: 'Team Name' },
      challenge: {
        type: String,
        allowedValues: challengeNames,
        optional: true,
      },
      skills: { type: Array, label: 'Skills', optional: true },
      'skills.$': { type: String, allowedValues: skillNames },
      tools: { type: Array, label: 'Toolsets', optional: true },
      'tools.$': { type: String, allowedValues: toolNames },
      // participants: { type: String, label: 'participants' },
      description: String,
      devpostPage: { type: String, optional: true },
      affiliation: { type: String, optional: true },

      participants: {
        optional: true,
        type: Array,
        minCount: 0,
      },
      'participants.$': {
        optional: true,
        type: Object,
      },
      'participants.$.email': {
        optional: true,
        type: String,
        min: 3,
      },
    });
    return schema;
  }

  /** On submit, insert the data.
   * @param formData {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  submit(formData, formRef) {
    // console.log(formData);
    this.setState({ isRegistered: [] });
    this.setState({ notRegistered: [] });
    const owner = this.props.participant.username;
    const { name, description, challenge, skills, tools, participants, open } =
      formData;
    if (/^[a-zA-Z0-9-]*$/.test(name) === false) {
      swal(
        'Error',
        'Sorry, no special characters or space allowed in the Team name.',
        'error',
      );
      return;
    }
    let partArray = [];

    if (typeof participants !== 'undefined') {
      partArray = participants;
    }

    const currPart = Participants.find({}).fetch();
    const isRegistered = [];
    const notRegistered = [];
    for (let i = 0; i < partArray.length; i++) {
      let registered = false;
      for (let j = 0; j < currPart.length; j++) {
        if (currPart[j].username === partArray[i].email) {
          registered = true;
          this.setState({
            isRegistered: this.state.isRegistered.concat([
              `-${partArray[i].email}`,
            ]),
          });
          isRegistered.push(partArray[i].email);
        }
      }
      if (!registered) {
        this.setState({
          notRegistered: this.state.notRegistered.concat([
            `-${partArray[i].email}`,
          ]),
        });
        notRegistered.push(partArray[i].email);
      }
    }
    if (notRegistered.length !== 0) {
      this.setState({ errorModal: true });
    }

    const skillsArr = _.map(skills, (n) => {
      const doc = Skills.findDoc({ name: n });
      return Slugs.getNameFromID(doc.slugID);
    });
    const toolsArr = _.map(tools, (t) => {
      const doc = Tools.findDoc({ name: t });
      return Slugs.getNameFromID(doc.slugID);
    });
    const challengesArr = [];
    if (challenge) {
      const challengeDoc = Challenges.findDoc({ title: challenge });
      const challengeSlug = Slugs.getNameFromID(challengeDoc.slugID);
      challengesArr.push(challengeSlug);
    }
    const collectionName = Teams.getCollectionName();
    const definitionData = {
      name,
      description,
      owner,
      open,
      challenges: challengesArr,
      skills: skillsArr,
      tools: toolsArr,
    };
    // console.log(collectionName, definitionData);
    defineMethod.call(
      {
        collectionName,
        definitionData,
      },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          if (!this.state.errorModal) {
            swal('Success', 'Team created successfully', 'success');
          }
          formRef.reset();
        }
      },
    );

    // sending invites out to registered members
    for (let i = 0; i < isRegistered.length; i++) {
      const newTeamID = Teams.find({ name: name }).fetch();
      const teamDoc = Teams.findDoc(newTeamID[0]._id);
      const team = Slugs.getNameFromID(teamDoc.slugID);
      const inviteCollection = TeamInvitations.getCollectionName();
      const inviteData = { team: team, participant: isRegistered[i] };
      defineMethod.call(
        { collectionName: inviteCollection, definitionData: inviteData },
        (error) => {
          if (error) {
            console.error(error.message);
          } else {
            console.log('Success');
          }
        },
      );
    }
  }

  closeModal = () => {
    this.setState({ errorModal: false });
    swal('Success', 'Team created successfully', 'success');
  };

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    if (!this.props.participant.isCompliant) {
      return (
        <div>
          <Header as="h2" icon>
            <i className="bi bi-thumbs-down"></i>
            You have not agreed to the{' '}
            <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
            &nbsp;or we&apos;ve haven&apos;t received the signed form yet.
            <Header.Subheader>
              You cannot create a team until you do agree to the rules. Please
              check back later.
            </Header.Subheader>
          </Header>
        </div>
      );
    }

    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(this.buildTheFormSchema());
    const model = this.buildTheModel();
    const disabled = !this.props.canCreateTeams;

    return (
      <Container style={{ paddingBottom: '50px', paddingTop: '40px' }}>
        <Row className="justify-content-md-center">
          <Col>
            <div
              style={{
                backgroundColor: '#E5F0FE',
                padding: '20px',
                borderRadius: '10px',
              }}
              className={'createTeam'}
            >
              <h2 style={{ textAlign: 'center' }}>Create a Team</h2>
              <Alert variant="info">
                <h4 style={{ textAlign: 'center' }}>
                  Team name and Devpost page ALL have to use the same name. Team
                  names cannot have spaces or special characters.
                </h4>
              </Alert>
              <AutoForm
                ref={(ref) => {
                  fRef = ref;
                }}
                schema={formSchema}
                model={model}
                onSubmit={(data) => this.submit(data, fRef)}
                style={{ paddingBottom: '40px' }}
              >
                <Form.Group as={Row} className="align-items-center">
                  <Col sm={8}>
                    <TextField name="name" required />
                  </Col>
                  <Col sm={4}>
                    <div className="mb-3">
                      <Form.Label>
                        Availability <span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <div key={'inline-radio'} className="mb-3">
                        <Form.Check
                          inline
                          label="Open"
                          name="open"
                          type="radio"
                          value="Open"
                          id={'inline-radio-1'}
                          required
                        />
                        <Form.Check
                          inline
                          label="Close"
                          name="open"
                          type="radio"
                          value="Close"
                          id={'inline-radio-2'}
                          required
                        />
                      </div>
                    </div>
                  </Col>
                </Form.Group>

                <LongTextField name="description" />
                <SelectField name="challenge" />
                {/* <Row> */}
                {/* <Col><MultiSelectField name="skills" /></Col> */}
                {/* <Col><MultiSelectField name="tools" /></Col> */}
                {/* </Row> */}
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Skills</Form.Label>
                      <Form.Control
                        as="select"
                        multiple
                        value={this.state.selectedSkills}
                        onChange={this.handleSkillsChange}
                      >
                        {this.props.skills.map((skill) => (
                          <option key={skill._id} value={skill._id}>
                            {skill.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Toolsets</Form.Label>
                      <Form.Control
                        as="select"
                        multiple
                        value={this.state.selectedTools}
                        onChange={this.handleToolsChange}
                      >
                        {this.props.tools.map((tool) => (
                          <option key={tool._id} value={tool._id}>
                            {tool.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <TextField name="devpostPage" />
                <TextField name="affiliation" />

                <ListField
                  name="participants"
                  label={"Enter each participant's email"}
                >
                  <ListItemField name="$" className="list-item">
                    <TextField showInlineError name="email" label={'Email'} />
                  </ListItemField>
                </ListField>

                <div style={{ textAlign: 'center' }}>
                  <SubmitField
                    value="Submit"
                    style={{
                      color: 'white',
                      margin: '20px 0px',
                      width: '100%',
                      border: 'none',
                    }}
                    disabled={disabled}
                  />
                </div>
                <ErrorsField />
              </AutoForm>
            </div>
            <Modal show={this.state.errorModal} onHide={this.close}>
              <Modal.Header closeButton>
                <Modal.Title>Member Warning</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h4>
                  Some Members you are trying to invite have not registered with
                  SlackBot.
                </h4>
                <b>Registered Members:</b>
                {/* Replace List with equivalent from React-Bootstrap */}
                <b>Not Registered Members:</b>
                {/* Replace List with equivalent from React-Bootstrap */}
              </Modal.Body>
              <Modal.Footer>
                <b style={{ float: 'left' }}>
                  Slackbot will only send invites to registered members, please
                  confirm.
                </b>
                <Button variant="primary" onClick={() => this.closeModal()}>
                  I Understand
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    );
  }
}

CreateTeamWidget.propTypes = {
  participant: PropTypes.object.isRequired,
  skills: PropTypes.arrayOf(PropTypes.object).isRequired,
  challenges: PropTypes.arrayOf(PropTypes.object).isRequired,
  tools: PropTypes.arrayOf(PropTypes.object).isRequired,
  canCreateTeams: PropTypes.bool,
};

export default withTracker(() => ({
  participant: Participants.findDoc({ userID: Meteor.userId() }),
  challenges: Challenges.find({}).fetch(),
  skills: Skills.find({}).fetch(),
  tools: Tools.find({}).fetch(),
  canCreateTeams: CanCreateTeams.findOne().canCreateTeams,
}))(CreateTeamWidget);
