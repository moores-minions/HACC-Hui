import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTracker } from 'meteor/react-meteor-data';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { ROUTES } from '../../../startup/client/route-constants';
import SkillsAdminWidget from './SkillsAdminWidget';
import ChallengesAdminWidget from './ChallengesAdminWidget';
import ToolsAdminWidget from './ToolsAdminWidget';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { CanCreateTeams } from '../../../api/team/CanCreateTeamCollection';
import { CanChangeChallenges } from '../../../api/team/CanChangeChallengeCollection';

/**
 * Renders the Page for Managing HACC. **deprecated**
 * @memberOf ui/pages
 */
const ManageHaccWidget = () => {
  const challenges = useTracker(() => Challenges.find({}).fetch());
  const skills = useTracker(() => Skills.find({}).fetch());
  const tools = useTracker(() => Tools.find({}).fetch());

  const [canCreateTeams, setCanCreateTeams] = useState(
    CanCreateTeams.findOne()?.canCreateTeams || false,
  );
  const [canChangeChallenges, setCanChangeChallenges] = useState(
    CanChangeChallenges.findOne()?.canChangeChallenges || false,
  );

  const [sortedtools, setTools] = useState([]);
  const [sortedskills, setSkills] = useState([]);

  const sortTools = (toolsToSort) => toolsToSort.sort((a, b) => {
      const descriptionComparison = a.description.toLowerCase().localeCompare(b.description.toLowerCase());
      if (descriptionComparison !== 0) return descriptionComparison;
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

  const skillCompare = (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  const sortSkills = (skillsToSort) => skillsToSort.sort(skillCompare);

  useEffect(() => {
    setTools(sortTools(tools));
  }, [tools]);

  useEffect(() => {
    setSkills(sortSkills(skills));
  }, [skills]);

  const toggleTeam = () => {
    const doc = CanCreateTeams.findOne();
    const updateData = {
      id: doc._id,
      canCreateTeams: !canCreateTeams,
    };

    const collectionName = CanCreateTeams.getCollectionName();
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error(error);
      }
    });
    setCanCreateTeams(!canCreateTeams);
  };

  const toggleChallenge = () => {
    const doc = CanChangeChallenges.findOne();
    const updateData = {
    id: doc._id,
    canChangeChallenges: !canChangeChallenges,
  };
    const collectionName = CanChangeChallenges.getCollectionName();
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error(error);
      }
    });
    setCanChangeChallenges(!canChangeChallenges);
  };

    return (
        <div id="configureHACCPage" style={{ paddingBottom: '50px' }}>
          <Container>
            <Row className="justify-content-center">
              <Col>
                <div style={{
                  backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
                  borderRadius: '2rem',
                }}>
                  <h3 className="text-center">Manage HACC</h3>

                  <Container>
                    <Row className="justify-content-center">
                      <Col xs="auto">
                        <Form.Check
                          type="switch"
                          id="custom-switch-teams"
                          label="Can Create Teams"
                          checked={canCreateTeams}
                          onChange={toggleTeam}
                        />
                      </Col>
                      <Col xs="auto">
                        <Form.Check
                          type="switch"
                          id="custom-switch-challenges"
                          label="Can Change Challenges"
                          checked={canChangeChallenges}
                          onChange={toggleChallenge}
                        />
                      </Col>
                    </Row>
                  </Container>
                </div>
                <div style={{
                  borderRadius: '1rem',
                  backgroundColor: '#E5F0FE',
                }} className={'teamCreate'}>

                  <h3 className="text-center">Challenges</h3>
                  <Table>
                    <thead>
                    <tr>
                      <th width={2}>Title</th>
                      <th width={5}>Description</th>
                      <th width={2}>Submission Detail</th>
                      <th width={2}>Pitch</th>
                      <th width={2}>Edit</th>
                      <th width={2}>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {challenges.map((challenge => <ChallengesAdminWidget
                        key={challenge._id} challenges={challenge} />
                    ))}
                    </tbody>
                  </Table>
                  <div className="text-center">
                    <Button className="hacc-button" id="add-challenge-button" variant="danger">
                      <Link to={ROUTES.ADD_CHALLENGE} className="white-link">Add Challenge</Link></Button>
                  </div>

                  <h3 className="text-center">Skills</h3>
                  <Table>
                    <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th width={2}>Edit</th>
                      <th width={2}>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedskills.map((skill => <SkillsAdminWidget key={skill._id} skills={skill} />))}
                    </tbody>
                  </Table>
                  <div className="text-center">
                    <Button className="hacc-button" id="add-skill-button" variant="danger">
                      <Link to={ROUTES.ADD_SKILL} className="white-link">Add Skill</Link></Button>
                  </div>

                  <h3 className="text-center">Tools</h3>
                  <Table>
                    <thead>
                    <tr>
                      <th width={2}>Name</th>
                      <th width={2}>Description</th>
                      <th width={2}>Edit</th>
                      <th width={2}>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedtools.map((tool => <ToolsAdminWidget key={tool._id} tools={tool} />))}
                    </tbody>
                  </Table>
                  <div className="text-center">
                    <Button className="hacc-button" id="add-tool-button" variant="danger">
                      <Link to={ROUTES.ADD_TOOL} className="white-link">Add Tool</Link></Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
    );
};

ManageHaccWidget.propTypes = {
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
};

export default ManageHaccWidget;
