import axios from 'axios';

const httpAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/planify',
  withCredentials: false,
});

httpAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpAuth;