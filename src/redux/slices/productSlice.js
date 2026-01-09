import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../api/services/product.service';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch product');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Search failed');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    categories: [],
    selectedProduct: null,
    searchResults: [],
    isLoading: false,
    error: null,
    filters: {
      category: '',
      priceRange: [0, 1000],
      sortBy: 'name',
    },
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || action.payload.products || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data || action.payload;
      })
      // Search Products
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

export const { 
  setFilters, 
  setPagination, 
  clearSelectedProduct, 
  clearSearchResults, 
  clearError 
} = productSlice.actions;

export default productSlice.reducer;