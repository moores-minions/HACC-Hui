import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
  Dropdown,
  Form,
  ListGroup,
  Card,
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { _ } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import { Teams } from '../../../api/team/TeamCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import ListParticipantCardAdmin from './ListParticipantsCardAdmin';
import ListParticipantsFilterAdmin from './ListParticipantsFilterAdmin';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { databaseFileDateFormat } from '../../pages/administrator/DumpDatabase';

const ListParticipantsWidgetAdmin = () => {

  const {
    participantChallenges, participantSkills, participantTools, allTeams,
    teamParticipants, allSkills, allChallenges, allTools, allParticipants,
  } = useTracker(() => ({
    participantChallenges: ParticipantChallenges.find({}).fetch(),
    participantSkills: ParticipantSkills.find({}).fetch(),
    participantTools: ParticipantTools.find({}).fetch(),
    allTeams: Teams.find({}).fetch(),
    teamParticipants: TeamParticipants.find({}).fetch(),
    allSkills: Skills.find({}).fetch(),
    allChallenges: Challenges.find({}).fetch(),
    allTools: Tools.find({}).fetch(),
    allParticipants: Participants.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch(),
  }));

  const [search, setSearch] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [tools, setTools] = useState([]);
  const [skills, setSkills] = useState([]);
  const [teams, setTeams] = useState([]);
  const [noTeamCheckbox, setNoTeamCheckbox] = useState(false);
  const [multipleTeamsCheckbox, setMultipleTeamsCheckbox] = useState(false);
  const [compliantCheckbox, setCompliantCheckbox] = useState(false);
  const [result, setResult] = useState(_.orderBy(allParticipants, ['name'], ['asc']));

  if (allParticipants.length === 0) {
    return (
      <Container id='no-participants-admin' align={'center'}>
        <h4 className='text-center'>
          <Icon.PeopleFill/>
          There are no participants at the moment.
          <h5>
            Please check back later.
          </h5>
        </h4>
      </Container>
    );
  }

  const sticky = {
    position1: '-webkit-sticky',
    position: 'sticky',
    top: '6.5rem',
  };

  const filters = new ListParticipantsFilterAdmin();

  const setFilters = () => {
    const searchResults = filters.filterBySearch(allParticipants, search);
    const skillResults = filters.filterBySkills(skills,
      allSkills, participantSkills, searchResults);
    const toolResults = filters.filterByTools(tools,
      allTools, participantTools, skillResults);
    const challengeResults = filters.filterByChallenge(challenges,
      allChallenges, participantChallenges, toolResults);
    const teamResults = filters.filterByTeam(teams, allTeams,
      teamParticipants, challengeResults);
    // const noTeamResults = filters.filterNoTeam(this.props.teamParticipants, teamResults);
    const sorted = _.uniqBy(filters.sortBy(teamResults, 'participants'), 'username');
    setResult(sorted);
  };

  useEffect(setFilters, [search, skills, tools, challenges, teams]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const getSkills = (value) => {
    if (skills.includes(value)) {
      setSkills(skills.filter((item) => item !== value));
    } else {
      setSkills([...skills, value]);
    }
  };

  const getTools = (value) => {
    if (tools.includes(value)) {
      setTools(tools.filter((item) => item !== value));
    } else {
      setTools([...tools, value]);
    }
  };

  const getChallenge = (value) => {
    // use if filtering by single challenge
    setChallenges([value]);

    // Use if filtering by multiple challenges
    // if (challenges.includes(value)) {
    //   setChallenges(challenges.filter((item) => item !== value));
    // } else {
    //   setChallenges([...challenges, value]);
    // }
  };

  const getTeam = (value) => {
    // Use if filtering by single team
    setTeams([value]);

    // Use if filtering by multiple teams
    // if (teams.includes(value)) {
    //   setTeams(teams.filter((item) => item !== value));
    // } else {
    //   setTeams([...teams, value]);
    // }
  };

  const universalSkills = allSkills;

  const getParticipantSkills = (participantID, partSkills) => {
    const data = [];
    const filteredSkills = _.filter(partSkills, { participantID: participantID });
    for (let i = 0; i < filteredSkills.length; i++) {
      for (let j = 0; j < universalSkills.length; j++) {
        if (filteredSkills[i].skillID === universalSkills[j]._id) {
          data.push({ name: universalSkills[j].name });
        }
      }
    }
    return data;
  };

  const universalTools = allTools;

  const getParticipantTools = (participantID, partTools) => {
    const data = [];
    const filteredTools = _.filter(partTools, { participantID: participantID });
    for (let i = 0; i < filteredTools.length; i++) {
      for (let j = 0; j < universalTools.length; j++) {
        if (filteredTools[i].toolID === universalTools[j]._id) {
          data.push({ name: universalTools[j].name });
        }
      }
    }
    return data;
  };

  const universalChallenges = allChallenges;

  const getParticipantChallenges = (participantID, partChallenges) => {
    const data = [];
    const filteredChallenges = _.filter(partChallenges, { participantID: participantID });
    for (let i = 0; i < filteredChallenges.length; i++) {
      for (let j = 0; j < universalChallenges.length; j++) {
        if (filteredChallenges[i].challengeID === universalChallenges[j]._id) {
          data.push(universalChallenges[j].title);
        }
      }
    }
    return data;
  };

  const universalTeams = allTeams;

  const getParticipantTeams = (participantID, teamParts) => {
    const data = [];
    const filteredTeams = _.filter(teamParts, { participantID: participantID });
    for (let i = 0; i < filteredTeams.length; i++) {
      for (let j = 0; j < universalTeams.length; j++) {
        if (filteredTeams[i].teamID === universalTeams[j]._id) {
          data.push(universalTeams[j].name);
        }
      }
    }
    return data;
  };

  const handleDownload = () => {
    const zip = new ZipZap();
    const dir = 'hacchui-participants';
    const fileName = `${dir}/${moment().format(databaseFileDateFormat)}-participants.txt`;
    const participants = result;
    const emails = participants.map(p => p.username);
    zip.file(fileName, emails.join('\n'));
    zip.saveAs(`${dir}.zip`);
  };

  const handleMultipleTeams = () => {
    if (!multipleTeamsCheckbox) {
      const participants = result;
      const results = filters.filterMultipleTeams(teamParticipants, participants);
      const sorted = _.uniqBy(filters.sortBy(results, 'participants'), 'username');
      setResult(sorted);
    } else {
      setResult(allParticipants);
    }
    const checked = multipleTeamsCheckbox;
    setMultipleTeamsCheckbox(!checked);
  };

  const handleNoTeam = () => {
    if (!noTeamCheckbox) {
      const participants = result;
      const results = filters.filterNoTeam(teamParticipants, participants);
      const sorted = _.uniqBy(filters.sortBy(results, 'participants'), 'username');
      setResult(sorted);
    } else {
      setResult(allParticipants);
    }
    const checked = noTeamCheckbox;
    setNoTeamCheckbox(!checked);
  };

  const handleNotCompliant = () => {
    if (!compliantCheckbox) {
      const participants = result;
      const results = participants.filter(p => !p.isCompliant);
      const sorted = _.uniqBy(filters.sortBy(results, 'participants'), 'username');
      setResult(sorted);
    } else {
      setResult(allParticipants);
    }
    const checked = compliantCheckbox;
    setCompliantCheckbox(!checked);
  };

  const teamNames = _.map(allTeams, (te) => te.name);
  const challengeNames = _.map(allChallenges, (c) => c.title);
  const skillNames = _.map(allSkills, (s) => s.name);
  const toolNames = _.map(allTools, (to) => to.name);

  const filterStyle = {
    paddingTop: 4,
  };
  return (
    <Container id='list-participants-admin' fluid style={{ paddingBottom: '50px' }}>
      <Row className="justify-content-center">
        <Col xs={16}>
          <div className='container-style'>
            <h2 className="text-center">
              All Participants
            </h2>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col>
          <Button onClick={handleDownload}>Download emails</Button>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card style={sticky}>
            <Card.Body style={filterStyle}>
              <Card.Title>Filter Participants</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Total Participants: {result.length}
              </Card.Subtitle>
              <Form>
                <Form.Check type="checkbox" label="No Team" onChange={handleNoTeam}/>
                <Form.Check type="checkbox" label="Multiple Teams" onChange={handleMultipleTeams}/>
                <Form.Check type="checkbox" label="Not Compliant" onChange={handleNotCompliant}/>
              </Form>
              <InputGroup className="mb-3">
                <InputGroup.Text><i className='bi bi-search'></i></InputGroup.Text>
                <FormControl
                  placeholder="Search by participant's name..."
                  onChange={handleSearchChange}
                />
              </InputGroup>

              <h5>Teams</h5>
              <Row>
                <Col>
                  <Dropdown autoClose='outside' drop='end'>
                    <Dropdown.Toggle>Select teams</Dropdown.Toggle>
                    <Dropdown.Menu>
                      {teamNames.map((option, index) => (
                        <Dropdown.Item key={index} active={teams.includes(option)}
                                       onClick={() => getTeam(option)}>{option}</Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col className='text-end'>
                  <Button variant='danger'
                          onClick={() => setTeams([])}>Clear</Button>
                </Col>
              </Row>
              <h5>Challenges</h5>
              <Dropdown>
                <Row>
                  <Col>
                    <Dropdown autoClose='outside' drop='end'>
                      <Dropdown.Toggle>Select challenges</Dropdown.Toggle>
                      <Dropdown.Menu>
                        {challengeNames.map((option, index) => (
                          <Dropdown.Item key={index} active={challenges.includes(option)}
                                         onClick={() => getChallenge(option)}>{option}</Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col className='text-end'>
                    <Button variant='danger'
                            onClick={() => setChallenges([])}>Clear</Button>
                  </Col>
                </Row>
              </Dropdown>

              <h5>Skills</h5>
              <Dropdown>
                <Row>
                  <Col>
                    <Dropdown autoClose='outside' drop='end'>
                      <Dropdown.Toggle>Select skills</Dropdown.Toggle>
                      <Dropdown.Menu>
                        {skillNames.map((option, index) => (
                          <Dropdown.Item key={index} active={skills.includes(option)}
                                         onClick={() => getSkills(option)}>{option}</Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col className='text-end'>
                    <Button variant='danger'
                            onClick={() => setSkills([])}>Clear</Button>
                  </Col>
                </Row>
              </Dropdown>
              <h5>Tools</h5>
              <Dropdown>
                <Row>
                  <Col>
                    <Dropdown autoClose='outside' drop='end'>
                      <Dropdown.Toggle>Select tools</Dropdown.Toggle>
                      <Dropdown.Menu style={{ maxHeight: '7rem' }}>
                        {toolNames.map((option, index) => (
                          <Dropdown.Item key={index} active={tools.includes(option)}
                                         onClick={() => getTools(option)}>{option}</Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col className='text-end'>
                    <Button variant='danger'
                            onClick={() => setTools([])}>Clear</Button>
                  </Col>
                </Row>
              </Dropdown>
              <Row className='py-3 justify-content-center'>
                <Col className='text-center'><Button variant='danger' onClick={() => {
                  setSearch('');
                  setChallenges([]);
                  setTools([]);
                  setSkills([]);
                  setTeams([]);
                  setNoTeamCheckbox(false);
                  setMultipleTeamsCheckbox(false);
                  setCompliantCheckbox(false);
                }}>Clear filters</Button></Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <ListGroup variant="flush">
            {result.map((participants) => <ListParticipantCardAdmin
              key={participants._id}
              participantID={participants._id}
              participants={participants}
              skills={getParticipantSkills(participants._id, participantSkills)}
              tools={getParticipantTools(participants._id, participantTools)}
              challenges={getParticipantChallenges(participants._id, participantChallenges)}
              teams={getParticipantTeams(participants._id, teamParticipants)}
            />)}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default ListParticipantsWidgetAdmin;
