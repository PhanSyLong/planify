import httpPublic from './httpPublic';
import httpAuth from './httpAuth';

export const authApi = {
  login: (payload) => httpPublic.post('/auth/token', payload),
  signup: (payload) => httpPublic.post('/users', payload),
  refresh: (token) => httpPublic.post('/auth/refresh', { token }),

  me: () => httpAuth.get('/users/myInfo'),
  logout: (token) => httpAuth.post('/auth/logout', { token }),
};