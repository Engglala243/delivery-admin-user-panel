import api from '../axios.config';
import { API_ENDPOINTS } from '../endpoints';

const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    return await api.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
  },

  // Get user orders
  getUserOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`${API_ENDPOINTS.ORDERS.GET_USER_ORDERS}?${queryString}`);
  },

  // Get order by ID
  getOrderById: async (id) => {
    return await api.get(API_ENDPOINTS.ORDERS.GET_BY_ID(id));
  },

  // Cancel order
  cancelOrder: async (id) => {
    return await api.put(API_ENDPOINTS.ORDERS.CANCEL(id));
  },

  // Update order status (for admin use)
  updateOrderStatus: async (id, status) => {
    return await api.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status });
  },
};

export default orderService;