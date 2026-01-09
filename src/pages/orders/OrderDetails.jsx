import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../../redux/slices/orderSlice';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedOrder, isLoading, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('OrderDetails component mounted with id:', id);
    console.log('isAuthenticated:', isAuthenticated);
    if (isAuthenticated && id) {
      console.log('Dispatching fetchOrderById for id:', id);
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id, isAuthenticated]);

  console.log('OrderDetails render - selectedOrder:', selectedOrder);
  console.log('OrderDetails render - isLoading:', isLoading);
  console.log('OrderDetails render - error:', error);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h1>
          <p className="text-gray-600 mb-4">Please login to view order details</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Login
          </button>
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
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h1>
          <p className="text-black mb-4">{typeof error === 'string' ? error : 'Failed to load order details'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!selectedOrder) {
    console.log('selectedOrder is null/undefined, showing not found message');
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="text-black hover:text-gray-700 font-medium transition-colors"
        >
          ← Back to Orders
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <div className="p-6">
          {/* Order Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{selectedOrder._id?.slice(-8) || 'Unknown'}
              </h1>
              <p className="text-gray-600">
                Placed on {selectedOrder.createdAt ? formatDate(selectedOrder.createdAt) : 'Unknown Date'}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                getStatusColor(selectedOrder.status)
              }`}>
                {selectedOrder.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {selectedOrder.totalAmount ? formatPrice(selectedOrder.totalAmount) : '$0.00'}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Items ({selectedOrder.items?.length || 0})
            </h2>
            <div className="space-y-4">
              {selectedOrder.items?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  {item.product?.images && item.product.images.length > 0 ? (
                    <img
                      src={getImageUrl(item.product.images[0])}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                    <p className="text-gray-600">
                      Quantity: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.quantity * item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            {/* Delivery Address */}
            {selectedOrder.deliveryAddress && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
                <div className="text-gray-600">
                  <p>{selectedOrder.deliveryAddress.street}</p>
                  <p>
                    {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} {selectedOrder.deliveryAddress.zipCode}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
              <p className="text-gray-600 capitalize">
                {selectedOrder.paymentMethod || 'Cash on Delivery'}
              </p>
            </div>
          </div>

          {/* Driver Information */}
          {selectedOrder.driver && (
            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Driver Information</h3>
              <div className="text-gray-600">
                <p>Name: {selectedOrder.driver.name}</p>
                {selectedOrder.driver.phone && (
                  <p>Phone: {selectedOrder.driver.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">
                  {formatPrice((selectedOrder.totalAmount || 0) - 2.99)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="text-gray-900">{formatPrice(2.99)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{selectedOrder.totalAmount ? formatPrice(selectedOrder.totalAmount) : '$0.00'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;