import axios from 'axios';

// Support production backend domain (with or without https:// protocol) or local proxy fallback
const customBase = import.meta.env.VITE_API_BASE_URL;
let baseURL = '/api/v1';

if (customBase) {
  const cleanBase = customBase.trim().replace(/\/+$/, '');
  const withProtocol = cleanBase.startsWith('http://') || cleanBase.startsWith('https://')
    ? cleanBase
    : `https://${cleanBase}`;
  baseURL = `${withProtocol}/api/v1`;
}

export const api = axios.create({
  baseURL,
  withCredentials: true, // Send HttpOnly cookies with all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred during the request.';
    return Promise.reject(new Error(message));
  }
);
