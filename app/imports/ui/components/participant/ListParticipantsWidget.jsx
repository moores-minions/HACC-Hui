import React from 'react';
import { Container, Row, Col, Card, Form, Header } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenge } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import ListParticipantsCard from './ListParticipantsCard';
import ListParticipantsFilter from './ListParticipantsFilter';

class ListParticipantsWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      challenges: [],
      teams: [],
      tools: [],
      skills: [],
      result: _.orderBy(this.props.participants, ['name'], ['asc']),
    };
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */

  render() {
    if (this.props.participants.length === 0) {
      return (
        <div style="text-align: center;">
          <Header as="h2" icon>
            There are no participants at the moment.
            <Header.Subheader>Please check back later.</Header.Subheader>
          </Header>
        </div>
      );
    }

    const sticky = {
      position1: '-webkit-sticky',
      position: 'sticky',
      top: '6.5rem',
    };

    const filters = new ListParticipantsFilter();

    const setFilters = () => {
      const searchResults = filters.filterBySearch(
        this.props.participants,
        this.state.search,
      );
      const skillResults = filters.filterBySkills(
        this.state.skills,
        this.props.skills,
        this.props.participantSkills,
        searchResults,
      );
      const toolResults = filters.filterByTools(
        this.state.tools,
        this.props.tools,
        this.props.participantTools,
        skillResults,
      );
      const challengeResults = filters.filterByChallenge(
        this.state.challenges,
        this.props.challenges,
        this.props.participantChallenges,
        toolResults,
      );
      const sorted = filters.sortBy(challengeResults, 'participants');
      this.setState(
        {
          result: sorted,
        },
        () => {},
      );
    };

    const handleSearchChange = (event) => {
      this.setState(
        {
          search: event.target.value,
        },
        () => {
          setFilters();
        },
      );
    };

    const getSkills = (event, { value }) => {
      this.setState(
        {
          skills: value,
        },
        () => {
          setFilters();
        },
      );
    };

    const getTools = (event, { value }) => {
      this.setState(
        {
          tools: value,
        },
        () => {
          setFilters();
        },
      );
    };

    const getChallenge = (event, { value }) => {
      this.setState(
        {
          challenges: value,
        },
        () => {
          setFilters();
        },
      );
    };

    const getTeam = (event, { value }) => {
      this.setState(
        {
          teams: value,
        },
        () => {
          setFilters();
        },
      );
    };

    const universalSkills = this.props.skills;

    function getParticipantSkills(participantID, participantSkills) {
      const data = [];
      const skills = _.filter(participantSkills, {
        participantID: participantID,
      });
      for (let i = 0; i < skills.length; i++) {
        for (let j = 0; j < universalSkills.length; j++) {
          if (skills[i].skillID === universalSkills[j]._id) {
            data.push({ name: universalSkills[j].name });
          }
        }
      }
      // console.log(data);
      return data;
    }

    const universalTools = this.props.tools;

    function getParticipantTools(participantID, participantTools) {
      const data = [];
      const tools = _.filter(participantTools, {
        participantID: participantID,
      });
      for (let i = 0; i < tools.length; i++) {
        for (let j = 0; j < universalTools.length; j++) {
          if (tools[i].toolID === universalTools[j]._id) {
            data.push({ name: universalTools[j].name });
          }
        }
      }
      return data;
    }

    const universalChallenges = this.props.challenges;

    function getParticipantChallenges(participantID, participantChallenges) {
      const data = [];
      const challenges = _.filter(participantChallenges, {
        participantID: participantID,
      });
      for (let i = 0; i < challenges.length; i++) {
        for (let j = 0; j < universalChallenges.length; j++) {
          if (challenges[i].challengeID === universalChallenges[j]._id) {
            data.push(universalChallenges[j].title);
          }
        }
      }
      return data;
    }

    return (
      <div style={{ paddingBottom: '50px' }}>
        <Container id="list-participants-page" fluid>
          <Row className="justify-content-center">
            <Col xs={16}>
              <div
                style={{
                  backgroundColor: '#E5F0FE',
                  padding: '1rem 0rem',
                  margin: '2rem 0rem',
                  borderRadius: '2rem',
                }}
              >
                <h2 className="text-center">All Participants</h2>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={4}>
              <Card
                style={{
                  ...sticky,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Card.Body>
                  <div style={{ paddingTop: '2rem' }}>
                    <Card.Title>
                      Total Participants: {this.state.result.length}
                    </Card.Title>
                  </div>
                  <div style={{ paddingTop: '2rem' }}>
                    <Form.Control
                      type="text"
                      placeholder="Search by participants name..."
                      onChange={handleSearchChange}
                    />
                    <div style={{ paddingTop: '2rem' }}>
                      <h4>Teams</h4>
                      {/* Example Dropdown. Update as needed */}
                      <Form.Select onChange={getTeam}>
                        {filters
                          .dropdownValues(this.props.teams, 'name')
                          .map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.text}
                            </option>
                          ))}
                      </Form.Select>
                    </div>
                    <div style={{ paddingTop: '2rem' }}>
                      <h4>Challenges</h4>
                      <Form.Select onChange={getChallenge}>
                        {/* ... similar dropdown structure as above */}
                      </Form.Select>
                    </div>

                    <div style={{ paddingTop: '2rem' }}>
                      <h4>Skills</h4>
                      <Form.Select onChange={getSkills}>
                        {/* ... similar dropdown structure as above */}
                      </Form.Select>
                    </div>

                    <div style={{ paddingTop: '2rem' }}>
                      <h4>Tools</h4>
                      <Form.Select onChange={getTools}>
                        {/* ... similar dropdown structure as above */}
                      </Form.Select>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={8}>
              <div>
                {this.state.result.map((participants) => (
                  <ListParticipantsCard
                    key={participants._id}
                    participantID={participants._id}
                    participants={participants}
                    skills={getParticipantSkills(
                      participants._id,
                      this.props.participantSkills,
                    )}
                    tools={getParticipantTools(
                      participants._id,
                      this.props.participantTools,
                    )}
                    // eslint-disable-next-line max-len
                    challenges={getParticipantChallenges(
                      participants._id,
                      this.props.participantChallenges,
                    )}
                  />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

ListParticipantsWidget.propTypes = {
  participantChallenges: PropTypes.array.isRequired,
  participantSkills: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  participantTools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
};

export default withTracker(() => ({
  participantChallenges: ParticipantChallenges.find({}).fetch(),
  participantSkills: ParticipantSkills.find({}).fetch(),
  participantTools: ParticipantTools.find({}).fetch(),
  teams: Teams.find({ open: true }).fetch(),
  skills: Skills.find({}).fetch(),
  challenges: Challenge.find({}).fetch(),
  tools: Tools.find({}).fetch(),
  participants: Participants.find({}).fetch(),
}))(ListParticipantsWidget);
