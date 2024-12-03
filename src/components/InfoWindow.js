
import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Form, Button, Card, Image } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import defaultProfilePictureUrl from "../assets/defaultAvatar.jpg"
import { useLocation } from 'react-router-dom';
import { fetchBusinessesById } from '../services/businessService';

const InfoWindowContent = ({ selectedBusiness }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [hover, setHover] = useState(0);
    const [business, setBusiness] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newReviewText, setNewReviewText] = useState('');

    useEffect(() => {
        getBusinessById()
        fetchReviews();
    }, []);


    const getBusinessById = async () => {
        setLoading(true);
        try {
            const response = await fetchBusinessesById(selectedBusiness._id, user.token);
            console.log(response, "res")
            setBusiness(response);
        } catch (error) {
            console.error("Error fetching business:", error);
        } finally {
            setLoading(false);
        }
    };


    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/${selectedBusiness._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                }
            });
            setReviews(response.data.reviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };


    const handleAddReview = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/add-review`, {
                businessId: business._id,
                reviewText: newReviewText
            }, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });
            setReviews([...reviews, response.data.review]);
            setNewReviewText('');
            await fetchReviews();
        } catch (error) {
            console.error("Error adding review:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRatingSubmit = async (selectedRating) => {
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/rate/business`, {
                businessId: business._id,
                rating: selectedRating,
            }, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });

            setBusiness(prev => ({
                ...prev,
                rating: selectedRating,
                ownRating: selectedRating
            }));
            await getBusinessById();
        } catch (error) {
            console.error("Error submitting rating:", error);
        } finally {
            setLoading(false);
        }
    };


    const styles = {
        card: {
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            backgroundColor: '#ffffff',
            maxWidth: '800px',
            margin: '0 auto'
        },
        heading: {
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#333333'
        },
        sectionHeading: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '15px',
            color: '#444444'
        },
        text: {
            fontSize: '14px',
            color: '#666666',
            lineHeight: '1.5'
        },
        label: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#555555',
            marginBottom: '2px'
        },
        image: {
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '15px'
        },
        star: {
            cursor: 'pointer',
            fontSize: '20px',
            marginRight: '5px'
        },
        filledStar: {
            color: '#ffc107'
        },
        emptyStar: {
            color: '#e4e5e9'
        },
        reviewCard: {
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            marginBottom: '2px'
        }
    };

    console.log();

    return (
        <>
            {!loading ? (
                <Card style={styles.card}>
                    <Card.Body className="p-4">

                        <h2 style={styles.heading}>{business.name}</h2>


                        <Row className="mb-4">
                            {business.images && business.images.length > 0 ? (
                                business.images.map((imageUrl, index) => (
                                    <Col key={index} xs={6}>
                                        <img
                                            src={imageUrl}
                                            alt={`${business.name} ${index + 1}`}
                                            style={styles.image}
                                        />
                                    </Col>
                                ))
                            ) : (
                                <Col>
                                    <p style={styles.text}>No images available</p>
                                </Col>
                            )}
                        </Row>


                        <div className="mb-4">
                            <p style={styles.text}>{business.description}</p>
                        </div>


                        <div className="mb-4">
                            <p style={styles.text}>
                                <span style={styles.label}>Address:</span> {business.address}
                            </p>
                            <p style={styles.text}>
                                <span style={styles.label}>Coordinates:</span> ({business.location?.coordinates[1]}, {business.location?.coordinates[0]})
                            </p>
                        </div>

                        {loading && business ? <>Loading...</> :
                            <Row className="mb-4">
                                <Col md={6}>
                                    <p style={styles.label}>Average Rating</p>
                                    <div className="d-flex align-items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                style={{
                                                    ...styles.star,
                                                    ...(star <= business.averageRating ? styles.filledStar : styles.emptyStar)
                                                }}
                                            />
                                        ))}
                                        <span style={styles.text} className="ms-2">
                                            ({business?.averageRating?.toFixed(1)})
                                        </span>
                                    </div>
                                </Col>
                                {!location.pathname.includes('my-location') && <Col md={6}>
                                    <p style={styles.label}>Your Rating</p>
                                    <div className="d-flex align-items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                style={{
                                                    ...styles.star,
                                                    ...(star <= (hover || business.ownRating) ? styles.filledStar : styles.emptyStar)
                                                }}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                                onClick={() => !loading && handleRatingSubmit(star)}
                                            />
                                        ))}
                                    </div>
                                </Col>}
                            </Row>
                        }

                        {!location.pathname.includes('my-location') && <div className="mb-4">
                            <h3 style={styles.sectionHeading}>Add a Review</h3>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Write your review here..."
                                    value={newReviewText}
                                    onChange={(e) => setNewReviewText(e.target.value)}
                                    style={styles.text}
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                onClick={handleAddReview}
                                disabled={loading}
                                className="w-100"
                            >
                                {loading ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>}

                        {loading && business ? <>Loading...</> :
                            <div>
                                <h3 style={styles.sectionHeading}>Reviews</h3>
                                {reviews.length > 0 ? (
                                    reviews.map((review, index) => (
                                        <div key={index} style={styles.reviewCard}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: "10px", paddingTop: "8px" }}>
                                                <Image
                                                    src={review.userDetails.profilePictureURL || defaultProfilePictureUrl}
                                                    roundedCircle
                                                    width={30}
                                                    height={30}
                                                    alt="User Profile"
                                                    style={{ marginRight: '10px' }}
                                                />
                                                <div>
                                                    <p style={styles.label}>{review.userDetails.name}</p>
                                                    <p style={styles.text}>{review.reviewText}</p>
                                                    <div className="d-flex align-items-center" style={{ marginBlock: "-12px 8px" }}>
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <FaStar
                                                                key={star}
                                                                style={{
                                                                    fontSize: '12px',
                                                                    color: star <= review.rating ? '#ffc107' : '#e4e5e9'
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={styles.text}>No reviews available</p>
                                )}
                            </div>
                        }
                    </Card.Body>

                </Card>

            ) : <>Loading...</>}
        </>
    );
};

export default InfoWindowContent;