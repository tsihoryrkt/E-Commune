import axios from 'axios';

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/login', credentials);
        return response;
    }
    catch (error) {
        throw error;
    }  
}