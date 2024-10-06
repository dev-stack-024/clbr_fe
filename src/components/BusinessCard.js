import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BusinessCard = ({ business }) => {
  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Img variant="top" src={business.image} />
      <Card.Body>
        <Card.Title>{business.name}</Card.Title>
        <Card.Text>{business.description}</Card.Text>
        <Link to={`/business/${business.id}`}>
          <Button variant="primary">View Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default BusinessCard;
