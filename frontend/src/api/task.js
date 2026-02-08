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

export const startTask = async (taskId) =>
    await httpAuth.patch(`/tasks/${taskId}/start`, {});

export const completeTask = async (taskId) =>
    await httpAuth.patch(`/tasks/${taskId}/complete`, {});