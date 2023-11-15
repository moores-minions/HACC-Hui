import React from 'react';
import { Button, Container, Modal, Row, Col } from 'react-bootstrap';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import swal from 'sweetalert';

/**
 *
 * Downloads a .zip file of the entire database
 * and list of teams
 *
 */

import { dumpDatabaseMethod, dumpTeamCSVMethod } from '../../../api/base/BaseCollection.methods';

export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

class DumpDatabase extends React.Component {
  handleClick() {
    dumpDatabaseMethod.call((error, result) => {
      if (error) {
        console.error('Problem dumping database.', error);
      } else {
        const zip = new ZipZap();
        const dir = 'hacchui-db';
        const fileName = `${dir}/${moment(result.timestamp).format(databaseFileDateFormat)}.json`;
        zip.file(fileName, JSON.stringify(result, null, 2));
        zip.saveAs(`${dir}.zip`);
      }
    });
  }

  handleDumpTeamCSV() {
    dumpTeamCSVMethod.call((error, result) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        // console.log(result);
        const zip = new ZipZap();
        const dir = 'hacchui-teams';
        const fileName = `${dir}/${moment(result.timestamp).format(databaseFileDateFormat)}-teams.txt`;
        zip.file(fileName, result.result);
        zip.saveAs(`${dir}.zip`);
      }
    });
  }

  render() {
    return (
      <Container id="dump-page"
                 fluid style={ { paddingLeft: 250, paddingRight: 250, paddingTop: 30, paddingBottom: 30 } }>
        <h2 className="text-center" style={ { paddingBottom: 10 } }>
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
      <Button id="database-button" positive={true} onClick={this.handleClick}>Download HACC-HUI Database</Button>
              </Col>
              <Col md={{ span: 3, offset: 3 }}>
      <Button id="teams-button" positive={true} onClick={this.handleDumpTeamCSV}>Download List of Teams</Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal.Dialog>
        </div>
    </Container>
    );
  }
}

export default DumpDatabase;
