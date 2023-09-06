import React from 'react';
import { Container } from 'react-bootstrap';

/**
 * Render a Not Found page if the user enters a URL that doesn't match any route.
 * @memberOf ui/pages
 */
class NotFound extends React.Component {
  render() {
    return (
      <Container fluid>
        <h2 className="text-center">Page not found</h2>
      </Container>
    );
  }
}

export default NotFound;
