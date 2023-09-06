import React from 'react';
import { Container } from 'react-bootstrap';

/**
 * Render a Not Found page if the user enters a URL that doesn't match any route.
 * @memberOf ui/pages
 */
const NotFound = () => (
    <Container id='notfound-page' fluid className='NotFoundPage'>
      <h2 className="text-center">Page not found</h2>
    </Container>
);

export default NotFound;
