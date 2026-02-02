import httpAuth from './httpAuth';

export const createPlan = async (plan) =>
    await httpAuth.post(`/plans`, plan);

export const deletePlan = async (planId) =>
    await httpAuth.delete(`/plans/${planId}`);

export const updatePlan = async (planId, plan) =>
    await httpAuth.patch(`/plans/${planId}`, plan);

export const getPlanById = (id) =>
    httpAuth.get(`/plans/${id}`);

export const getAllPlans = async () =>
    await httpAuth.get(`/plans`);

export const bookmark = async (planId) =>
    await httpAuth.post(`/plans/${planId}/bookmark`, null);  // httpAuth.post/put/patch requires a body arg

export const unbookmark = async (planId) =>
    await httpAuth.delete(`/plans/${planId}/bookmark`);

export const getBookmarkedPlans = async (userId) =>
    await httpAuth.get(`/users/${userId}/bookmarks`);

export const getBookmarkers = async (planId) =>
    await httpAuth.get(`/plans/${planId}/bookmarkers`);

export const getPlanByName = (name) =>
    httpAuth.get(`/plans/${name}`);

export const forkPlan = async (planId) =>
    await httpAuth.post(`/plans/${planId}/fork`, null);  // httpAuth.post/put/patch requires a body arg

export const addForkRecord = async (originalId, adoptedId) =>
    await httpAuth.post(`/plans/${originalId}/fork_to/${adoptedId}`, null);  // httpAuth.post/put/patch requires a body arg

export const getPlanForks = async (planId) =>
    await httpAuth.get(`/plans/${planId}/forks`);

export const getForkOrigin = async (planId) =>
    await httpAuth.get(`/plans/${planId}/fork_origin`);

export const startPlan = async (planId) =>
    await httpAuth.patch(`/plans/${planId}/start`, {});

export const completePlan = async (planId) =>
    await httpAuth.patch(`/plans/${planId}/complete`, {});

export const searchPlans = ({ query, tags }) => {
    const params = {};
    if (query) params.query = query;
    if (tags?.length) params.tags = tags;

    return httpAuth.get(`/plans/filter`, { params });
};