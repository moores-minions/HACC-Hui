import React from 'react';
import { Button, Container, Modal, Row, Col } from 'react-bootstrap';
import { ZipZap } from 'meteor/udondan:zipzap';
import { useTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import swal from 'sweetalert';
import { dumpDatabaseMethod, dumpTeamCSVMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenge } from '../../../api/challenge/ChallengeCollection';

export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

/**
 *
 * Downloads a .zip file of the entire database
 * and list of teams
 *
 */
const DumpDatabase = () => {

  const { participants, teams, challenges } = useTracker(() => ({
    participants: Participants.find({}).fetch(),
    teams: Teams.find({}).fetch(),
    challenges: Challenge.find({}).fetch(),
  }));

  const handleClick = () => {
    dumpDatabaseMethod.call((error, result) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        const zip = new ZipZap();
        const dir = 'hacchui-db';
        const fileName = `${dir}/${moment(result.timestamp).format(databaseFileDateFormat)}.json`;
        zip.file(fileName, JSON.stringify(result, null, 2));
        zip.saveAs(`${dir}.zip`);
      }
    });
  };

  const handleDumpTeamCSV = () => {
    dumpTeamCSVMethod.call((error, result) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        const zip = new ZipZap();
        const dir = 'hacchui-teams';
        const fileName = `${dir}/${moment(result.timestamp).format(databaseFileDateFormat)}-teams.txt`;
        zip.file(fileName, result.result);
        zip.saveAs(`${dir}.zip`);
      }
    });
  };

  const removeParticipants = () => {
    swal({
      title: 'Are you sure?',
      text: 'This will remove all participants from HACC-Hui and cannot be undone',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        participants.forEach((participant) => {
          removeItMethod.call({
            collectionName: Participants.getCollectionName(),
            instance: participant._id,
          }, (err) => {
            if (err) {
              swal('Error', err.message, 'error');
            }
          });
        });
        if (Participants.find().fetch().length === 0) {
          swal('Success', 'Removed all participants', 'success');
        }
      }
    });
  };

  const removeTeams = () => {
    swal({
      title: 'Are you sure?',
      text: 'This will remove all teams from HACC-Hui and cannot be undone',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        teams.forEach((team) => {
          removeItMethod.call({
            collectionName: Teams.getCollectionName(),
            instance: team._id,
          }, (err) => {
            if (err) {
              swal('Error', err.message, 'error');
            }
          });
        });
        if (Teams.find().fetch().length === 0) {
          swal('Success', 'Removed all participants', 'success');
        }
      }
    });
  };

  const removeChallenges = () => {
    swal({
      title: 'Are you sure?',
      text: 'This will remove all challenges from HACC-Hui and cannot be undone',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        challenges.forEach((challenge) => {
          removeItMethod.call({
            collectionName: Challenge.getCollectionName(),
            instance: challenge._id,
          }, (err) => {
            if (err) {
              swal('Error', err.message, 'error');
            }
          });
        });
        if (Challenge.find().fetch().length === 0) {
          swal('Success', 'Removed all challenges', 'success');
        }
      }
    });
  };

  return (
    <Container id="dump-page"
               fluid style={{ paddingLeft: 250, paddingRight: 250, paddingTop: 30, paddingBottom: 30 }}>
      <h2 className="text-center" style={{ paddingBottom: 10 }}>
        Download Things
      </h2>
      <p className="text-center">
        Download a .json file of the HACC-HUI databse or download a .txt file of all the registered teams
      </p>
      <div
        className="modal show"
        style={{ display: 'block', position: 'initial' }}
      >
        <Modal.Dialog size={'lg'}>
          <Modal.Body>
            <Row className="justify-content-md-center">
              <Col md={4}>
                <Button id="database-button" onClick={handleClick}>Download HACC-HUI Database</Button>
              </Col>
              <Col md={{ span: 3, offset: 3 }}>
                <Button id="teams-button" onClick={handleDumpTeamCSV}>Download List of Teams</Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal.Dialog>
      </div>
      <h2 className="text-center" style={{ paddingBottom: 10 }}>
        Reset Database
      </h2>
      <p className="text-center">
        <b>PERMANENTLY</b> remove all participants, teams, and challenges
      </p>
      <div
        style={{ display: 'block', position: 'initial' }}
      >
        <Row className='text-center mb-3'>
          <Col>
            <Button variant='danger' id='remove-participants'
                    onClick={removeParticipants}>Remove participants</Button>
          </Col>
        </Row>
        <Row className='text-center mb-3'>
          <Col>
            <Button variant='danger' id='remove-teams'
                    onClick={removeTeams}>Remove teams</Button>
          </Col>
        </Row>
        <Row className='text-center mb-3'>
          <Col>
            <Button variant='danger' id='remove-challenges'
                    onClick={removeChallenges}>Remove challenges</Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default DumpDatabase;
