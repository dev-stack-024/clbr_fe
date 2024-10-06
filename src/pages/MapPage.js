// src/pages/MapPage.js

import React, { useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';

const MapPage = () => {
    //   const [businesses, setBusinesses] = useState([]);

    //   useEffect(() => {

    //     const fetchBusinesses = async () => {

    //       const response = await fetch('/api/businesses'); 
    //       const data = await response.json();
    //       setBusinesses(data);
    //     };

    //     fetchBusinesses();
    //   }, []);

    const businesses = [
        {
            id: 1,
            name: "Joe's Coffee",
            latitude: 17.5265298,
            longitude: 78.3572451,
            address: "123 Coffee St, San Francisco, CA",
            category: "Coffee Shop"
        },
        {
            id: 2,
            name: "Beauty Bliss",
            latitude: 37.7799,
            longitude: -122.4144,
            address: "456 Beauty Ave, San Francisco, CA",
            category: "Beauty Salon"
        },
        {
            id: 3,
            name: "Fitness Hub",
            latitude: 37.7729,
            longitude: -122.4294,
            address: "789 Fitness Rd, San Francisco, CA",
            category: "Gym"
        },
        {
            id: 4,
            name: "The Book Nook",
            latitude: 37.7699,
            longitude: -122.4194,
            address: "321 Book Ln, San Francisco, CA",
            category: "Bookstore"
        }
    ];

    return (
        <div>
            <h1>Local Businesses</h1>
            <MapComponent businesses={businesses} />
        </div>
    );
};

export default MapPage;
