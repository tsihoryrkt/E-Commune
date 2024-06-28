import axios from 'axios';

export const updateUserProfile = async (token, formData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    };

    try {
        const response = await axios.put('http://localhost:5000/user/update', formData, config);
        return response.data;
        
    } catch (error) {
        throw error;
    }
};
