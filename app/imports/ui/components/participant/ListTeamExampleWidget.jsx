import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Button } from 'react-bootstrap';
import _ from 'underscore';
import swal from 'sweetalert';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Teams } from '../../../api/team/TeamCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

class ListTeamExampleWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sent: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (e, inst) => {
    console.log(e, inst);
    const collectionName = WantsToJoin.getCollectionName();
    const teamDoc = Teams.findDoc(inst.id);
    const team = Slugs.getNameFromID(teamDoc.slugID);
    const participant = Participants.findDoc({ userID: Meteor.userId() }).username;
    const definitionData = {
      team,
      participant,
    };
    console.log(collectionName, definitionData);

    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        swal('Sent Request Fail', error, 'error');
      } else {

        swal('Success', 'Join Request Sent', 'success');
        this.setState({ sent: true });
}
    });
  }

  renderButton = () => {
    const participant = Participants.findDoc({ userID: Meteor.userId() });
    const participantName = Participants.getFullName(participant._id);
    const isAMember = _.includes(this.props.teamMembers, participantName);

    const Joinrequests = WantsToJoin.find({ teamID: this.props.team._id }).fetch();
    const Joinsentusers = _.pluck(Joinrequests, 'participantID');
    const Requested = _.contains(Joinsentusers, participant._id);

    if (isAMember) {
      return (<Button id={this.props.team._id} variant="success"
                      disabled={true} style={{ width: `${100}px`,
        height: `${50}px`, textAlign: 'center' }} >You own the team</Button>);
    }
    if (this.state.sent || Requested) {
      return (<Button id={this.props.team._id} variant="success"
                      disabled={true} style={{ width: `${100}px`,
        height: `${50}px`, textAlign: 'center' }} >You sent the request</Button>);
    }
    return (<Button id={this.props.team._id} variant="success"
                    onClick={this.handleClick} style={{ width: `${100}px`,
      height: `${50}px`, textAlign: 'center' }} >Request to Join</Button>);
  }

  render() {

    return (
      <Card style={ { marginTop: 15 } }>
        <Card.Body>
          <Row className="d-none d-md-flex">
            <Col>
              <h5>{this.props.team.name}</h5>
            </Col>
            <Col>
              <h5>Challenges</h5>
                {this.props.teamChallenges.map((item) => <p key={item}>{`\u2022 ${item}`}</p>)}
              {_.uniq(this.props.teamChallenges).length === 0 ? (<p>N/A</p>) : ''}
            </Col>
            <Col>
              <h5>Desired Skills</h5>
                {this.props.teamSkills.map((item) => <p key={item}>{`\u2022 ${item}`}</p>)}
              {_.uniq(this.props.teamSkills).length === 0 ? (<p>N/A</p>) : ''}
            </Col>
            <Col>
              <h5>Desired Tools</h5>
                {this.props.teamTools.map((item) => <p key={item}>{`\u2022 ${item}`}</p>)}
              {_.uniq(this.props.teamTools).length === 0 ? (<p>N/A</p>) : ''}
            </Col>
            <Col>
              {_.uniq(this.props.team.devPostPage).length === 1 ? (
                <a href={this.props.team.devPostPage}>Devpost Page</a>) : ''}
              {_.uniq(this.props.team.devPostPage).length === 0 ? (<p>DevPost page not listed</p>) : ''}
              <br />
              {_.uniq(this.props.team.gitHubRepo).length === 1 ? (
                <a href={this.props.team.gitHubRepo}>GitHub Repo</a>) : ''}
              {_.uniq(this.props.team.gitHubRepo).length === 0 ? (<p>GitHub Repo not listed</p>) : ''}
            </Col>
            <Col>
              <h5>Members</h5>
                {this.props.teamMembers.map((item) => <p key={item}>{`\u2022 ${item}`}</p>)}
              {_.uniq(this.props.teamMembers).length === 0 ? (<p>No members listed</p>) : ''}
            </Col>
            <Col textAlign='center'>
              {this.renderButton()}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}
ListTeamExampleWidget.propTypes = {
  team: PropTypes.object.isRequired,
  teamChallenges: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
  teamSkills: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
  teamTools: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
  teamMembers: PropTypes.arrayOf(
      PropTypes.string,
  ).isRequired,
};

export default ListTeamExampleWidget;
