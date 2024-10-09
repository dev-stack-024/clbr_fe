import { InfoWindowF } from '@react-google-maps/api';
import React from 'react';

const InfoWindowContent = ({ selectedBusiness }) => {
    const styles = {
        infoWindow: {
            fontFamily: 'Arial, sans-serif',
            padding: '10px',
            width: '300px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        },
        businessName: {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '10px',
        },
        imageContainer: {
            textAlign: 'center',
            marginBottom: '10px',
        },
        businessImage: {
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
        },
        description: {
            fontSize: '14px',
            marginBottom: '10px',
        },
        details: {
            fontSize: '13px',
        },
        detailItem: {
            margin: '5px 0',
        },
        detailLabel: {
            color: '#333',
            fontWeight: 'bold',
        },
    };

    return (
        <div style={styles.infoWindow}>
            <h3 style={styles.businessName}>{selectedBusiness.name}</h3>
            <div style={styles.imageContainer}>
                <img
                    src={selectedBusiness.imageUrl}
                    alt={selectedBusiness.name}
                    style={styles.businessImage}
                />
            </div>
            <p style={styles.description}>{selectedBusiness.description}</p>
            <div style={styles.details}>
                <p style={styles.detailItem}>
                    <span style={styles.detailLabel}>Address:</span> {selectedBusiness.address}
                </p>
                <p style={styles.detailItem}>
                    <span style={styles.detailLabel}>Latitude:</span> {selectedBusiness.location.coordinates[1]}
                </p>
                <p style={styles.detailItem}>
                    <span style={styles.detailLabel}>Longitude:</span> {selectedBusiness.location.coordinates[0]}
                </p>
            </div>
        </div>
    );
};



export default InfoWindowContent;
