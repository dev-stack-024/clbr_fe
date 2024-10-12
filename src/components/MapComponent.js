/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindowF, MarkerF } from '@react-google-maps/api';
import InfoWindowContent from './InfoWindow';

const MapComponent = ({ businesses, userId }) => {
    const mapContainerStyle = {
        width: '100%',
        height: '92vh',
    };

    // Set a default location as an initial state
    const [currentLocation, setCurrentLocation] = useState({});
    const [selectedBusiness, setSelectedBusiness] = useState(null);

    useEffect(() => {
        console.log(currentLocation, "currentLocation")
        if (userId) {
            setCurrentLocation({ lat: Number(businesses[0].location.coordinates[1]), lng: Number(businesses[0].location.coordinates[0]) });

        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                },
                () => {
                    console.error('Geolocation service failed.');
                    // Maintain default location if geolocation fails
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            // Maintain default location if geolocation is not supported
        }
    }, []);

    const handleMarkerClick = (business) => {
        setSelectedBusiness(business);
    };

    const handleInfoWindowClose = () => {
        setSelectedBusiness(null);
    };
    console.log(currentLocation)
    return (

        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={currentLocation}
            zoom={15}
        >
            {businesses.length > 0 ? (
                businesses.map((business) => (
                    <MarkerF
                        key={business._id}
                        position={{ lat: Number(business.location.coordinates[1]), lng: Number(business.location.coordinates[0]) }}
                        onClick={() => handleMarkerClick(business)}
                    />
                ))
            ) : (
                <p>No businesses available.</p>
            )}
            {!userId &&
                <MarkerF
                    position={currentLocation}
                    icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Optional: use a blue marker to distinguish current location
                    }}
                />}

            {selectedBusiness && (
                <InfoWindowF
                    position={{ lat: selectedBusiness.location.coordinates[1], lng: selectedBusiness.location.coordinates[0] }}
                    onCloseClick={handleInfoWindowClose}
                >
                    <InfoWindowContent selectedBusiness={selectedBusiness} />
                </InfoWindowF>
            )}
        </GoogleMap>

    );
};

export default MapComponent;
