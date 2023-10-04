import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Col, Container, Image, Modal, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, TextField, ListField, ListItemField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

const schema = new SimpleSchema({
  participants: {
    type: Array,
    minCount: 1,
  },
  'participants.$': {
    type: Object,
  },
  'participants.$.email': {
    type: String,
    min: 3,
  },

});

const YourTeamsCard = ({ teams, teamParticipants, teamInvitation }) => {

   const [show, setShow] = useState(false);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);

  /** On submit, insert the data.
   * @param formData {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  // eslint-disable-next-line no-unused-vars
   const submit = (formData, formRef) => {
    const { participants } = formData;
    const participantCollection = Participants.dumpAll().contents;
    const foundParticipants = [];
    const participantList = [];

    // get all participant email and also the ones listed in form
    for (let i = 0; i < participants.length; i++) {
      participantList.push(participants[i].email);
      for (let j = 0; j < participantCollection.length; j++) {
        if (participants[i].email === participantCollection[j].username) {
          foundParticipants.push(participants[i].email);
        }
      }
    }

    // difference should be 0 if all the inputted participants are registered via slack
    const notFoundParticipants = _.difference(participantList, foundParticipants);

    // if they entered duplicates
    if (_.uniq(participantList).length !== participantList.length) {
      swal('Error',
          'Sorry, it seems like you entered a duplicate email.\n\nPlease check again.',
          'error');
      return;
    }

    // If we cannot find a participant's email
    if (notFoundParticipants.length > 0) {
      swal('Error',
          `Sorry, we could not find participant(s): \n${notFoundParticipants.join(', ')}
          \n\nPlease double check that their emails are inputted correctly and that they 
          have registered with the HACC-HUI Slackbot.`,
          'error');
      return;
    }

    // If the participant is already in the team OR user tries to invite themselves OR there is already an invitation
    const selfUser = Participants.findDoc({ userID: Meteor.userId() }).username;
    for (let i = 0; i < participantList.length; i++) {
      const participantDoc = Participants.findDoc({ username: participantList[i] });

      if (selfUser === participantList[i]) {
        swal('Error',
            'Sorry, you can\'t invite yourself!',
            'error');
        return;
      }
      if (typeof TeamParticipants.findOne({
        teamID: teams._id,
        developerID: participantDoc._id,
      }) !== 'undefined') {
        swal('Error',
            `Sorry, participant ${participantList[i]} is already in ${teams.name}!`,
            'error');
        return;
      }

      // check to see if the invitation was already issued
      for (let j = 0; j < teamInvitation.length; j++) {
        if (teamInvitation[j].teamID === teams._id &&
            teamInvitation[j].participantID === participantDoc._id) {
          swal('Error',
              `Sorry, an invitation to ${participantList[i]} was already issued!`,
              'error');
          return;
        }
      }
    }

    // IF WE WANT TO ISSUE DIRECT INVITE (THEY DON'T HAVE TO ACCEPT IT)

    // const teamDoc = Teams.findDoc(this.props.teams._id);
    // const team = teamDoc._id;
    // const developerDoc = Developers.findDoc({ username: participantList[i] });
    // const developer = developerDoc._id;
    // console.log(definitionData);
    // const addToTeam = TeamDevelopers.getCollectionName();
    //
    // defineMethod.call({ collectionName: addToTeam, definitionData: definitionData },
    //     (error) => {
    //       if (error) {
    //         swal('Error', error.message, 'error');
    //       } else {
    //         swal('Success',
    //             `You've successfully added participant(s):\n\n ${participantList.join(', ')}
    //           to ${this.props.teams.name}`,
    //             'success');
    //       }
    //     });

    // if there are no errors, we can then add everyone
    for (let i = 0; i < participantList.length; i++) {
      // const collectionName = WantsToJoin.getCollectionName();
      const teamDoc = Teams.findDoc(teams._id);
      const team = Slugs.getNameFromID(teamDoc.slugID);
      const participant = participantList[i];
      const definitionData = {
        team,
        participant,
      };
      const collectionName2 = TeamInvitations.getCollectionName();
      defineMethod.call({ collectionName: collectionName2, definitionData }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success',
              `You've successfully invited participant(s):\n\n ${participantList.join(', ')}
              \nto ${teams.name}
              \n The participants can now look at 'Team Invitations' to accept it.`,
              'success');
          formRef.reset();
        }
      });
    }
  };

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */

  let fRef = null;
  const formSchema = new SimpleSchema2Bridge(schema);
  // console.log(this.props);
  return (
      <Container className = 'your-teams team-card'>
        <Row>
          <h5 className='team-name'>
            <Icon.PeopleFill size={32}/>
            {' '}
            <b>{teams.name}</b>
          </h5>
        </Row>
        <Row>
          <Col>
            GitHub: {teams.gitHubRepo}<br/>
            DevPost: {teams.devPostPage}
            <Image src={teams.image} rounded size='large'/>
          </Col>
          <Col>
            <h5>Members</h5>
            {teamParticipants.map((participant) => <p key={participant}>
              {participant.firstName} {participant.lastName}</p>)}
          </Col>

          <Col>
            <btn className='team-buttons' id={`interested-${teams._id}`}>
              <Link to={`/interested-participants/${teams._id}`}>See interested
                participants</Link>
            </btn>
          </Col>
          <Col>
            <btn className='team-buttons' id={`inv-${teams._id}`} onClick={handleShow}>
              Invite Participants
            </btn>
            <Modal
              onHide={handleClose}
              show={show}
            >
              <Modal.Body
                style={{
                  background: 'none',
                  padding: 0,
                }}>
                <AutoForm ref={ref => {
                  fRef = ref;
                }} schema={formSchema}
                          onSubmit={data => submit(data, fRef)}
                >
                  <Container style={{
                    borderRadius: '10px',
                  }}>
                    <h3>
                      Who would you like to invite to {teams.name}?
                    </h3>
                    <h4 style={{ paddingBottom: '2rem', marginTop: '0rem' }}>
                      Please make sure the email you input is the same as the ones they&apos;ve used to
                      make their Slack account.
                    </h4>
                    <ListField addIcon={<Icon.PlusLg/>} removeIcon={<Icon.DashLg/>}
                               name="participants" label={'Enter each participant\'s email'}>
                      <ListItemField name="$">
                        <TextField id="email" name="email"/>
                      </ListItemField>
                    </ListField>

                    <div align='center'>
                      <Button id='submit' variant='success' type='submit' style={{ margin: '20px 0px' }}>
                        Submit
                      </Button>
                    </div>
                  </Container>
                </AutoForm>
              </Modal.Body>
            </Modal>
          </Col>

          <Col>
            <btn className='team-buttons' id={`edit-${teams._id}`}>
              <Link to={`/edit-team/${teams._id}`}>Edit Team</Link>
            </btn>
          </Col>
        </Row>
      </Container>
  );
};

YourTeamsCard.propTypes = {
  teams: PropTypes.object.isRequired,
  teamParticipants: PropTypes.array.isRequired,
  teamInvitation: PropTypes.array.isRequired,
};

export default YourTeamsCard;
