import api from './api';

export const authService = {
  // Register new user (Step 1)
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Validate Step 1 before advancing
  async validateStepOne(data) {
    const response = await api.post('/auth/validate-step-one', data);
    return response.data;
  },

  // Log in user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Log out current user
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get authenticated user profile via session cookie
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
