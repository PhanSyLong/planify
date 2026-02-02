import httpAuth from './httpAuth';

export const createStage = async (stage) =>
    await httpAuth.post(`/stages`, stage);

export const deleteStagebyPlanAndStageId = async (planId, stageId) =>
    await httpAuth.delete(`/plans/${planId}/${stageId}`);

export const getStagesByPlanId = (planId) =>
    httpAuth.get(`/plans/${planId}/stages`);

export const getStageByPlanAndStageId = (planId, stageId) =>
    httpAuth.get(`/plans/${planId}/${stageId}`);

export const updateStage = async (stageId, stageData) =>
    await httpAuth.patch(`/stages/${stageId}`, stageData);

// May be replaced in the future
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
