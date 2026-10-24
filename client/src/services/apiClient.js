/**
 * RentWise Backend API Client (Phase 2 & Phase 3 Integration Layer)
 * Connects to the Express backend when full backend mode is activated.
 */

export const PRODUCTION_API_URL = 'https://rentwise-zeta.vercel.app/api';
export const LOCAL_API_URL = 'http://localhost:5000/api';

/**
 * Resolves the API base URL:
 * 1. Uses import.meta.env.VITE_API_URL if configured.
 * 2. In production builds or when running on a deployed host (e.g. Vercel),
 *    falls back to the deployed production backend (https://rentwise-zeta.vercel.app/api).
 * 3. In local development on localhost/127.0.0.1, falls back to http://localhost:5000/api.
 * 4. Ensures the /api path is present without duplicating it.
 * 5. Strips trailing slashes.
 */
export const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  let base = (envUrl && envUrl.trim()) || '';

  if (!base) {
    const isProduction =
      import.meta.env.PROD ||
      (typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1');

    base = isProduction ? PRODUCTION_API_URL : LOCAL_API_URL;
  }

  // Strip trailing slashes
  let sanitized = base.trim().replace(/\/+$/, '');

  // Ensure /api prefix is present without duplicating it
  if (!sanitized.endsWith('/api')) {
    sanitized = `${sanitized}/api`;
  }

  return sanitized;
};

const TOKEN_KEY = 'rentwise_auth_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY)
};

export const apiClient = {
  getBaseUrl() {
    return resolveApiBaseUrl();
  },

  async request(endpoint, options = {}) {
    const base = this.getBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${base}${cleanEndpoint}`;
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
