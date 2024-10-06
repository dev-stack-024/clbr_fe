import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';


const BusinessDetails = () => {
  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <img
            src="/images/coffee-shop.jpg"
            alt="Business"
            style={{ width: '100%' }}
          />
        </Col>
        <Col md={6}>
          <h1>The Coffee Shop</h1>
          <p>Best coffee in town!</p>
        </Col>
      </Row>
    </Container>
  );
};

export default BusinessDetails;
