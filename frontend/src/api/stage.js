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

export const startStage = async (stageId) =>
    await httpAuth.patch(`/stages/${stageId}/start`, {});

export const completeStage = async (stageId) =>
    await httpAuth.patch(`/stages/${stageId}/complete`, {});
