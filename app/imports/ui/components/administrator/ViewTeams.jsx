/* eslint-disable max-len */
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { ZipZap } from 'meteor/udondan:zipzap';
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { Teams } from '../../../api/team/TeamCollection';
import ViewTeamExample from './ViewTeam';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { databaseFileDateFormat } from '../../pages/administrator/DumpDatabase';

const getTeamMembers = (team) => {
  const teamID = team._id;
  const teamParticipants = TeamParticipants.find({ teamID }).fetch();
  const memberNames = teamParticipants.map((tp) => {
    const fullName = Participants.getFullName(tp.participantID);
    const participant = Participants.findDoc(tp.participantID);
    const gitHub = participant.gitHub;
    return `${fullName}, (${gitHub})`;
  });
  return _.uniq(memberNames);
};

const ViewTeams = () => {
  const { participants, teams, teamChallenges, teamParticipants } = useTracker(() => {
    const teamsData = Teams.find({}, { sort: { name: 1 } }).fetch();
    const teamChallengesData = TeamChallenges.find({}).fetch();
    const teamParticipantsData = TeamParticipants.find({}).fetch();
    const participantsData = Participants.find({}).fetch();

    return {
      participants: participantsData,
      teams: teamsData,
      teamChallenges: teamChallengesData,
      teamParticipants: teamParticipantsData,
    };
  });

  const [filteredTeams, setFilteredTeams] = useState(teams);
  const [filterValue, setFilterValue] = useState('None');
  // console.log(filteredTeams);
  const stickyStyle = {
    position1: '-webkit-sticky',
    position: 'sticky',
    top: '6.5rem',
  };

  const teamIsCompliant = (teamID) => {
    const tps = teamParticipants.filter((tp) => tp.teamID === teamID);
    let compliant = true;
    tps.forEach((tp) => {
      const participant = participants.filter(
        (p) => p._id === tp.participantID,
      );
      // console.log(participant);
      compliant = compliant && participant[0].isCompliant;
    });
    return compliant;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);
    const remainingTeams = [];
    const localTeams = filteredTeams;
    switch (value) {
      case 'Challenge':
        localTeams.forEach((team) => {
          const challengeIDs = teamChallenges.filter(
            (tc) => tc.teamID === team._id,
          );
          if (challengeIDs.length === 0) {
            remainingTeams.push(team);
          }
        });
        setFilteredTeams(remainingTeams);
        break;
      case 'NonCompliant':
        localTeams.forEach((team) => {
          if (!teamIsCompliant(team._id)) {
            remainingTeams.push(team);
          }
        });
        setFilteredTeams(remainingTeams);
        break;
      case 'NoDevPost':
        localTeams.forEach((team) => {
          if (!team.devPostPage) {
            remainingTeams.push(team);
          }
        });
        setFilteredTeams(remainingTeams);
        break;
      case 'NoGitHub':
        localTeams.forEach((team) => {
          if (!team.gitHubRepo) {
            remainingTeams.push(team);
          }
        });
        setFilteredTeams(remainingTeams);
        break;
      default:
        setFilteredTeams(teams);
    }
  };

  const handleDownload = () => {
    const zip = new ZipZap();
    const dir = 'hacchui-team-captains';
    const fileName = `${dir}/${moment().format(
      databaseFileDateFormat,
    )}-team-captains.txt`;
    const localTeams = filteredTeams;
    const ownerIDs = localTeams.map((t) => t.owner);
    const emails = [];
    ownerIDs.forEach((id) => {
      const pArr = participants.filter((p) => p._id === id);
      emails.push(pArr[0].username);
    });
    zip.file(fileName, emails.join('\n'));
    zip.saveAs(`${dir}.zip`);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12}>
          <div
            style={{
              backgroundColor: '#E5F0FE',
              padding: '1rem 0rem',
              margin: '2rem 0rem',
              borderRadius: '2rem',
            }}
          >
            <h2 className="text-center">View Teams ({filteredTeams.length})</h2>
          </div>
        </Col>
      </Row>
      <Row>
        <Button onClick={handleDownload}>Download Team Captain emails</Button>
      </Row>
      <Row>
        <Col xs={4}>
          <Card style={stickyStyle}>
            <Form>
              <Form.Group>
                <Form.Label>Select a filter</Form.Label>
                <Form.Check
                  type="radio"
                  name="checkboxRadioGroup"
                  value="NonCompliant"
                  label="Non Compliant"
                  onChange={handleChange}
                  checked={filterValue === 'NonCompliant'}
                />
                <Form.Check
                  type="radio"
                  name="checkboxRadioGroup"
                  value="NoDevPost"
                  label="No devpost"
                  onChange={handleChange}
                  checked={filterValue === 'NoDevPost'}
                />
                <Form.Check
                  type="radio"
                  name="checkboxRadioGroup"
                  value="NoGitHub"
                  label="No GitHub"
                  onChange={handleChange}
                  checked={filterValue === 'NoGitHub'}
                />
                <Form.Check
                  type="radio"
                  name="checkboxRadioGroup"
                  value="None"
                  label="None"
                  onChange={handleChange}
                  checked={filterValue === 'None'}
                />
              </Form.Group>
            </Form>
          </Card>
        </Col>
        <Col xs={12}>
          {/* Replace with your custom item group or ListGroup */}
          {filteredTeams.map((team) => (
            <ViewTeamExample
              key={team._id}
              team={team}
              teamMembers={getTeamMembers(team)}
              isCompliant={teamIsCompliant(team._id)}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

ViewTeams.propTypes = {
  participants: PropTypes.arrayOf(PropTypes.object),
  teams: PropTypes.arrayOf(PropTypes.object),
  teamChallenges: PropTypes.arrayOf(PropTypes.object),
  teamParticipants: PropTypes.arrayOf(PropTypes.object),
};

export default ViewTeams;
