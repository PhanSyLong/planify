import axios from 'axios';
import { authApi } from './auth';

const httpAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/planify',
  withCredentials: true,
});

httpAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpAuth.interceptors.response.use(
  res => res, 
  err => {
    if (err.response?.status === 401){
      authApi.logout();
      window.location.href = "/";  // Restart App completely
    }
    return Promise.reject(err);
  }
);

export default httpAuth;