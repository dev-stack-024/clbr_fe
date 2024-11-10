/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import InfoWindowContent from './InfoWindow';
import { Offcanvas } from 'react-bootstrap';

const MapComponent = ({ businesses, userId, fetchBusinesses }) => {
    // Set a default location as an initial state
    const [currentLocation, setCurrentLocation] = useState({});
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleMarkerClick = (business) => {
        setSelectedBusiness(business);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setSelectedBusiness(null);
        setDrawerOpen(false);
    };

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


    console.log(currentLocation)
    return (


        <div>
            <GoogleMap mapContainerStyle={{ width: '100%', height: '90vh' }} center={currentLocation} zoom={15}>
                {businesses.map((business) => (
                    <>
                        <MarkerF
                            key={business._id}
                            position={{
                                lat: Number(business.location.coordinates[1]),
                                lng: Number(business.location.coordinates[0])
                            }}
                            onClick={() => handleMarkerClick(business)}
                            label={{
                                text: "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" + business.name,
                                color: '#444',
                                fontSize: '14px',
                            }}


                        />
                    </>
                ))}
                <MarkerF position={currentLocation} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />
            </GoogleMap>

            <Offcanvas show={drawerOpen} onHide={handleDrawerClose} placement="end" style={{ width: '40%' }}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Business Details</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {selectedBusiness && (
                        <InfoWindowContent selectedBusiness={selectedBusiness} fetchBusinesses={fetchBusinesses} />
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </div>

    );
};

export default MapComponent;
