import React from 'react';
import { Container } from 'react-bootstrap';
import _ from 'underscore';
import * as Icon from 'react-bootstrap-icons';
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

  const MinorCFParticipantsID = getMinorCFParticipants();
  if (MinorCFParticipantsID.length === 0) {
    return (
      <Container id='no-suggestions' fluid>
        <h4 className='text-center'>
          <Icon.PeopleFill />
          {' '}
          There are no minor participants yet.
          <h5>
            Please check back later.
          </h5>
        </h4>
      </Container>
    );
  }

  return <UpdateMinorParticipantsWidget MinorParticipantsID={MinorCFParticipantsID}/>;
};

export default UpdateMinorParticipantsCompliant;
