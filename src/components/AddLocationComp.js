import React, { useContext, useEffect, useState } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { AuthContext } from '../context/AuthContext';
import { Modal, Button } from 'react-bootstrap';
import { uploadImages, createBusiness } from '../services/businessService'; // Import the service functions
import { toast } from 'react-toastify';
// import InfoWindowContent from './InfoWindow';

const AddLocationComp = ({ businesses }) => {
    console.log(businesses)
    const { user } = useContext(AuthContext);
    // const [clickedLocation, setClickedLocation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const mapContainerStyle = {
        width: '100%',
        height: '92vh',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
    };

    const textareaStyle = {
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        resize: 'none',
    };

    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        address: '',
        latitude: '',
        longitude: '',
        phone: '',
        description: '',
        images: [],
    });

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                },
                () => {
                    console.error('Geolocation service failed.');
                    setCurrentLocation({ lat: 37.7749, lng: -122.4194 });
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setCurrentLocation({ lat: 37.7749, lng: -122.4194 });
        }
    }, []);

    if (!currentLocation) {
        return <div>Loading map...</div>;
    }

    const handleMapClick = (event) => {
        // console.log("im hwre")
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        // setClickedLocation({ lat, lng });
        setFormData({ ...formData, latitude: lat, longitude: lng });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = user.token;

            // Upload images and get URLs
            const imageUrls = await uploadImages(selectedFiles, token);
            console.log(imageUrls)
            const updatedFormData = {
                ...formData,
                images: imageUrls,  // Set the images after they are uploaded
            };

            console.log(formData)

            // Create business
            const createdBusiness = await createBusiness(updatedFormData, token);
            console.log('Business created:', createdBusiness);

            toast.success("Business added successfully.")

            setFormData({
                name: '',
                type: '',
                latitude: '',
                longitude: '',
                address: '',
                phone: '',
                description: '',
                images: '',
            });
            // setClickedLocation(null);
            setShowModal(false);
        } catch (error) {
            console.error('Error creating business:', error.message);
            toast.error("Business adding failed")
        }
    };

    return (
        <div>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={currentLocation}
                zoom={15}
                onClick={handleMapClick}
            >
                {businesses.length > 0 ? (
                    businesses.map((business) => (
                        <MarkerF
                            key={business.id}
                            position={{ lat: business.latitude, lng: business.longitude }}
                        />
                    ))
                ) : (
                    <p>No businesses available.</p>
                )}

                <MarkerF
                    position={currentLocation}
                    icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    }}
                />

                {/* {clickedLocation && (
                        <InfoWindowF
                            position={clickedLocation}
                            onCloseClick={() => setClickedLocation(null)}
                        > */}
                {/* <InfoWindowContent selectedBusiness={selectedBusiness} /> */}
                {/* </InfoWindowF>
                    )} */}
            </GoogleMap>


            {/* Modal for adding business */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Business</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>
                            Business Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            Type:
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                                style={inputStyle}
                            >
                                <option value="">Select Type</option>
                                <option value="restaurant">Restaurant</option>
                                <option value="shop">Shop</option>
                                <option value="service">Service</option>
                            </select>
                        </label>

                        <label>
                            Address:
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            Latitude:
                            <input
                                type="number"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleInputChange}
                                readOnly
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            Longitude:
                            <input
                                type="number"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleInputChange}
                                readOnly
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            Phone:
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                        </label>

                        <label>
                            Description:
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                style={textareaStyle}
                            />
                        </label>

                        <label>
                            Upload Images:
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                style={inputStyle}
                            />
                        </label>

                        <Button type="submit" variant="success" style={{ marginTop: '20px' }}>
                            Add Business
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AddLocationComp;
