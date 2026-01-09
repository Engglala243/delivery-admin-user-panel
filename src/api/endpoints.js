export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    REFRESH_TOKEN: '/auth/refresh',
  },
  
  // Product endpoints
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: (id) => `/products/${id}`,
    SEARCH: '/products/search',
    BY_CATEGORY: (categoryId) => `/products/category/${categoryId}`,
  },
  
  // Category endpoints
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_BY_ID: (id) => `/categories/${id}`,
  },
  
  // Order endpoints
  ORDERS: {
    CREATE: '/orders',
    GET_USER_ORDERS: '/orders/user',
    GET_BY_ID: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
  },
  
  // User endpoints
  USERS: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    GET_ADDRESSES: '/users/addresses',
    ADD_ADDRESS: '/users/addresses',
    UPDATE_ADDRESS: (id) => `/users/addresses/${id}`,
    DELETE_ADDRESS: (id) => `/users/addresses/${id}`,
  },
};