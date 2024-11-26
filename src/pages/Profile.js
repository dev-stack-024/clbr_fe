import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import defaultAvatar from '../assets/defaultAvatar.jpg';
import { toast } from 'react-toastify';
import { uploadImages } from '../services/businessService';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [avatar, setAvatar] = useState(defaultAvatar);
    const [bio, setBio] = useState('');
    const [role, setRole] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Fetch user profile on component mount
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/get-profile`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const { name, phone, gender, profilePictureURL, bio, role } = response.data;
            setName(name);
            setPhone(phone);
            setGender(gender);
            setAvatar(profilePictureURL || defaultAvatar);
            setBio(bio || '');
            setRole(role || '');
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };
    useEffect(() => {
        fetchUserProfile();
    }, [user.token]);

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            let profilePictureURL = avatar;
            if (selectedFiles.length > 0) {
                const uploadResponse = await uploadImages(selectedFiles, user.token);
                profilePictureURL = uploadResponse[0];
            }

            await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/users/update-profile`,
                { name, phone, gender, profilePictureURL, bio },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            fetchUserProfile();
            // toast.success("Profile updated successfully.");
        } catch (error) {
            console.error('Error updating profile:', error);
            // toast.error("Failed to update profile.");
        }
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    return (
        <Container className="mt-5">
            <h2>Edit Profile</h2>
            <Form onSubmit={handleSave}>
                <Row className="mb-3">
                    <Col md={4}>
                        <Image src={avatar} roundedCircle width="150" height="150" alt="Profile Avatar" />
                        <Form.Group controlId="formFile" className="mt-3">
                            <Form.Label>Change Profile Picture</Form.Label>
                            <input type="file" multiple onChange={handleFileChange} />
                        </Form.Group>
                    </Col>
                    <Col md={8}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={user.user.email} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPhone">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Control
                                as="select"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBio">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Control type="text" value={role} disabled />
                        </Form.Group>
                        <Button variant="primary" type="submit">Save Changes</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default Profile;
