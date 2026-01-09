import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/home/Home';
import Products from '../pages/products/Products';
import ProductDetail from '../pages/products/ProductDetail';
import Cart from '../pages/cart/Cart';
import Checkout from '../pages/cart/Checkout';
import Orders from '../pages/orders/Orders';
import OrderDetail from '../pages/orders/OrderDetail';
import Profile from '../pages/profile/Profile';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={isAuthenticated ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />
        <Route path="orders/:id" element={isAuthenticated ? <OrderDetail /> : <Navigate to="/login" />} />
        <Route path="profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;