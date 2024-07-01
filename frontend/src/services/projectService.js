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

export const searchProject = async (token, searchTerm) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            searchTerm: searchTerm
        }
    }

    try {
        const response = await axios.get('http://localhost:5000/project/search', config)
        return response.data;
    }
    catch (error){
        throw error;
    }
}

export const deleteProject = async (token, projectId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    try {
        const response = await axios.delete(`http://localhost:5000/project/${projectId}`, config);
        return response.data;
    }
    catch (error){
        throw error;
    }
}
