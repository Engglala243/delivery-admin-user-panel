import api from '../axios.config';
import { API_ENDPOINTS } from '../endpoints';

const productService = {
  // Get all products with optional filters
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`${API_ENDPOINTS.PRODUCTS.GET_ALL}?${queryString}`);
  },

  // Get product by ID
  getProductById: async (id) => {
    return await api.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id));
  },

  // Search products
  searchProducts: async (query) => {
    return await api.get(`${API_ENDPOINTS.PRODUCTS.SEARCH}?q=${encodeURIComponent(query)}`);
  },

  // Get products by category
  getProductsByCategory: async (categoryId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`${API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId)}?${queryString}`);
  },

  // Get all categories
  getCategories: async () => {
    return await api.get(API_ENDPOINTS.CATEGORIES.GET_ALL);
  },

  // Get category by ID
  getCategoryById: async (id) => {
    return await api.get(API_ENDPOINTS.CATEGORIES.GET_BY_ID(id));
  },
};

export default productService;