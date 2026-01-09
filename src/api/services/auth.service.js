import api from '../axios.config';
import { API_ENDPOINTS } from '../endpoints';

const authService = {
  // User registration
  register: async (userData) => {
    return await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  // User login
  login: async (credentials) => {
    return await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  // Get user profile
  getProfile: async () => {
    return await api.get(API_ENDPOINTS.AUTH.PROFILE);
  },

  // Update user profile
  updateProfile: async (userData) => {
    return await api.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, userData);
  },

  // Refresh token
  refreshToken: async () => {
    return await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem('userToken');
  },
};

export default authService;