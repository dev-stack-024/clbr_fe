import React, { useContext } from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import './LandingPage.css'; // Optional, for additional styling
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {

    const { isAuthenticated } = useContext(AuthContext); // Get authentication state
    const navigate = useNavigate(); // Hook to programmatically navigate

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/map'); // If logged in, go to map page
        } else {
            navigate('/login'); // If not logged in, go to login page
        }
    };
    return (
        <div className="landing-page">
            <div className="hero-section text-center">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h1 className="display-4">Discover & Review Local Businesses</h1>
                            <p className="lead">Share your experiences, explore top-rated businesses, and support your local community.</p>
                            <Button variant="primary" href="/register" className="mx-2">Sign Up</Button>
                            <Button variant="outline-primary" href="/login" className="mx-2">Log In</Button>
                        </Col>
                        <Col md={6}>
                            {/* <Image src="" fluid alt="Community business reviews" /> */}
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="features-section py-5">
                <Container>
                    <Row>
                        <Col md={4} className="text-center">
                            <i className="bi bi-star-fill" style={{ fontSize: '3rem', color: '#f0ad4e' }}></i>
                            <h3>Rate & Review</h3>
                            <p>Share your ratings and reviews to help others discover great local spots.</p>
                        </Col>
                        <Col md={4} className="text-center">
                            <i className="bi bi-geo-alt-fill" style={{ fontSize: '3rem', color: '#0275d8' }}></i>
                            <h3>Find Local Businesses</h3>
                            <p>Search for businesses by category, rating, distance, and more using our interactive map.</p>
                        </Col>
                        <Col md={4} className="text-center">
                            <i className="bi bi-heart-fill" style={{ fontSize: '3rem', color: '#d9534f' }}></i>
                            <h3>Support Your Community</h3>
                            <p>Promote local businesses and share the love by adding them to your favorites.</p>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="cta-section bg-light pb-5">
                <Container className="text-center">
                    <h2>Join the Community</h2>
                    <p className="lead">Sign up today to start sharing reviews and supporting local businesses.</p>
                    <Button variant="success" onClick={handleGetStarted}>Get Started</Button>
                </Container>
            </div>
        </div>
    );
};

export default LandingPage;