import httpAuth from './httpAuth';

export const createSubtask = async (subtask) =>
    await httpAuth.post(`/subtasks`, subtask);

export const deleteSubtask = async (planId, stageId, taskId, subtaskId) =>
    await httpAuth.delete(`/plans/${planId}/${stageId}/${taskId}/${subtaskId}`);

export const getSubtasksByPlanId = (planId) =>
    httpAuth.get(`/plans/${planId}/subtasks`);

export const getAllSubtasks = (planId, stageId, taskId, subtaskId) =>
    httpAuth.get(`/plans/${planId}/${stageId}/${taskId}/${subtaskId}`);

export const updateSubtask = async (subtaskId, subtaskData) =>
    await httpAuth.patch(`/subtasks/${subtaskId}`, subtaskData);

// May be replaced
export const startSubtask = async (subtaskId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/subtasks/${subtaskId}/start`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const completeSubtask = async (subtaskId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/subtasks/${subtaskId}/complete`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};
