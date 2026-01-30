import axios from 'axios';

const API_URL = `http://localhost:8080/planify`;

export const createPlan = async(plan) => {
    const token = localStorage.getItem("accessToken");
    return await axios.post(`${API_URL}/plans`, plan, {
	    headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const deletePlan = async(planId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.delete(`${API_URL}/plans/${planId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const updatePlan = async(planId, plan) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/plans/${planId}`, plan, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getPlanByName = (name) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(`${API_URL}/plans/${name}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getPlanById = (id) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(`${API_URL}/plans/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getAllPlans = async() => {
    const token = localStorage.getItem("accessToken");
    return await axios.get(`${API_URL}/plans`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const bookmark = async(planId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.post(`${API_URL}/plans/${planId}/bookmark`, null, {  // axios.post/put/patch requires a body arg
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};
 
export const unbookmark = async(planId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.delete(`${API_URL}/plans/${planId}/bookmark`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};


export const getBookmarkedPlans = async(userId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.get(`${API_URL}/users/${userId}/bookmarks`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getBookmarkers = async(planId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.get(`${API_URL}/plans/${planId}/bookmarkers`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const forkPlan = async(planId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.post(`${API_URL}/plans/${planId}/fork`, null, {  // axios.post/put/patch requires a body arg
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};
