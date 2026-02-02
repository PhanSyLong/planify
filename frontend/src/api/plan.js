import axios from 'axios';

const API_URL = `http://localhost:8080/planify/plans`;

export const createPlan = async(plan) => {
    const token = localStorage.getItem("accessToken");
    return await axios.post(API_URL, plan, {
	    headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const deletePlan = async(planId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.delete(`${API_URL}/${planId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const updatePlan = async(planId, plan) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/${planId}`, plan, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getPlanByName = (name) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(`${API_URL}/${name}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getPlanById = (id) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(`${API_URL}/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getAllPlans = async() => {
    const token = localStorage.getItem("accessToken");
    return await axios.get(API_URL, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};
export const searchPlans = ({ query, tags }) => {
    const token = localStorage.getItem("accessToken");

    const params = {};
    if (query) params.query = query;
    if (tags?.length) params.tags = tags;

    return axios.get(`${API_URL}/filter`, {
        params,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};


