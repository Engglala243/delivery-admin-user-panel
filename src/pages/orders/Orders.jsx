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
      console.log('Fetching orders for authenticated user');
      dispatch(fetchUserOrders());
    } else {
      console.log('User not authenticated, skipping order fetch');
    }
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
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h1>
          <p className="text-gray-600 mb-4">Please login to view your orders</p>
          <Link to="/login" className="btn-primary">
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h1>
          <p className="text-red-600 mb-4">{typeof error === 'string' ? error : 'Failed to load orders'}</p>
          <button
            onClick={() => dispatch(fetchUserOrders())}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

      {ordersList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
          <Link to="/products" className="btn-primary">
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
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details
                  </Link>
                  {order.status === 'pending' && (
                    <button className="text-red-600 hover:text-red-700 font-medium">
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