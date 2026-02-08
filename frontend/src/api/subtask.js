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

export const startSubtask = async (subtaskId) =>
    await httpAuth.patch(`/subtasks/${subtaskId}/start`, {});

export const completeSubtask = async (subtaskId) =>
    await httpAuth.patch(`/subtasks/${subtaskId}/complete`, {});

export const getTodoList = (userId) =>
    httpAuth.get(`/users/${userId}/todo`);

export const getSubtaskProgress = (planId, stageId, taskId, subtaskId) =>
    httpAuth.get(`/plans/${planId}/${stageId}/${taskId}/${subtaskId}/progress`);
