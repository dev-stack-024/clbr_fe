import React, { useContext, useEffect, useState } from 'react';
import AddLocationComp from '../components/AddLocationComp';
import { fetchBusinessesByLocation, fetchBusinessesByUserId } from '../services/businessService';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AddLocationPage = () => {
    const location = useParams();
    const { user } = useContext(AuthContext);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBusinesses = async () => {
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
                            async () => {
                                // Use Worcester coordinates when geolocation fails
                                const data = await fetchBusinessesByLocation(42.2626, -71.8023, user.token);
                                setBusinesses(data);
                                setLoading(false);
                            }
                        );
                    } else {
                        // Use Worcester coordinates when geolocation not supported
                        const data = await fetchBusinessesByLocation(42.2626, -71.8023, user.token);
                        setBusinesses(data);
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
        };

        fetchBusinesses();
    }, [location.id, user]);

    if (loading) {
        return <div>Loading businesses...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <AddLocationComp businesses={businesses} />
        </div>
    );
};

export default AddLocationPage;
