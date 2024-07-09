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

export const searchProject = async  (token, searchTerm) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            searchTerm: searchTerm
        }
    }
    try {
        const response = await axios.get('http://localhost:5000/project/searchUserProject', config)
        return response.data;
    }
    catch (error){
        throw error;
    }
}

export const fetchAssignedTo = async (token, assignedToId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            assignedToId: assignedToId
        }
    }

    try {
        const response = await axios.get('http://localhost:5000/user/assignedTo', config)
        return response.data
    }
    catch (error){
        throw error;
    }

}

export const fetchProject = async (token, projectId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            projectId: projectId
        }
    }

    try {
        const response = await axios.get('http://localhost:5000/project/projectDetails', config)
        return response.data
    }
    catch (error){
        throw error;
    }

}

export const fetchProjectTask = async (token, projectId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            projectId: projectId
        }
    };
    
    try {
        const response = await axios.get('http://localhost:5000/task/byProject', config);
        return response.data;
    }
    catch (error){
        throw error;
    }
}

export const searchTask = async  (token, searchTerm) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            searchTerm: searchTerm
        }
    }
    try {
        const response = await axios.get('http://localhost:5000/task/searchUserTask', config)
        return response.data;
    }
    catch (error){
        throw error;
    }
}

export const fetchProjectCount = async () => {
    try{
        const response = await axios.get('http://localhost:5000/statistics/projects/count');
        return response.data;
    }
    catch (error){
        throw error;
    } 
}

export const fetchUserCount = async () => {
    try{
        const response = await axios.get('http://localhost:5000/statistics/users/count');
        return response.data;
    }
    catch (error){
        throw error;
    } 
}


export const fetchTaskStats = async () => {
    try{
        const response = await axios.get('http://localhost:5000/statistics/tasks/stats');
        return response.data;
    }
    catch (error){
        throw error;
    }
}


export default fetchUserData;