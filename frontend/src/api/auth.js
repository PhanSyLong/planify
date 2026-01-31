// auth.js
import httpPublic from './httpPublic';
import httpAuth from './httpAuth';

export const authApi = {
  login: (payload) => httpPublic.post('/auth/token', payload),
  signup: (payload) => httpPublic.post('/users', payload),
  refresh: (token) => httpPublic.post('/auth/refresh', { token }),
  logout: (token) => httpPublic.post('/auth/logout', { token }),

  me: () => httpAuth.get('/users/myInfo'),
};