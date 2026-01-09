import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('userCart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('userCart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
    isOpen: false,
    totalItems: 0,
    totalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product._id === product._id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          price: product.price,
        });
      }
      
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state.items);
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product._id !== productId);
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state.items);
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product._id === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.product._id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state.items);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      localStorage.removeItem('userCart');
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    closeCart: (state) => {
      state.isOpen = false;
    },
    
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;