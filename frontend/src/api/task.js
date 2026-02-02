import axios from 'axios';

const API_URL = `http://localhost:8080/planify`;

export const createTask = async (task) => {
    const token = localStorage.getItem("accessToken");
    return await axios.post(`${API_URL}/tasks`, task, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const deleteTask = async (planId, stageId, taskId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.delete(`${API_URL}/plans/${planId}/${stageId}/${taskId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getTasksByPlanId = (planId) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(`${API_URL}/plans/${planId}/tasks`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getAllTasks = (planId, stageId) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(`${API_URL}/plans/${planId}/${stageId}/tasks`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const updateTask = async (taskId, taskData) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/tasks/${taskId}`, taskData, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const startTask = async (taskId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/tasks/${taskId}/start`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const completeTask = async (taskId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/tasks/${taskId}/complete`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};
