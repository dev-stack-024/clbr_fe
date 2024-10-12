// services/businessService.js

import axios from 'axios';

export const fetchBusinessesByLocation = async (latitude, longitude) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/business?latitude=${latitude}&longitude=${longitude}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching businesses by location');
    }
};

// Fetch businesses by user ID
export const fetchBusinessesByUserId = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/business?userId=${userId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching businesses by user ID');
    }
};

// Function to upload images
export const uploadImages = async (files, token) => {
    const uploadedImageUrls = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageData = new FormData();
        imageData.append('image', file);

        try {
            const response = await axios.post('http://localhost:8080/api/upload', imageData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            uploadedImageUrls.push(response.data.imageUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }
    return uploadedImageUrls;
};

// Function to create a business
export const createBusiness = async (formData, token) => {
    console.log(formData)
    try {
        const response = await axios.post('http://localhost:8080/api/business', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return the response data if needed
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
};
