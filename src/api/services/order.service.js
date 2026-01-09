import api from '../axios.config';
import { API_ENDPOINTS } from '../endpoints';

const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    console.log('orderService.createOrder called with:', orderData);
    const response = await api.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
    console.log('orderService.createOrder response:', response);
    return response;
  },

  // Get user orders
  getUserOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_ENDPOINTS.ORDERS.GET_USER_ORDERS}?${queryString}` : API_ENDPOINTS.ORDERS.GET_USER_ORDERS;
    console.log('Fetching orders from:', url);
    return await api.get(url);
  },

  // Get order by ID
  getOrderById: async (id) => {
    console.log('orderService.getOrderById called with id:', id);
    const response = await api.get(API_ENDPOINTS.ORDERS.GET_BY_ID(id));
    console.log('orderService.getOrderById response:', response);
    return response;
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