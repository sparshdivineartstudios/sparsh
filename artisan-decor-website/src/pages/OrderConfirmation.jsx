import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, amount } = location.state || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate('/products');
      return;
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://home-8zob.onrender.com/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <main className="min-h-screen pt-32 pb-24 px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-sans text-stone-500">Confirming your order...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-4xl mx-auto">
      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
        </motion.div>
        <h1 className="font-serif text-5xl text-stone-900 dark:text-stone-50 mb-3">Order Confirmed!</h1>
        <p className="font-sans text-lg text-stone-500">Thank you for your purchase. Your order has been placed successfully.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Order Number */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
            <p className="font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Order Number</p>
            <p className="font-serif text-2xl text-stone-900 dark:text-stone-50 break-all">{orderId}</p>
          </div>

          {/* Items Ordered */}
          {order?.items && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
              <h2 className="font-serif text-xl text-stone-900 dark:text-stone-50 mb-6">Items Ordered</h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between pb-4 border-b border-stone-200 dark:border-stone-800 last:border-0">
                    <div>
                      <p className="font-sans text-stone-900 dark:text-stone-50 font-semibold">
                        {item.productId?.name || 'Product'}
                      </p>
                      <p className="font-sans text-stone-500 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-serif text-amber-600 font-semibold">
                      ₹{(item.quantity * (item.productId?.priceNum || 0)).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {order?.shippingDetails && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
              <h2 className="font-serif text-xl text-stone-900 dark:text-stone-50 mb-6">Shipping Address</h2>
              <div className="font-sans text-stone-600 dark:text-stone-400 space-y-2">
                <p className="font-semibold text-stone-900 dark:text-stone-50">{order.shippingDetails.fullName}</p>
                <p>{order.shippingDetails.address}</p>
                <p>{order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.pincode}</p>
                <p className="mt-4 text-stone-900 dark:text-stone-50">{order.shippingDetails.phone}</p>
                <p className="text-stone-900 dark:text-stone-50">{order.shippingDetails.email}</p>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-8">
            <h3 className="font-serif text-lg text-blue-900 dark:text-blue-200 mb-4">What's Next?</h3>
            <ul className="font-sans text-sm space-y-3 text-blue-900 dark:text-blue-200">
              <li className="flex gap-3">
                <span className="text-lg">📧</span>
                <span>We'll send you an email confirmation shortly with all order details.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-lg">📦</span>
                <span>Your order will be carefully packed and shipped within 3-5 days.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-lg">🚚</span>
                <span>You'll receive tracking information once your package ships.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 h-fit sticky top-32"
        >
          <h3 className="font-serif text-lg text-stone-900 dark:text-stone-50 mb-6">Order Summary</h3>

          {order && (
            <div className="space-y-4 border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
              <div className="flex justify-between font-sans">
                <span className="text-stone-600 dark:text-stone-400">Subtotal</span>
                <span className="text-stone-900 dark:text-stone-50">
                  ₹{order.items.reduce((sum, item) => sum + (item.quantity * (item.productId?.priceNum || 0)), 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between font-sans">
                <span className="text-stone-600 dark:text-stone-400">Shipping</span>
                <span className="text-stone-900 dark:text-stone-50">₹150</span>
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="flex justify-between font-serif text-2xl font-semibold">
              <span className="text-stone-900 dark:text-stone-50">Total Paid</span>
              <span className="text-green-600">₹{order?.totalAmount.toLocaleString('en-IN') || amount?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/products"
              className="block text-center bg-amber-500 hover:bg-amber-400 text-stone-900 font-sans font-bold py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/favorites"
              className="block text-center border border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 font-sans font-bold py-3 rounded-lg transition-colors"
            >
              View Favorites
            </Link>
          </div>

          <p className="font-sans text-xs text-stone-500 text-center mt-6">
            Order confirmation has been sent to your email
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default OrderConfirmation;
