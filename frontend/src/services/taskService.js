import axios from "axios";

export const createTask = async (token, formData) => {
    try {
        const response = await axios.post('http://localhost:5000/task/create', formData, {
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

export const searchTask = async (token, searchTerm) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            searchTerm: searchTerm
        }
    }

    try {
        const response = await axios.get('http://localhost:5000/task/search', config)
        return response.data;
    }
    catch (error){
        throw error;
    }
}