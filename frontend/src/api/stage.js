import axios from 'axios';

const API_URL = `http://localhost:8080/planify`;

export const createStage = async (stage) => {
    const token = localStorage.getItem("accessToken");
    return await axios.post(`${API_URL}/stages`, stage, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const deleteStagebyPlanAndStageId = async (planId, stageId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.delete(`${API_URL}/plans/${planId}/${stageId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getStagesByPlanId = (planId) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(`${API_URL}/plans/${planId}/stages`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getStageByPlanAndStageId = (planId, stageId) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(`${API_URL}/plans/${planId}/${stageId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const updateStage = async (stageId, stageData) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/stages/${stageId}`, stageData, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const startStage = async (stageId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/stages/${stageId}/start`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const completeStage = async (stageId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/stages/${stageId}/complete`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};
