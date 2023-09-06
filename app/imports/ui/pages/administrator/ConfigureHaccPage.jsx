import React from 'react';
import { Container } from 'react-bootstrap';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ManageHaccWidget from '../../components/administrator/ManageHaccWidget';

class ConfigureHaccPage extends React.Component {
  render() {
    return (
      <Container id="configurePage" >
        <ManageHaccWidget />
      </Container>
        );
  }
}

export default withAllSubscriptions(ConfigureHaccPage);
