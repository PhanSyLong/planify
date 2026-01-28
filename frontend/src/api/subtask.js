import axios from 'axios';

const API_URL = `http://localhost:8080/planify`;

export const createSubtask = async(subtask) => {
    const token = localStorage.getItem("accessToken");
    return await axios.post(`${API_URL}/subtasks`, subtask, {
	    headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const deleteSubtask = async(planId, stageId, taskId, subtaskId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.delete(`${API_URL}/plans/${planId}/${stageId}/${taskId}/${subtaskId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getSubtasksByPlanId = (planId) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(`${API_URL}/plans/${planId}/subtasks`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getAllSubtasks = (planId, stageId, taskId, subtaskId) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(`${API_URL}/plans/${planId}/${stageId}/${taskId}/${subtaskId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

