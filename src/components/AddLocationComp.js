import React, { useContext, useEffect, useState } from 'react';
import { GoogleMap, InfoWindowF, LoadScript, MarkerF } from '@react-google-maps/api';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddLocationComp = ({ businesses }) => {
    const { user } = useContext(AuthContext);
    const [clickedLocation, setClickedLocation] = useState(null);
    const mapContainerStyle = {
        width: clickedLocation ? '70%' : "100%", // Adjusted to allow space for the form
        height: '92vh',
    };

    const formContainerStyle = {
        width: '30%',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderLeft: '1px solid #ddd',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        height: '92vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    };

    const labelStyle = {
        marginBottom: '10px',
        fontSize: '14px',
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

    const buttonStyle = {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    };

    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        address: '',
        latitude: '',
        longitude: '',
        phone: '',
        description: '',
        images: '',
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

    const handleMarkerClick = (business) => {
        setSelectedBusiness(business);
    };

    const handleInfoWindowClose = () => {
        setSelectedBusiness(null);
    };

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setClickedLocation({ lat, lng });
        setFormData({ ...formData, latitude: lat, longitude: lng });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = user.token; // Get the token from localStorage

            // Make a POST request to the backend API
            const response = await axios.post('http://localhost:8080/api/business', formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach the token in headers
                },
            });

            console.log('Business created:', response.data);
            // Optionally, reset the form or give feedback to the user
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
            setClickedLocation(null); // Clear the clicked location
        } catch (error) {
            console.error('Error creating business:', error.response ? error.response.data : error.message);
        }

    };

    return (
        <div style={{ display: 'flex' }}>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
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
                                onClick={() => handleMarkerClick(business)}
                            />
                        ))
                    ) : (
                        <p>No businesses available.</p>
                    )}

                    {selectedBusiness && (
                        <InfoWindowF
                            position={{ lat: selectedBusiness.latitude, lng: selectedBusiness.longitude }}
                            onCloseClick={handleInfoWindowClose}
                        >
                            <div>
                                <h3>{selectedBusiness.name}</h3>
                                <p>{selectedBusiness.description}</p>
                                <p>{selectedBusiness.address}</p>
                            </div>
                        </InfoWindowF>
                    )}

                    {clickedLocation && (
                        <InfoWindowF
                            position={clickedLocation}
                            onCloseClick={() => setClickedLocation(null)}
                        >
                            <div>
                                <h4>Clicked Location</h4>
                                <p>Latitude: {clickedLocation.lat}</p>
                                <p>Longitude: {clickedLocation.lng}</p>
                            </div>
                        </InfoWindowF>
                    )}
                </GoogleMap>
            </LoadScript>

            {/* Form UI for adding business */}
            {clickedLocation &&
                <div style={formContainerStyle}>
                    <h2 style={{ textAlign: 'center' }}>Add a Business</h2>
                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={labelStyle}>
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

                        <label style={labelStyle}>
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

                        <label style={labelStyle}>
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

                        <label style={labelStyle}>
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

                        <label style={labelStyle}>
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

                        <label style={labelStyle}>
                            Phone:
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                        </label>

                        <label style={labelStyle}>
                            Description:
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                style={textareaStyle}
                            />
                        </label>

                        <label style={labelStyle}>
                            Images (Comma-separated URLs):
                            <input
                                type="text"
                                name="images"
                                value={formData.images}
                                onChange={handleInputChange}
                                style={inputStyle}
                            />
                        </label>

                        <button type="submit" style={buttonStyle}>Add Business</button>
                    </form>
                </div>}
        </div>
    );
};

export default AddLocationComp;
