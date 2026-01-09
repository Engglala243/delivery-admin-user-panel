import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../api/services/order.service';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('Creating order with data:', orderData);
      const response = await orderService.createOrder(orderData);
      console.log('Order created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      return rejectWithValue(error.response?.data?.error || 'Failed to create order');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('fetchUserOrders called with params:', params);
      const response = await orderService.getUserOrders(params);
      console.log('Orders API full response:', response);
      console.log('Orders API response.data:', response.data);
      return response.data;
    } catch (error) {
      console.error('fetchUserOrders error:', error);
      console.error('Error response:', error.response);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      console.log('fetchOrderById called with orderId:', orderId);
      const response = await orderService.getOrderById(orderId);
      console.log('fetchOrderById response:', response);
      return response.data;
    } catch (error) {
      console.error('fetchOrderById error:', error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to cancel order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    selectedOrder: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  },
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('createOrder pending');
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('createOrder fulfilled with:', action.payload);
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('createOrder rejected with:', action.payload);
      })
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('fetchUserOrders pending');
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('fetchUserOrders fulfilled with data:', action.payload);
        console.log('Data type:', typeof action.payload);
        console.log('Is array:', Array.isArray(action.payload));
        
        // Handle both array and object responses
        if (Array.isArray(action.payload)) {
          state.orders = action.payload;
          console.log('Set orders directly from array, count:', action.payload.length);
        } else if (action.payload && Array.isArray(action.payload.orders)) {
          state.orders = action.payload.orders;
          console.log('Set orders from payload.orders, count:', action.payload.orders.length);
          if (action.payload.pagination) {
            state.pagination = action.payload.pagination;
          }
        } else if (action.payload && action.payload.data && Array.isArray(action.payload.data)) {
          state.orders = action.payload.data;
          console.log('Set orders from payload.data, count:', action.payload.data.length);
        } else {
          console.log('No valid orders found in payload, setting empty array');
          state.orders = [];
        }
        
        console.log('Final orders state:', state.orders);
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('fetchUserOrders rejected with error:', action.payload);
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('fetchOrderById pending');
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('fetchOrderById fulfilled with:', action.payload);
        // Handle different response formats
        if (action.payload && action.payload.data) {
          state.selectedOrder = action.payload.data;
        } else {
          state.selectedOrder = action.payload;
        }
        console.log('selectedOrder set to:', state.selectedOrder);
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('fetchOrderById rejected with:', action.payload);
      })
      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.selectedOrder && state.selectedOrder._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
      });
  },
});

export const { clearSelectedOrder, clearError, setPagination } = orderSlice.actions;
export default orderSlice.reducer;