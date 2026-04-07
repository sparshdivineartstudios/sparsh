import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://home-8zob.onrender.com';
        const response = await fetch(`${apiUrl}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, token, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 dark:bg-green-950';
      case 'processing':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950';
      case 'pending':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950';
      case 'cancelled':
        return 'text-red-600 bg-red-50 dark:bg-red-950';
      default:
        return 'text-stone-600 bg-stone-50 dark:bg-stone-950';
    }
  };

  const getStatusLabel = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending';
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-32 pb-24 px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-sans text-stone-500">Loading your orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="font-serif text-5xl text-stone-900 dark:text-stone-50 mb-2">Order History</h1>
        <p className="font-sans text-stone-500">View and track all your orders</p>
      </motion.div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">📦</span>
          </div>
          <p className="font-sans text-lg text-stone-900 dark:text-stone-50 mb-2">No orders yet</p>
          <p className="font-sans text-stone-500 mb-6">Start shopping to create your first order</p>
          <Link
            to="/products"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-stone-900 font-sans font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-4"
        >
          {orders.map((order, idx) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/order/${order._id}`)}
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Order ID */}
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-stone-500 mb-1">Order ID</p>
                  <p className="font-serif text-sm text-stone-900 dark:text-stone-50 break-all">{order._id.slice(-8).toUpperCase()}</p>
                </div>

                {/* Date */}
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-stone-500 mb-1">Date</p>
                  <p className="font-sans text-sm text-stone-900 dark:text-stone-50">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-stone-500 mb-1">Amount</p>
                  <p className="font-serif text-lg text-amber-600">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                </div>

                {/* Items */}
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-stone-500 mb-1">Items</p>
                  <p className="font-sans text-sm text-stone-900 dark:text-stone-50">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest text-stone-500 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.paymentStatus)}`}>
                      {getStatusLabel(order.paymentStatus)}
                    </span>
                  </div>
                  <span className="text-2xl text-stone-400 dark:text-stone-600">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
};

export default OrderHistory;
