import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindowF, LoadScript, MarkerF } from '@react-google-maps/api';
import InfoWindowContent from './InfoWindow';

const MapComponent = ({ businesses, userId }) => {
    const mapContainerStyle = {
        width: '100%',
        height: '92vh',
    };

    console.log(businesses)

    // Set a default location as an initial state
    const [currentLocation, setCurrentLocation] = useState({ lat: Number(businesses[0].location.coordinates[0]), lng: Number(businesses[0].location.coordinates[1]) }); // Default to San Francisco
    const [selectedBusiness, setSelectedBusiness] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
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
                            key={business._id}
                            position={{ lat: Number(business.location.coordinates[1]), lng: Number(business.location.coordinates[0]) }}
                            onClick={() => handleMarkerClick(business)}
                        />
                    ))
                ) : (
                    <p>No businesses available.</p>
                )}

                {selectedBusiness && (
                    <InfoWindowF
                        position={{ lat: selectedBusiness.location.coordinates[1], lng: selectedBusiness.location.coordinates[0] }}
                        onCloseClick={handleInfoWindowClose}
                    >
                        <InfoWindowContent selectedBusiness={selectedBusiness} />
                    </InfoWindowF>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
