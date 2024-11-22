
import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Form, Button, Card, Image } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import defaultProfilePictureUrl from "../assets/defaultAvatar.jpg"
import { useLocation } from 'react-router-dom';
import { fetchBusinessesById } from '../services/businessService';
import { uploadImages } from '../services/businessService';

const InfoWindowContentEdit = ({ selectedBusiness }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [business, setBusiness] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        type: '',
        address: '',
        phone: '',
        description: '',
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imagesToRemove, setImagesToRemove] = useState([]);

    useEffect(() => {
        getBusinessById()
        fetchReviews();
    }, []);


    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleRemoveImage = (imageUrl) => {
        setImagesToRemove(prev => [...prev, imageUrl]);
        setBusiness(prev => ({
            ...prev,
            images: prev.images.filter(img => img !== imageUrl)
        }));
    };

    // Modify handleUpdateSubmit to include image operations
    const handleUpdateSubmit = async () => {
        try {
            // Upload new images first
            const newImageUrls = selectedFiles.length > 0 ?
                await uploadImages(selectedFiles, user.token) : [];

            console.log(newImageUrls, "updatedData")
            const updatedData = {
                ...editFormData,
                images: [
                    ...business.images.filter(img => !imagesToRemove.includes(img)),
                    ...newImageUrls
                ],
                imagesToRemove
            };
            console.log(updatedData, "updatedData")
            const response = await axios.put(`http://localhost:8080/api/business/${business._id}`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                }
            });

            setBusiness(response.data);
            setIsEditing(false);
            setSelectedFiles([]);
            setImagesToRemove([]);
            getBusinessById()
        } catch (error) {
            console.error("Error updating business:", error);
        }
    };
    // Add this function to handle edit mode
    const handleEditClick = () => {
        setEditFormData({
            name: business.name,
            type: business.type,
            address: business.address,
            phone: business.phone,
            description: business.description,
        });
        setIsEditing(true);
    };

    // Add function to handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
            lineHeight: '1',
            marginRight: '10px'
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

    const handleDeleteBusiness = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/business/${business._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                }
            });

            // Redirect to home page or business listing page after deletion
            window.location.href = '/';
        } catch (error) {
            console.error("Error deleting business:", error);
        }
    };

    return (
        <>

            <Card style={styles.card}>
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        {isEditing ? (
                            <Form.Control
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleInputChange}
                                style={styles.text}
                            />
                        ) : (
                            <h2 style={styles.heading}>{business.name}</h2>
                        )}

                    </div>

                    {isEditing ? (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.label}>Type</Form.Label>
                                <Form.Select
                                    name="type"
                                    value={editFormData.type}
                                    onChange={handleInputChange}

                                >
                                    <option value="restaurant">Restaurant</option>
                                    <option value="shop">Shop</option>
                                    <option value="service">Service</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={styles.label}>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={editFormData.address}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={styles.label}>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={editFormData.phone}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.label}>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            {isEditing && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={styles.label}>Add New Images</Form.Label>
                                        <Form.Control
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                        />
                                    </Form.Group>

                                    <div className="mb-3">
                                        <Form.Label style={styles.label}>Current Images</Form.Label>
                                        <Row>
                                            {business.images?.map((imageUrl, index) => (
                                                <Col key={index} xs={6} className="mb-2">
                                                    <div style={{ position: 'relative' }}>
                                                        <img
                                                            src={imageUrl}
                                                            alt={`Business ${index + 1}`}
                                                            style={styles.image}
                                                        />
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            style={{
                                                                position: 'absolute',
                                                                top: '5px',
                                                                right: '5px'
                                                            }}
                                                            onClick={() => handleRemoveImage(imageUrl)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                </>
                            )}
                        </Form>
                    ) : (
                        <>
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

                                </Row>
                            }


                            {loading && business ? <>Loading...</> :
                                <div>
                                    <h3 style={styles.sectionHeading}>Reviews</h3>
                                    {reviews.length > 0 ? (
                                        reviews.map((review, index) => (
                                            <Card key={index} style={styles.reviewCard}>
                                                <Card.Body style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Image
                                                        src={review.user.profilePictureURL || defaultProfilePictureUrl}
                                                        roundedCircle
                                                        width={30}
                                                        height={30}
                                                        alt="User Profile"
                                                        style={{ marginRight: '10px' }}
                                                    />
                                                    <div>
                                                        <p style={styles.label}>{review.user.name}</p>
                                                        <p style={styles.text}>{review.reviewText}</p>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    ) : (
                                        <p style={styles.text}>No reviews available</p>
                                    )}
                                </div>
                            }
                        </>
                    )}
                    {location.pathname.includes('my-location') && (
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-evenly' }}>
                            <Button

                                variant={isEditing ? "success" : "primary"}
                                onClick={isEditing ? handleUpdateSubmit : handleEditClick}
                            >
                                {isEditing ? "Save" : "Edit Business"}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDeleteBusiness}
                            >
                                Delete Business
                            </Button>
                        </div>
                    )}
                </Card.Body>



            </Card>


        </>
    );
};

export default InfoWindowContentEdit;

// Add these new state variables at the top with other useState declarations