import httpAuth from './httpAuth';

export const createPlan = async(plan) =>
    await httpAuth.post(`/plans`, plan);

export const deletePlan = async(planId) =>
    await httpAuth.delete(`/plans/${planId}`);

export const updatePlan = async(planId, plan) =>
    await httpAuth.patch(`/plans/${planId}`, plan);

export const getPlanById = (id) =>
    httpAuth.get(`/plans/${id}`);

export const createPlan = async (plan) => {
    const token = localStorage.getItem("accessToken");
    return await axios.post(API_URL, plan, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};
export const getAllPlans = async() =>
    await httpAuth.get(`/plans`);

export const deletePlan = async (planId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.delete(`${API_URL}/${planId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};
export const bookmark = async(planId) =>
    await httpAuth.post(`/plans/${planId}/bookmark`, null);  // httpAuth.post/put/patch requires a body arg

export const unbookmark = async(planId) =>
    await httpAuth.delete(`/plans/${planId}/bookmark`);

export const getBookmarkedPlans = async(userId) =>
    await httpAuth.get(`/users/${userId}/bookmarks`);

export const getBookmarkers = async(planId) =>
    await httpAuth.get(`/plans/${planId}/bookmarkers`);

export const updatePlan = async (planId, plan) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/${planId}`, plan, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const getPlanByName = (name) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(`${API_URL}/${name}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const forkPlan = async(planId) =>
    await httpAuth.post(`/plans/${planId}/fork`, null);  // httpAuth.post/put/patch requires a body arg

export const addForkRecord = async(originalId, adoptedId) =>
    await httpAuth.post(`/plans/${originalId}/fork_to/${adoptedId}`, null);  // httpAuth.post/put/patch requires a body arg

export const getPlanForks = async(planId) =>
    await httpAuth.get(`/plans/${planId}/forks`);

export const getForkOrigin = async(planId) =>
    await httpAuth.get(`/plans/${planId}/fork_origin`);

export const getAllPlans = async () => {
    const token = localStorage.getItem("accessToken");
    return await axios.get(API_URL, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const startPlan = async (planId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/${planId}/start`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

export const completePlan = async (planId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.patch(`${API_URL}/${planId}/complete`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};
