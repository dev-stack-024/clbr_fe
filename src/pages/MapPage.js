import React, { useCallback, useContext, useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { useParams } from 'react-router-dom';
import { fetchBusinessesByLocation, fetchBusinessesByUserId } from '../services/businessService';
import { AuthContext } from '../context/AuthContext';
// import { toast } from 'react-toastify';
import { Container, Alert } from 'react-bootstrap';

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
                            setBusinesses(data.businesses);
                            setLoading(false);
                        },
                        async () => {
                            // Use Worcester coordinates as default
                            const data = await fetchBusinessesByLocation(42.2626, -71.8023, user.token);
                            setBusinesses(data.businesses);
                            setLoading(false);
                        }
                    );
                } else {
                    const data = await fetchBusinessesByLocation(42.2626, -71.8023, user.token);
                    setBusinesses(data.businesses);
                    setLoading(false);
                }
            } else {
                const data = await fetchBusinessesByUserId(userId, user.token);
                setBusinesses(data.businesses);
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
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    return (
        <div>
            {error ? (
                <Container className="mt-3">
                    <Alert variant="warning">
                        {error}
                    </Alert>
                </Container>
            ) : (
                <MapComponent businesses={businesses} userId={location.id} />
            )}
        </div>
    );
};

export default MapPage;