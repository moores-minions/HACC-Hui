import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { Grid, Header, Checkbox, Button, Table } from 'semantic-ui-react';
import { Button, Container, Table, ToggleButton } from 'react-bootstrap';
import _ from 'underscore';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import { Participants } from '../../../api/user/ParticipantCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { ROUTES } from '../../../startup/client/route-constants';
import { databaseFileDateFormat } from '../../pages/administrator/DumpDatabase';

const UpdateMinorParticipantsWidget = ({ MinorParticipantsID }) => {

  const [selected, setSelected] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [checked, setChecked] = useState(false);

  const getMinorParticipants = () => {
    const MinorParticipantsList = [];
    let MinorParticipant = {};
    _.each(MinorParticipantsID, function (ParticipantsID) {
      MinorParticipant = Participants._collection.findOne({ _id: ParticipantsID });
      const MinorP = MinorParticipants._collection.findOne({ participantID: ParticipantsID });
      const ParentName = `${MinorP.parentFirstName} ${MinorP.parentLastName} (${MinorP.parentEmail})`;
      MinorParticipant.ParentName = ParentName;
      MinorParticipantsList.push(MinorParticipant);
    });
    return MinorParticipantsList;
  };

  const renderMinorParticipants = () => {

    const checkBoxFun = {};
    const allMPs = MinorParticipantsID;
    allMPs.forEach((MP) => {
      checkBoxFun[MP] = () => {
        if (!checked) setSelected([...selected, MP]);
        // eslint-disable-next-line eqeqeq
        else setSelected(() => selected.filter((minor) => minor != MP));
      };
    });
    const minorParticipantsList = getMinorParticipants();
    return minorParticipantsList.map((p) => (<tr key={p._id}>
      <td>{`${p.firstName} ${p.lastName}`}</td>
      <td>{p.ParentName}</td>
      <td><ToggleButton id={p._id} value={p._id} type='checkbox'
                        checked={checked} onChange={(evt) => {
        setChecked(evt.currentTarget.checked);
        checkBoxFun[p._id]();
      }}/></td>
    </tr>));
  };

  const download = () => {
    const minors = getMinorParticipants();
    let csv = 'Minor Participant Name, Participant email, Parent/Guardian Name (Parent/Guardian email)\n';
    minors.forEach((m) => {
      csv = `${csv}${m.firstName} ${m.lastName},${m.username},${m.ParentName}\n`;
    });
    const zip = new ZipZap();
    const dir = 'hacchui-minor-participants';
    const fileName = `${dir}/${moment().format(databaseFileDateFormat)}-minor-participants.csv`;
    zip.file(fileName, csv);
    zip.saveAs(`${dir}.zip`);

  };

  const submitData = () => {
    selected.forEach((MP => {
      const collectionName = Participants.getCollectionName();
      const updateData = {
        id: MP,
        isCompliant: true,
      };

      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Updated successfully', 'success');
          setRedirect(true);
        }
      });
    }));
  };

  if (redirect) {
    const from = { pathname: ROUTES.LANDING };
    return <Redirect to={from}/>;
  }
  return (
    <Container style={{ paddingBottom: '50px' }}>
      <div className='text-center' style={{
        backgroundColor: '#E5F0FE', padding: '1rem 0rem', margin: '2rem 0rem',
        borderRadius: '2rem',
      }}>
        <h4 className='text-center'>Minor Participants List ({MinorParticipantsID.length})</h4>
        <Button variant='success' onClick={() => download()}>Download minor participants</Button>
      </div>
      <div style={{
        borderRadius: '1rem',
        backgroundColor: '#E5F0FE',
      }}>
        <Table className='text-center'>
          <thead>
          <tr>
            <th>Minor Participant Name</th>
            <th>Parent Name (Email)</th>
            <th>Compliant</th>
          </tr>
          </thead>
          <tbody>{renderMinorParticipants()}</tbody>
        </Table>
        <div className='text-center'>
          <Button style={{
            color: 'white', backgroundColor: '#DB2828',
            margin: '2rem 0rem',
          }} onClick={() => submitData()}>Submit</Button>
        </div>
      </div>
    </Container>
  );
};

UpdateMinorParticipantsWidget.propTypes = {
  MinorParticipantsID: PropTypes.arrayOf(
    PropTypes.string,
  ),
};

export default UpdateMinorParticipantsWidget;
