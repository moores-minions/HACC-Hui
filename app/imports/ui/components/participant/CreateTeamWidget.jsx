import React from 'react';
import {
  Alert,
  Modal,
  Container,
  Row,
  Card,
  Col,
  Form,
  Button,
  ListGroup,
  Header,
} from 'react-bootstrap';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
  ListItemField,
  ListField,
  SelectField,
} from 'uniforms-semantic';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../../components/form-fields/MultiSelectField';
import RadioField from '../../components/form-fields/RadioField';
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
    };
  }

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
  // eslint-disable-next-line no-unused-vars
  submit(formData, formRef) {
    // console.log('create team submit', formData);
    this.setState({ isRegistered: [] });
    this.setState({ notRegistered: [] });
    const owner = this.props.participant.username;
    const { name, description, challenge, skills, tools, participants } =
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
    // console.log(currPart, partArray);
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

    let { open } = formData;
    if (open === 'Open') {
      open = true;
    } else {
      open = false;
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
        <div align={'center'}>
          <Header as="h2" icon>
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

    const fRef = null;
    const formSchema = new SimpleSchema2Bridge(this.buildTheFormSchema());
    const model = this.buildTheModel();
    const disabled = !this.props.canCreateTeams;
    return (
      <Container
        style={{ paddingBottom: '50px', paddingTop: '40px' }}
        fluid="md"
      >
        <Row className="justify-content-md-center">
          <Col>
            <Card style={{ backgroundColor: '#E5F0FE' }}>
              <Card.Header as="h2" className="text-center">
                Create a Team
              </Card.Header>
              <Alert variant="secondary">
                <Alert.Heading className="text-center">
                  Team name and Devpost page ALL have to use the same name. Team
                  names cannot have spaces or special characters.
                </Alert.Heading>
              </Alert>
              <Card.Body>
                <Form>
                  <Form.Group as={Row}>
                    <Col>
                      <Form.Label>Team Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Team Name"
                        name="name"
                      />
                      {/* Inline Radio Buttons for 'open' */}
                      <Form.Label>Availability: &ensp;&ensp;</Form.Label>
                      <Form.Check
                        type="radio"
                        label="Open"
                        name="open"
                        value="Open"
                        id="radio-open"
                        inline
                      />
                      <Form.Check
                        type="radio"
                        label="Close"
                        name="open"
                        value="Close"
                        id="radio-close"
                        inline
                      />
                    </Col>
                  </Form.Group>
                  {/* LongTextField replaced with Form.Control as textarea */}
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" name="description" />
                  </Form.Group>
                  {/* SelectField replacement */}
                  <Form.Group>
                    <Form.Label className='mt-3'>Challenge</Form.Label>
                    <Form.Control as="select" name="challenge">
                      {/* Populate options here */}
                    </Form.Control>
                    <Row className='mt-3'>
                      <Col>
                        <Form.Label>Skills</Form.Label>
                        <Form.Control as="select" name='skills' />
                      </Col>
                      <Col>
                        <Form.Label>Tools</Form.Label>
                        <Form.Control name='tools' />
                      </Col>
                    </Row>
                  </Form.Group>
                  {/* MultiSelectField and other fields */}
                  {/* Additional form fields can be added similarly */}
                  {/* Submit button */}
                  <Button className='mt-3' type="submit" variant="primary" disabled={disabled}>
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <Modal show={this.state.errorModal} onHide={this.closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Member Warning</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Content of the modal */}
                <p>
                  Some Members you are trying to invite have not registered with
                  SlackBot.
                </p>
                <ListGroup>
                  <ListGroup.Item>
                    <b>Registered Members:</b> {/* List items */}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b>Not Registered Members:</b> {/* List items */}
                  </ListGroup.Item>
                </ListGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="success" onClick={this.closeModal}>
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
