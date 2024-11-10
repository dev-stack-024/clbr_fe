/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useContext, useEffect } from 'react';
// import { Row, Col, Form, Button, Card } from 'react-bootstrap';
// import { FaStar } from 'react-icons/fa';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// const InfoWindowContent = ({ selectedBusiness, fetchBusinesses }) => {
//     const { user } = useContext(AuthContext);
//     const [hover, setHover] = useState(0);
//     const [businesses, setBusinesses] = useState(selectedBusiness);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [reviews, setReviews] = useState([]);
//     const [newReviewText, setNewReviewText] = useState('');


//     useEffect(() => {
//         setBusinesses(selectedBusiness);
//         fetchReviews();
//     }, [selectedBusiness]);

//     const fetchReviews = async () => {
//         try {
//             const response = await axios.get(`http://localhost:8080/api/reviews/${selectedBusiness._id}`,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${user.token}`,
//                         'Content-Type': 'application/json',
//                     }
//                 }
//             );
//             setReviews(response.data.reviews);
//         } catch (error) {
//             console.error("Error fetching reviews:", error);
//         }
//     };


//     const handleAddReview = async () => {

//         setIsSubmitting(true);
//         try {
//             const response = await axios.post('http://localhost:8080/api/reviews/add-review', {
//                 businessId: businesses._id,
//                 reviewText: newReviewText
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${user.token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             setReviews([...reviews, response.data.review]); // Add new review to list
//             setNewReviewText('');
//         } catch (error) {
//             console.error("Error adding review:", error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleRatingSubmit = async (selectedRating) => {
//         setIsSubmitting(true);
//         try {
//             console.log('Submitting rating:', businesses._id, selectedRating);
//             await axios.post('http://localhost:8080/api/rate/business', {
//                 businessId: businesses._id,
//                 rating: selectedRating,
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${user.token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//             fetchBusinesses()

//         } catch (error) {
//             console.error("Error submitting rating:", error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const styles = {
//         infoWindow: {
//             fontFamily: 'Arial, sans-serif',
//             padding: '10px',
//         },
//         businessName: {
//             fontSize: '18px',
//             fontWeight: 'bold',
//             marginBottom: '10px',
//         },
//         imageContainer: {
//             marginBottom: '10px',
//         },
//         businessImage: {
//             width: '100%',
//             height: 'auto',
//             borderRadius: '8px',
//         },
//         description: {
//             fontSize: '14px',
//             marginBottom: '5px',
//         },
//         details: {
//             fontSize: '13px',
//         },
//         detailItem: {
//             margin: '5px 0',
//         },
//         detailLabel: {
//             color: '#333',
//             fontWeight: 'bold',
//         },
//         ratingContainer: {
//             display: 'flex',
//             justifyContent: "space-around",
//             alignItems: 'center',
//             marginTop: '10px',
//         },
//         star: {
//             cursor: 'pointer',
//             color: '#e4e5e9',
//             fontSize: '20px',
//             marginRight: '5px',
//         },
//         filledStar: {
//             color: '#ffc107',
//         },
//     };

//     return (
//         <div style={styles.infoWindow}>
//             <h3 style={styles.businessName}>{businesses.name}</h3>

//             <div style={styles.imageContainer}>
//                 <Row>
//                     {businesses.images && businesses.images.length > 0 ? (
//                         businesses.images.map((imageUrl, index) => (
//                             <Col key={index} xs={6}>
//                                 <img
//                                     src={imageUrl}
//                                     alt={`${businesses.name} ${index}`}
//                                     style={styles.businessImage}
//                                 />
//                             </Col>
//                         ))
//                     ) : (
//                         <p>No images available</p>
//                     )}
//                 </Row>
//             </div>

//             <p style={styles.description}>{businesses.description}</p>
//             {/* <div style={styles.details}>
//                 <p style={styles.detailItem}>
//                     <span style={styles.detailLabel}>Address:</span> {businesses.address}
//                 </p>
//                 <p style={styles.detailItem}>
//                     <span style={styles.detailLabel}>Latitude:</span> {businesses.location.coordinates[1]}
//                 </p>
//                 <p style={styles.detailItem}>
//                     <span style={styles.detailLabel}>Longitude:</span> {businesses.location.coordinates[0]}
//                 </p>
//             </div> */}

//             <div style={styles.details}>
//                 <p><strong>Address:</strong> {businesses.address}</p>
//                 <p><strong>Coordinates:</strong> ({businesses.location.coordinates[1]}, {businesses.location.coordinates[0]})</p>
//             </div>

//             <div style={styles.ratingContainer}>
//                 <div>
//                     <p style={styles.detailLabel}>Average Rating:</p>
//                     <div style={{ display: "flex", alignItems: 'center' }}>
//                         <div style={{ display: 'flex', alignItems: 'center' }}>
//                             {[1, 2, 3, 4, 5].map((star) => (
//                                 <FaStar
//                                     key={star}
//                                     style={{ ...styles.star, ...(star <= businesses.averageRating ? styles.filledStar : {}) }}
//                                 />
//                             ))}
//                             <p style={{ marginBottom: "-2px" }}>({businesses.averageRating.toFixed(1)})</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div>
//                     <p style={styles.detailLabel}>Your Rating:</p>
//                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                         {[1, 2, 3, 4, 5].map((star) => (
//                             <FaStar
//                                 key={star}
//                                 style={{ ...styles.star, ...(star <= (hover || businesses.ownRating) ? styles.filledStar : {}) }}
//                                 onMouseEnter={() => setHover(star)}
//                                 onMouseLeave={() => setHover(0)}
//                                 onClick={() => handleRatingSubmit(star)}
//                                 disabled={isSubmitting}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {isSubmitting && <p>Submitting your rating...</p>}



//             {/* Add New Review Section */}
//             <div className="mt-4">
//                 <h5>Add a Review</h5>
//                 <Form.Group>
//                     <Form.Control
//                         as="textarea"
//                         rows={3}
//                         placeholder="Write your review here..."
//                         value={newReviewText}
//                         onChange={(e) => setNewReviewText(e.target.value)}
//                         className="mb-2"
//                     />
//                 </Form.Group>
//                 <Button
//                     variant="primary"
//                     onClick={handleAddReview}
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting ? "Submitting..." : "Submit Review"}
//                 </Button>
//             </div>

//             {/* Display Reviews */}
//             <div className="mt-4">
//                 <h5>Reviews</h5>
//                 {reviews.length > 0 ? (
//                     reviews.map((review, index) => (
//                         <Card key={index} className="mb-3 p-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
//                             <Card.Body>
//                                 <div style={styles.reviewAuthor}>{review.user.name}</div>
//                                 <p style={styles.reviewText}>{review.reviewText}</p>
//                             </Card.Body>
//                         </Card>
//                     ))
//                 ) : (
//                     <p>No reviews available</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default InfoWindowContent;





import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const InfoWindowContent = ({ selectedBusiness, fetchBusinesses }) => {
    const { user } = useContext(AuthContext);
    const [hover, setHover] = useState(0);
    const [businesses, setBusinesses] = useState(selectedBusiness);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newReviewText, setNewReviewText] = useState('');

    useEffect(() => {
        setBusinesses(selectedBusiness);
        fetchReviews();
    }, [selectedBusiness]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reviews/${selectedBusiness._id}`, {
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
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:8080/api/reviews/add-review', {
                businessId: businesses._id,
                reviewText: newReviewText
            }, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });
            setReviews([...reviews, response.data.review]);
            setNewReviewText('');
        } catch (error) {
            console.error("Error adding review:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRatingSubmit = async (selectedRating) => {
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:8080/api/rate/business', {
                businessId: businesses._id,
                rating: selectedRating,
            }, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });
            fetchBusinesses();
            selectedBusiness.rating = selectedRating
            fetchReviews();
        } catch (error) {
            console.error("Error submitting rating:", error);
        } finally {
            setIsSubmitting(false);
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
            marginBottom: '5px'
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
        }
    };

    return (
        <Card style={styles.card}>
            <Card.Body className="p-4">
                {/* Business Name */}
                <h2 style={styles.heading}>{businesses.name}</h2>

                {/* Images */}
                <Row className="mb-4">
                    {businesses.images && businesses.images.length > 0 ? (
                        businesses.images.map((imageUrl, index) => (
                            <Col key={index} xs={6}>
                                <img
                                    src={imageUrl}
                                    alt={`${businesses.name} ${index + 1}`}
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

                {/* Description */}
                <div className="mb-4">
                    <p style={styles.text}>{businesses.description}</p>
                </div>

                {/* Location Details */}
                <div className="mb-4">
                    <p style={styles.text}>
                        <span style={styles.label}>Address:</span> {businesses.address}
                    </p>
                    <p style={styles.text}>
                        <span style={styles.label}>Coordinates:</span> ({businesses.location.coordinates[1]}, {businesses.location.coordinates[0]})
                    </p>
                </div>

                {/* Ratings Section */}
                <Row className="mb-4">
                    <Col md={6}>
                        <p style={styles.label}>Average Rating</p>
                        <div className="d-flex align-items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    style={{
                                        ...styles.star,
                                        ...(star <= businesses.averageRating ? styles.filledStar : styles.emptyStar)
                                    }}
                                />
                            ))}
                            <span style={styles.text} className="ms-2">
                                ({businesses?.averageRating?.toFixed(1)})
                            </span>
                        </div>
                    </Col>
                    <Col md={6}>
                        <p style={styles.label}>Your Rating</p>
                        <div className="d-flex align-items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    style={{
                                        ...styles.star,
                                        ...(star <= (hover || businesses.ownRating) ? styles.filledStar : styles.emptyStar)
                                    }}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => !isSubmitting && handleRatingSubmit(star)}
                                />
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* Add Review Section */}
                <div className="mb-4">
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
                        disabled={isSubmitting}
                        className="w-100"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </div>

                {/* Reviews Section */}
                <div>
                    <h3 style={styles.sectionHeading}>Reviews</h3>
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <Card key={index} style={styles.reviewCard}>
                                <Card.Body>
                                    <p style={styles.label}>{review.user.name}</p>
                                    <p style={styles.text}>{review.reviewText}</p>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p style={styles.text}>No reviews available</p>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default InfoWindowContent;