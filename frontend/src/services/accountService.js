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
        
    }
    catch (error) {
        throw error;
    }
};

export const searchPersonnel = async (token, searchTerm) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            searchTerm: searchTerm
        }
    }

    try {
        const response = await axios.get('http://localhost:5000/user/search', config)
        return response.data;
    }
    catch (error){
        throw error;
    }
}


export const deleteUser = async (token, userId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    try {
        const response = await axios.delete(`http://localhost:5000/user/${userId}`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
