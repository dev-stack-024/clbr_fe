import React, { useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './LandingPage.css'; // Optional, for additional styling
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {

    const { isAuthenticated, user } = useContext(AuthContext); 
    const navigate = useNavigate(); 

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/map'); 
        } else {
            navigate('/login');
        }
    };

    // console.log(user)
    return (
        <div className="landing-page">
            <div className="hero-section text-center">
                {!isAuthenticated ? <Container>
                    <Row className="align-items-center" style={{ height: "230px" }}>
                        <Col md={6}>
                            <h1 className="display-8">Discover & Review Local Businesses</h1>
                            <p className="lead">Share your experiences, explore top-rated businesses, and support your local community.</p>
                            <Button variant="primary" href="/register" className="mx-2">Sign Up</Button>
                            <Button variant="outline-primary" href="/login" className="mx-2">Log In</Button>
                        </Col>

                    </Row>
                </Container> : <>
                    <Container>
                        <Row className="align-items-center" style={{ height: "200px" }}>
                            <Col md={12}>
                                <h1 className="display-4">Welcome, {user.user.name}!</h1>
                                <p className="lead">Together, let's celebrate our local gems and make informed choices. Your community awaits!</p>
                            </Col>
                        </Row>
                    </Container>
                </>}
            </div>

            <div className="features-section py-4">
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