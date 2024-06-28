import axios from 'axios';

export const updateUserProfile = async (token, userData) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.put('http://localhost:5000/user/update', userData, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
