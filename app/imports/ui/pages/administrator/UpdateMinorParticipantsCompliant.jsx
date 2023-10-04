import React from 'react';
import { Card, Container } from 'react-bootstrap';
import _ from 'underscore';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import UpdateMinorParticipantsWidget from '../../components/administrator/UpdateMinorParticipantsWidget';

const UpdateMinorParticipantsCompliant = () => {
  const getMinorParticipants = () => {
    const AllMinorParticipants = MinorParticipants._collection.find({}).fetch();
    return AllMinorParticipants;
  };

  const getCFParticipants = () => {
    const CFParticipants = Participants._collection.find({ isCompliant: false }).fetch();
    return CFParticipants;
  };

  const getMinorCFParticipants = () => {
    const CFParticipantsID = _.pluck(getCFParticipants(), '_id');
    const AllMinorParticipantsID = _.pluck(getMinorParticipants(), 'participantID');
    const MinorCFParticipantsID = _.intersection(CFParticipantsID, AllMinorParticipantsID);
    return MinorCFParticipantsID;

  };

  const renderMinorCFParticipants = () => {
    const MinorCFParticipantsID = getMinorCFParticipants();
    if (MinorCFParticipantsID.length === 0) {
      return (
          <Container>
            <Card>
              <Card.Body>
                <Card.Title>
                  <i className="fas fa-birthday-cake"></i> There are no minor participants yet
                </Card.Title>
                <Card.Text>
                  Please check back later.
                </Card.Text>
              </Card.Body>
            </Card>
          </Container>
      );
    }

    return <UpdateMinorParticipantsWidget MinorParticipantsID={MinorCFParticipantsID} />;

  };

  return (
      <Container>
       {renderMinorCFParticipants()}
      </Container>
  );
};

export default UpdateMinorParticipantsCompliant;
