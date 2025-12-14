import axios from 'axios';

const httpPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/planify',
});

export default httpPublic;