import { apiClient, tokenStorage } from './apiClient';

export const authService = {
  // Legacy user fetcher - returns empty in live production
  async getUsers() {
    return [];
  },

  // Restore current user session from real MySQL backend via JWT
  async getCurrentUser() {
    const token = tokenStorage.get();
    if (!token) {
      return null;
    }

    try {
      const user = await apiClient.get('/auth/me');
      return user;
    } catch (err) {
      console.warn('Session expired or invalid token. Clearing credentials.');
      tokenStorage.remove();
      return null;
    }
  },

  // Real backend login with email and password
  async login(email, password) {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.token) {
      tokenStorage.set(res.token);
    }
    return res.user;
  },

  // Real backend register
  async register(data) {
    const res = await apiClient.post('/auth/register', data);
    if (res.token) {
      tokenStorage.set(res.token);
    }
    return res.user;
  },

  // Update user profile in MySQL
  async updateProfile(userId, updates) {
    return apiClient.patch('/users/me', updates);
  },

  // Real logout: revokes client token and calls backend
  async logout() {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (e) {
      // Ignore network errors during logout
    } finally {
      tokenStorage.remove();
    }
    return true;
  }
};
