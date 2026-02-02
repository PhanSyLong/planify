import httpAuth from './httpAuth';

export const createTask = async (task) =>
    await httpAuth.post(`/tasks`, task);

export const deleteTask = async (planId, stageId, taskId) =>
    await httpAuth.delete(`/plans/${planId}/${stageId}/${taskId}`);

export const getTasksByPlanId = (planId) =>
    httpAuth.get(`/plans/${planId}/tasks`);

export const getAllTasks = (planId, stageId) =>
    httpAuth.get(`/plans/${planId}/${stageId}/tasks`);

export const updateTask = async (taskId, taskData) =>
    await httpAuth.patch(`/tasks/${taskId}`, taskData);

// To be replaced
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