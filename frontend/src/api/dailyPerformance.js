import axios from 'axios';

const API_URL = `http://localhost:8080/planify`;

export const getTodayDailyPerformance = () => {
    const token = localStorage.getItem("accessToken");

    return axios.get(`${API_URL}/daily-performance/today`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

// Record subtask start in daily_performance
export const recordSubtaskStart = (planId) => {
    const token = localStorage.getItem("accessToken");
    return axios.post(`${API_URL}/daily-performance/start?planId=${planId}`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

// Record subtask completion in daily_performance
export const recordSubtaskDone = (planId) => {
    const token = localStorage.getItem("accessToken");
    return axios.post(`${API_URL}/daily-performance/done?planId=${planId}`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

// Record subtask cancellation in daily_performance
export const recordSubtaskCancel = (planId) => {
    const token = localStorage.getItem("accessToken");
    return axios.post(`${API_URL}/daily-performance/cancel?planId=${planId}`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};

// Get weekly performance data for chart
export const getWeeklyPerformance = (startDate, endDate) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(`${API_URL}/daily-performance/weekly`, {
        params: { startDate, endDate },
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
};
