import React, { useCallback, useContext, useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { useParams } from 'react-router-dom';
import { fetchBusinessesByLocation, fetchBusinessesByUserId } from '../services/businessService';
import { AuthContext } from '../context/AuthContext';

const MapPage = () => {
    const location = useParams();
    const { user } = useContext(AuthContext);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBusinesses = useCallback(async () => {
        try {
            const userId = location.id;

            if (!userId) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;
                            const data = await fetchBusinessesByLocation(latitude, longitude, user.token);
                            setBusinesses(data);
                            setLoading(false);
                        },
                        () => {
                            setError('Unable to retrieve your location. Please provide a user ID.');
                            setLoading(false);
                        }
                    );
                } else {
                    setError('Geolocation is not supported by this browser.');
                    setLoading(false);
                }
            } else {
                const data = await fetchBusinessesByUserId(userId, user.token);
                setBusinesses(data);
                setLoading(false);
            }
        } catch (err) {
            setError('Error fetching businesses. Please try again later.');
            setLoading(false);
        }
    }, [location.id, user.token]);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    if (loading) {
        return <div>Loading businesses...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <MapComponent businesses={businesses} userId={location.id} fetchBusinesses={fetchBusinesses} />
        </div>
    );
};

export default MapPage;
