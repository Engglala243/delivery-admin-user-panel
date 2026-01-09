import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import { getProfile } from './redux/slices/authSlice';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize cart totals on app load
    const cartItems = JSON.parse(localStorage.getItem('userCart') || '[]');
    if (cartItems.length > 0) {
      store.dispatch({ type: 'cart/calculateTotals' });
    }
  }, [dispatch]);

  return (
    <div className="App">
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;