// src/components/MapComponent.js

import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, LoadScript, MarkerF } from '@react-google-maps/api';

const MapComponent = ({ businesses }) => {
    const mapContainerStyle = {
        width: '100%',
        height: '600px',
    };

    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);

    // Get the user's current location using Geolocation API
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                },
                () => {
                    console.error('Geolocation service failed.');
                    setCurrentLocation({ lat: 37.7749, lng: -122.4194 }); // Default to a specific location
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setCurrentLocation({ lat: 37.7749, lng: -122.4194 }); // Default to a specific location
        }
    }, []);

    // Return a loading message if currentLocation is not available
    if (!currentLocation) {
        return <div>Loading map...</div>;
    }

    const handleMarkerClick = (business) => {
        setSelectedBusiness(business); // Set the clicked business for the InfoWindow
    };

    const handleInfoWindowClose = () => {
        setSelectedBusiness(null); // Close the InfoWindow by clearing the selected business
    };

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={currentLocation}
                zoom={15}
            >
                {businesses.length > 0 ? (
                    businesses.map((business) => (
                        <MarkerF
                            key={business.id}
                            position={{ lat: business.latitude, lng: business.longitude }}
                            onClick={() => handleMarkerClick(business)} // Set info when marker is clicked
                        />
                    ))
                ) : (
                    <p>No businesses available.</p>
                )}

                {/* Render only one InfoWindow, if selectedBusiness is not null */}
                {selectedBusiness && (
                    <InfoWindow
                        position={{ lat: selectedBusiness.latitude, lng: selectedBusiness.longitude }}
                        onCloseClick={handleInfoWindowClose} // Close the InfoWindow
                    >
                        <div>
                            <h3>{selectedBusiness.name}</h3>
                            <p>{selectedBusiness.description}</p>
                            <p>{selectedBusiness.address}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
