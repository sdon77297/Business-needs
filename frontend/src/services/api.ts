import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
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
