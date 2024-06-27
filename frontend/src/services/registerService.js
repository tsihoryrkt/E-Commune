import axios from 'axios';

export const registerUser = async (formData) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    }
    catch (error) {
        throw error;
    }  
}