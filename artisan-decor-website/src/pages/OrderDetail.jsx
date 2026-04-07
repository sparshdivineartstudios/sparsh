import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://home-8zob.onrender.com';
        const response = await fetch(`${apiUrl}/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          let data = await response.json();
          
          // Fetch product details for items that don't have prices
          if (data.items && data.items.length > 0) {
            const itemsWithPrices = await Promise.all(
              data.items.map(async (item) => {
                // If item already has a price, use it
                if (item.price && item.price > 0) {
                  return item;
                }
                
                // If no productId, skip fetching
                if (!item.productId) {
                  return item;
                }
                
                // Otherwise, fetch product details to get price
                try {
                  const productRes = await fetch(`${apiUrl}/api/products/${item.productId}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    }
                  });
                  
                  if (productRes.ok) {
                    const product = await productRes.json();
                    return {
                      ...item,
                      price: typeof product.price === 'string' 
                        ? parseFloat(product.price.replace(/[₹\s]/g, '')) 
                        : (product.price || product.priceNum || item.price || 0),
                        name: product.name || item.name,
                        image: product.image || item.image
                    };
                  }
                } catch (e) {
                  console.error('Error fetching product details:', e);
                }
                
                return item;
              })
            );
            
            data = { ...data, items: itemsWithPrices };
          }
          
          setOrder(data);
        } else if (response.status === 401) {
          navigate('/login');
        } else {
          setError('Order not found');
          setTimeout(() => navigate('/order-history'), 2000);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Error loading order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token, navigate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      default:
        return 'bg-stone-100 text-stone-800 dark:bg-stone-950 dark:text-stone-200';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-32 pb-24 px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-sans text-stone-500">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen pt-32 pb-24 px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="font-sans text-red-600 mb-4">{error}</p>
          <Link
            to="/order-history"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-stone-900 font-sans font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen pt-32 pb-24 px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="font-sans text-stone-500">Order not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <Link
            to="/order-history"
            className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 transition-colors"
          >
            ← Back to Orders
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl text-stone-900 dark:text-stone-50 mb-1">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="font-sans text-stone-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`font-sans text-sm font-semibold px-4 py-2 rounded-full w-fit ${getStatusColor(order.orderStatus || 'pending')}`}>
            {(order.orderStatus || 'pending').toUpperCase()}
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Items Ordered */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
            <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-50 mb-6">Items Ordered</h2>
            <div className="space-y-6">
              {order.items && order.items.map((item, idx) => {
                const price = item.price || 
                  (typeof item.productId?.price === 'string' 
                    ? parseFloat(item.productId.price.replace(/[₹\s]/g, '')) 
                    : item.productId?.price) || 
                  item.productId?.priceNum || 0;
                const totalPrice = item.quantity * price;

                return (
                  <div key={idx} className="flex gap-6 pb-6 border-b border-stone-200 dark:border-stone-800 last:border-0 last:pb-0">
                    <div className="flex-shrink-0">
                      {(item.image || item.productId?.image) ? (
                        <img
                          src={item.image || item.productId?.image}
                          alt={item.name || item.productId?.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-stone-200 dark:bg-stone-800 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-sans font-semibold text-stone-900 dark:text-stone-50 mb-2">
                        {item.name || item.productId?.name || 'Product'}
                      </h3>
                      <p className="font-sans text-sm text-stone-500 mb-3">
                        {item.productId?.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-sans text-sm text-stone-500">Price</p>
                          <p className="font-serif text-lg text-stone-900 dark:text-stone-50">
                            ₹{price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div>
                          <p className="font-sans text-sm text-stone-500">Quantity</p>
                          <p className="font-serif text-lg text-stone-900 dark:text-stone-50">
                            {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-sans text-sm text-stone-500">Subtotal</p>
                          <p className="font-serif text-lg font-semibold text-amber-600">
                            ₹{totalPrice.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingDetails && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
              <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-50 mb-6">Shipping Address</h2>
              <div className="font-sans text-stone-600 dark:text-stone-400 space-y-3">
                <div>
                  <p className="font-semibold text-stone-900 dark:text-stone-50">{order.shippingDetails.fullName}</p>
                  <p>{order.shippingDetails.phone}</p>
                </div>
                <div>
                  <p>{order.shippingDetails.address}</p>
                  <p>{order.shippingDetails.city}, {order.shippingDetails.state}</p>
                  <p>PIN: {order.shippingDetails.pincode}</p>
                </div>
                <div>
                  <p>{order.shippingDetails.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
            <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-50 mb-6">Payment Information</h2>
            <div className="space-y-3 font-sans">
              <div className="flex justify-between">
                <span className="text-stone-600 dark:text-stone-400">Payment Status</span>
                <span className={`font-semibold px-3 py-1 rounded ${
                  order.paymentStatus === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
                }`}>
                  {order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                </span>
              </div>
              {order.razorpayOrderId && (
                <div className="flex justify-between">
                  <span className="text-stone-600 dark:text-stone-400">Razorpay Order ID</span>
                  <span className="text-stone-900 dark:text-stone-50 font-mono text-sm">
                    {order.razorpayOrderId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Summary Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 h-fit sticky top-32"
        >
          <h3 className="font-serif text-xl text-stone-900 dark:text-stone-50 mb-6">Order Summary</h3>

          <div className="space-y-4 border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
            <div className="flex justify-between font-sans text-sm">
              <span className="text-stone-600 dark:text-stone-400">Subtotal</span>
              <span className="text-stone-900 dark:text-stone-50">
                ₹{(order.totalAmount - 150).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between font-sans text-sm">
              <span className="text-stone-600 dark:text-stone-400">Shipping</span>
              <span className="text-stone-900 dark:text-stone-50">₹150</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between font-serif text-2xl font-semibold">
              <span className="text-stone-900 dark:text-stone-50">Total</span>
              <span className="text-green-600">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Timeline */}
          {order.timeline && (
            <div className="space-y-4">
              <h4 className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-50">Order Status</h4>
              <div className="space-y-3">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mt-1.5"></div>
                    </div>
                    <div>
                      <p className="font-sans text-xs font-semibold text-stone-900 dark:text-stone-50">
                        {event.status}
                      </p>
                      <p className="font-sans text-xs text-stone-500">
                        {formatDate(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <Link
              to="/products"
              className="w-full block text-center bg-amber-500 hover:bg-amber-600 text-stone-900 font-sans font-bold py-2 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default OrderDetail;
