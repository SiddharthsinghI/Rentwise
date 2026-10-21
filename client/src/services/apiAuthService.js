import { apiClient, tokenStorage } from './apiClient';

export const apiAuthService = {
  async register(data) {
    const res = await apiClient.post('/auth/register', data);
    if (res.token) {
      tokenStorage.set(res.token);
    }
    return res.user;
  },

  async login(email, password) {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.token) {
      tokenStorage.set(res.token);
    }
    return res.user;
  },

  async getMe() {
    return apiClient.get('/auth/me');
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout', {});
    } finally {
      tokenStorage.remove();
    }
  }
};
