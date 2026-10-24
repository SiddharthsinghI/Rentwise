/**
 * RentWise Backend API Client (Phase 2 & Phase 3 Integration Layer)
 * Connects to the Express backend when full backend mode is activated.
 */

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');
const TOKEN_KEY = 'rentwise_auth_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY)
};

export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = tokenStorage.get();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = result.error?.message || result.message || 'An API error occurred';
      const error = new Error(errorMessage);
      error.statusCode = response.status;
      error.details = result.error?.details;
      throw error;
    }

    return result.data !== undefined ? result.data : result;
  },

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  },

  post(endpoint, body, headers = {}) {
    return this.request(endpoint, { method: 'POST', body, headers });
  },

  patch(endpoint, body, headers = {}) {
    return this.request(endpoint, { method: 'PATCH', body, headers });
  },

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
};
