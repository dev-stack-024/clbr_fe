import React from 'react';
import AddLocationComp from '../components/AddLocationComp';


const AddLocationPage = () => {
    const businesses = [
        {
            id: 1,
            name: "Joe's Coffee",
            latitude: 30.5265298,
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
            <AddLocationComp businesses={businesses} />
        </div>
    );
};

export default AddLocationPage;