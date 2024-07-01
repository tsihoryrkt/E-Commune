import axios from "axios";

export const createProject = async (token, formData) => {
    try {
        const response = await axios.post('http://localhost:5000/project/create', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
        })
        return response;
    }
    catch (error) {
        throw error;
    }  
}