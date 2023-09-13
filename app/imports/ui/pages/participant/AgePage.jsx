import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Button, Row } from 'react-bootstrap';
import { ROUTES } from '../../../startup/client/route-constants';

/**
 * A component to verify if user is at least 18 years old.
 * @memberOf ui/pages
 */
const AgePage = () => (
  <Container fluid id='age-page' className='agePage'>
    <Row align='center'>
      <h2 style={{ padding: '5rem 10rem 5rem 10rem' }}>
        Before we move onto making your profile, we need to verify your age.
        <br/>
        Are you 18 or over?
        <br/>
        <Button as={NavLink} exact to={ROUTES.PARTICIPATION} size='lg'>Yes, I am.</Button>
        <br/>
        <Button as={NavLink} exact to={ROUTES.UNDERAGE_PARTICIPATION} size='lg'>No, I am not.</Button>
      </h2>
    </Row>
  </Container>
);

export default AgePage;
