import React from 'react';
import BusinessCard from '../components/BusinessCard';
import { Container, Row, Col } from 'react-bootstrap';

const businesses = [
  {
    id: 1,
    name: 'The Coffee Shop',
    description: 'Best coffee in town!',
    image: '/images/coffee-shop.jpg',
  },
  {
    id: 2,
    name: 'Best Burgers',
    description: 'Delicious burgers made fresh.',
    image: '/images/burger-shop.jpg',
  },
];

const Home = () => {
  return (
    <Container>
      <h1 className="my-5">Top Rated Businesses</h1>
      <Row>
        {businesses.map((business) => (
          <Col key={business.id} md={4}>
            <BusinessCard business={business} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
