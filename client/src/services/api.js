import axios from 'axios';

// Base Axios instance configured with credentials for HTTP-only cookies
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send and receive HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract server message or fallback to general error
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    
    // Attach friendly error structure
    return Promise.reject({
      ...error,
      friendlyMessage: message,
      status: error.response?.status,
      errors: error.response?.data?.errors,
    });
  }
);

export default api;
