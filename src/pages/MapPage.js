// src/pages/MapPage.js

import React, { useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MapPage = () => {

    const location = useParams()


    const [businesses, setBusinesses] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const userId = location.id;

                // Get user's current location
                if (!userId) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            async (position) => {
                                const { latitude, longitude } = position.coords;
                                const response = await axios.get(`http://localhost:8080/api/business?latitude=${latitude}&longitude=${longitude}`);
                                setBusinesses(response.data);
                                setLoading(false);
                            },
                            () => {
                                // Handle error in getting current location
                                setError('Unable to retrieve your location. Please provide a user ID.');
                                setLoading(false);
                            }
                        );
                    } else {
                        setError('Geolocation is not supported by this browser.');
                        setLoading(false);
                    }
                } else {
                    // Fetch businesses by user ID
                    const response = await axios.get(`http://localhost:8080/api/business?userId=${userId}`);
                    setBusinesses(response.data);
                    setLoading(false);
                }
            } catch (err) {
                setError('Error fetching businesses. Please try again later.');
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, [location.id]);

    if (loading) {
        return <div>Loading businesses...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }


    return (
        <div>
            <MapComponent businesses={businesses} userId={location.id} />
        </div>
    );
};

export default MapPage;
