import axios from 'axios';

const API_URL = `http://localhost:8080/planify/plans`;

/**
 * Get all available tags grouped by category
 * Returns: { subject: [...], certificate: [...], other: [...] }
 */
export const getAllTags = async () => {
    const token = localStorage.getItem("accessToken");
    return await axios.get(`${API_URL}/tags`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

/**
 * Get tags for a specific plan
 * Returns: string[]
 */
export const getTagsByPlanId = async (planId) => {
    const token = localStorage.getItem("accessToken");
    return await axios.get(`${API_URL}/${planId}/tags`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

/**
 * Set/update tags for a plan (replaces existing tags)
 * @param planId - Plan ID
 * @param tags - Array of tag names (strings)
 */
export const setTagsForPlan = async (planId, tags) => {
    const token = localStorage.getItem("accessToken");
    return await axios.put(`${API_URL}/${planId}/tags`, tags, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};
