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

                // If user ID is not provided, fetch businesses based on the current location
                if (!userId) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            async (position) => {
                                const { latitude, longitude } = position.coords;
                                const data = await fetchBusinessesByLocation(latitude, longitude, user.token);
                                console.log(data)
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
