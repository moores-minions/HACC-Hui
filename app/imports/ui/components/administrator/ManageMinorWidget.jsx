import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import ListMinorWidget from './ListMinorWidget';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';

/**
 * Renders the Page for Managing HACC. **deprecated**
 * @memberOf ui/pages
 */
const ManageMinorWidget = () => (
      <div style={{ backgroundColor: '#C4C4C4', paddingBottom: '50px' }}>
        <Container>
          <Row className="justify-content-center">
            <Col>
            <Card
              className="text-center"
              style={{ backgroundColor: '#393B44', margin: '2rem 0', borderRadius: '2rem' }}
              >
                <Card.Body>
                  <Card.Title style={{ color: 'white' }}>Minor Participant</Card.Title>
                  <Card.Text style={{ color: 'white', fontSize: '1.5rem' }}>
                    {this.props.minorParticipants.length}
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card className="text-center" style={{ borderRadius: '1rem', backgroundColor: '#393B44' }}>
                <Card.Header style={{ color: 'white' }}>Information</Card.Header>
                <Card.Body>
                  <Table bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th style={{ width: '15%' }}>Username</th>
                        <th style={{ width: '25%' }}>Parent/Guardian: FirstName</th>
                        <th style={{ width: '25%' }}>Parent/Guardian: LastName</th>
                        <th style={{ width: '25%' }}>Parent/Guardian: Email</th>
                        <th style={{ width: '5%' }}>Approve</th>
                        <th style={{ width: '5%' }}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.minorParticipants.map((minorParticipants) => (
                        <ListMinorWidget key={minorParticipants._id} minorParticipants={minorParticipants} />
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

            </Col>
          </Row>
        </Container>
      </div>
    );

ManageMinorWidget.propTypes = {
  minorParticipants: PropTypes.array.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const mps = MinorParticipants.find({}).fetch();
  const minorParticipants = [];
  mps.forEach((m) => {
    const result = m;
    result.username = Participants.findDoc(m.participantID).username;
    minorParticipants.push(result);
  });
  console.log(minorParticipants);
  return {
    minorParticipants,
  };
})(ManageMinorWidget);
