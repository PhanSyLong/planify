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