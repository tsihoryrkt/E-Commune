import axios from "axios";

const fetchUserData = async (token) => {
    try {
        const response = await axios.get('http://localhost:5000/user/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return response.data;
        } 
        else {
            throw new Error('Failed to fetch user data');
        }
    }
    
    catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error('Unauthorized. Please log in again.');
        } else {
            throw new Error('An error occurred. Please try again.');
        }
    }
};

export const fetchMembers = async (token, membersId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            membersId: membersId
        }
    }

    try {
        const response = await axios.get('http://localhost:5000/user/members', config)
        return response.data
    }
    catch (error){
        throw error;
    }
}

export default fetchUserData;