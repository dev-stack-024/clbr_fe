
import React, { useCallback, useContext, useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { useParams } from 'react-router-dom';
import { fetchBusinessesByLocation } from '../services/businessService';
import { AuthContext } from '../context/AuthContext';
import { Container, Alert, Form, Badge } from 'react-bootstrap';

const Map = () => {
    const location = useParams();
    const { user } = useContext(AuthContext);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('rating');
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        parking: false,
        wifi: false,
        outdoorSeating: false,
        creditCardAccepted: false,
        delivery: false,
        wheelchairAccessible: false,
        petFriendly: false
    });

    const [coordinates, setCoordinates] = useState({
        latitude: 42.2626,
        longitude: -71.8023
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordinates({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                () => {
                    // Default coordinates remain if geolocation fails
                }
            );
        }
    }, []);

    const fetchBusinessesData = useCallback(async () => {
        try {
            setLoading(true);
            const searchParams = {
                search: searchTerm,
                type: selectedCategory,
                sort: sortBy,
                page: currentPage,
                ...filters,
                ...coordinates
            };

            const data = await fetchBusinessesByLocation(
                coordinates.latitude,
                coordinates.longitude,
                user.token,
                searchParams
            );

            setBusinesses(data.businesses);
            setPagination(data.pagination);
            setError(null);
        } catch (err) {
            setError('Unable to fetch businesses. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [coordinates, searchTerm, selectedCategory, sortBy, filters, currentPage, user.token]);

    useEffect(() => {
        fetchBusinessesData();
    }, [fetchBusinessesData]);

    const handleFilterChange = (filterName) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }));
        setCurrentPage(1);
    };

    const renderFilterBadges = () => {
        return Object.entries(filters)
            .filter(([_, value]) => value)
            .map(([key]) => (
                <Badge
                    key={key}
                    bg="primary"
                    className="me-2 mb-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleFilterChange(key)}
                >
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()} ×
                </Badge>
            ));
    };

    console.log(businesses)
    return (
        <div style={{ height: '91vh' }}>
            {error ? (
                <Container className="mt-3">
                    <Alert variant="warning">{error}</Alert>
                </Container>
            ) : (
                <div style={{ display: 'flex', height: '100%' }}>
                    <div className="business-cards-container" style={{
                        flex: '0 0 320px',
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#cbd5e0 #f8f9fa',
                        '&::-webkit-scrollbar': {
                            width: '8px'
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f8f9fa',
                            borderRadius: '4px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#cbd5e0',
                            borderRadius: '4px',
                            border: '2px solid #f8f9fa'
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: '#a0aec0'
                        }
                    }}>
                        <Form.Control
                            type="search"
                            placeholder="Search businesses..."
                            className="mb-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <Form.Select
                            className="mb-3"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="cafe">Café</option>
                            <option value="bar">Bar & Nightclub</option>
                            <option value="shop">Shop</option>
                            <option value="retail">Retail</option>
                            <option value="service">Service</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="fitness">Fitness & Gym</option>
                            <option value="beauty">Beauty & Spa</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="education">Education</option>
                            <option value="automotive">Automotive</option>
                            <option value="hotel">Hotel & Lodging</option>
                            <option value="grocery">Grocery & Market</option>
                        </Form.Select>

                        <Form.Select
                            className="mb-3"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="rating">Top Rated</option>
                            <option value="newest">Newest</option>
                        </Form.Select>

                        <div className="filter-badges mb-3">
                            {renderFilterBadges()}
                        </div>

                        <div className="filter-options mb-3">
                            {Object.keys(filters).map(filter => (
                                <Form.Check
                                    key={filter}
                                    type="switch"
                                    id={filter}
                                    label={filter.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                    checked={filters[filter]}
                                    onChange={() => handleFilterChange(filter)}
                                    className="mb-2"
                                />
                            ))}
                        </div>

                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="business-cards">
                                {businesses.map(business => (
                                    <div
                                        key={business._id}
                                        className="card mb-3 hover-shadow"
                                        style={{
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div className="card-body pb-0">
                                            <div className="d-flex mb-3">
                                                <img
                                                    src={business.images[0] || '/assets/default-business.jpg'}
                                                    alt={business.name}
                                                    className="business-card-image me-3"
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                                <div>
                                                    <p className="card-title"><b>{business.name}</b></p>
                                                    <p className="card-text text-muted mb-2">
                                                        {business.address}
                                                    </p>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <Badge bg="secondary">
                                                            {business.type}
                                                        </Badge>
                                                        <span className="text-warning">
                                                            {'★'.repeat(Math.round(business.averageRating || 0))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {pagination.pages > 1 && (
                            <div className="pagination-controls mt-3 d-flex justify-content-center">
                                {[...Array(pagination.pages)].map((_, index) => (
                                    <button
                                        key={index}
                                        className={`btn btn-sm mx-1 ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ flex: 1 }}>
                        <MapComponent businesses={businesses} userId={location.id} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Map;
