/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import InfoWindowContent from './InfoWindow';
import { Offcanvas } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import InfoWindowContentEdit from './InfoWindoEdit';
import "../styles/Map.css"
import df from '../assets/marker.png'

const MapComponent = ({ businesses, userId, preSelectedBusiness = null }) => {
    const [currentLocation, setCurrentLocation] = useState({
        lat: 42.2626,
        lng: -71.8023
    });
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();

    const handleMarkerClick = (business) => {
        setSelectedBusiness(business);
        setDrawerOpen(true);
    };

    useEffect(() => {
        setSelectedBusiness(preSelectedBusiness);
        preSelectedBusiness !== null && setDrawerOpen(true);
    }, [preSelectedBusiness])

    const handleDrawerClose = () => {
        setSelectedBusiness(null);
        setDrawerOpen(false);
    };

    console.log(preSelectedBusiness, "vvv")

    useEffect(() => {
        if (userId && businesses.length > 0) {
            setCurrentLocation({
                lat: Number(businesses[0]?.location?.coordinates[1]),
                lng: Number(businesses[0]?.location?.coordinates[0])
            });
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                },
                () => {
                    // Keep Worcester coordinates from initial state if geolocation fails
                    console.log('Using default Worcester coordinates');
                }
            );
        }
    }, []);


    console.log(currentLocation)
    return (


        <div>
            <GoogleMap mapContainerStyle={{ width: '100%', height: '91vh' }} center={currentLocation} zoom={15}>
                {businesses?.map((business) => (
                    <>

                        <MarkerF
                            position={{
                                lat: Number(business.location.coordinates[1]),
                                lng: Number(business.location.coordinates[0])
                            }}
                            onClick={() => handleMarkerClick(business)}
                            icon={{
                                url: df,
                                scaledSize: new window.google.maps.Size(24, 40),
                                anchor: new window.google.maps.Point(20, 40),
                            }}
                            label={{
                                text: `${business.averageRating.toFixed(1) + " " + business.name}`,
                                className: 'marker-label',
                                color: '#FFD700',
                                fontSize: '12px',
                            }}
                        />

                    </>
                ))}
                {!location.pathname.includes('my-location') &&
                    <MarkerF position={currentLocation} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />

                }
            </GoogleMap>

            <Offcanvas show={drawerOpen} onHide={handleDrawerClose} placement="end" style={{ width: '40%' }}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Business Details</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {selectedBusiness !== null && !userId ? (
                        <InfoWindowContent selectedBusiness={selectedBusiness} />
                    ) : <></>}
                    {selectedBusiness && userId ? (
                        <InfoWindowContentEdit selectedBusiness={selectedBusiness} />
                    ) : <></>}
                </Offcanvas.Body>
            </Offcanvas>
        </div>

    );
};

export default MapComponent;
