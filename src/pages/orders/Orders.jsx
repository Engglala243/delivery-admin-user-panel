import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserOrders } from '../../redux/slices/orderSlice';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Ensure orders is always an array
  const ordersList = Array.isArray(orders) ? orders : [];

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Orders component mounted, fetching orders for authenticated user');
      dispatch(fetchUserOrders());
    } else {
      console.log('User not authenticated, skipping order fetch');
    }
  }, [dispatch, isAuthenticated]);

  // Also fetch orders when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        console.log('Page became visible, refreshing orders');
        dispatch(fetchUserOrders());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dispatch, isAuthenticated]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-gray-200 text-black';
      case 'confirmed':
        return 'bg-gray-300 text-black';
      case 'preparing':
        return 'bg-gray-400 text-black';
      case 'out_for_delivery':
        return 'bg-gray-500 text-white';
      case 'delivered':
        return 'bg-black text-white';
      case 'cancelled':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-100 text-black';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h1>
          <p className="text-gray-600 mb-4">Please login to view your orders</p>
          <Link to="/login" className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('Orders component - showing error state');
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h1>
          <p className="text-black mb-4">{typeof error === 'string' ? error : 'Failed to load orders'}</p>
          <button
            onClick={() => dispatch(fetchUserOrders())}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  console.log('Orders component - ordersList:', ordersList);
  console.log('Orders component - ordersList.length:', ordersList.length);
  console.log('Orders component - isLoading:', isLoading);
  console.log('Orders component - error:', error);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

      {ordersList.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
          <Link to="/products" className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {ordersList.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id?.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      getStatusColor(order.status)
                    }`}>
                      {order.status?.replace('_', ' ').toUpperCase()}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Items ({order.items?.length || 0})</h4>
                  <div className="space-y-3">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {item.product?.images && item.product.images.length > 0 ? (
                          <>
                            <img
                              src={getImageUrl(item.product.images[0])}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                              onError={handleImageError}
                            />
                            <div className="hidden w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                          </>
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product?.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatPrice(item.quantity * item.price)}
                        </p>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <p className="text-sm text-gray-600 text-center py-2">
                        +{order.items.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t pt-4 mt-4 flex justify-between items-center">
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-black hover:text-gray-700 font-medium transition-colors"
                  >
                    View Details
                  </Link>
                  {order.status === 'pending' && (
                    <button className="text-black hover:text-gray-700 font-medium">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;