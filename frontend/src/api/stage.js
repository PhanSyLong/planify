import axios from 'axios';

const API_URL = `http://localhost:8080/planify`;

export const createStage = async(stage) => {
    const token = localStorage.getItem("accessToken");
    return await axios.post(`${API_URL}/stages`, stage, {
	    headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const deleteStagebyPlanAndStageId = async(planId, stageId) => {
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

