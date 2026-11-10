import axios from 'axios';

// Support production backend domain or local proxy fallback
const customBase = import.meta.env.VITE_API_BASE_URL;
const baseURL = customBase
  ? `${customBase.replace(/\/+$/, '')}/api/v1`
  : '/api/v1';

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
