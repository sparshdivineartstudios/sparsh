import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';

const Account = () => {
  const { user, token, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        await refreshUser();
        
        // Try to fetch user's orders, but don't block if it fails
        try {
          const ordersResponse = await axios.get(`${API_URL}/api/orders/my-orders`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOrders(ordersResponse.data.orders || []);
        } catch (ordersErr) {
          console.warn('Orders endpoint not available:', ordersErr);
          // Don't show error for missing orders endpoint, just set empty array
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        // Still show profile even if orders fail
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token, navigate, refreshUser]);

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600 dark:text-stone-400">Loading your account...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 dark:text-stone-50 font-light mb-2">
            My Account
          </h1>
          <p className="text-stone-600 dark:text-stone-400">Manage your profile and orders</p>
        </motion.div>

        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200"
          >
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-200"
          >
            {success}
          </motion.div>
        )}

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-6 sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile', icon: 'user' },
                  { id: 'orders', label: 'Orders', icon: 'shopping' },
                  { id: 'settings', label: 'Settings', icon: 'gear' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-semibold'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <hr className="my-6 border-stone-200 dark:border-stone-800" />
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-medium"
              >
                Logout
              </button>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-3"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-8">
                <h2 className="font-serif text-2xl md:text-3xl text-stone-900 dark:text-stone-50 mb-6 font-light">
                  Profile Information
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                      Full Name
                    </label>
                    <p className="text-lg text-stone-900 dark:text-stone-50">{user.name}</p>
                  </div>

                  {user.username && (
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                        Username
                      </label>
                      <p className="text-lg text-stone-900 dark:text-stone-50">@{user.username}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                      Email Address
                    </label>
                    <p className="text-lg text-stone-900 dark:text-stone-50">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                      Account Status
                    </label>
                    <p className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                      Active
                    </p>
                  </div>

                  {user.emailSubscribed && (
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                        Newsletters
                      </label>
                      <p className="text-stone-600 dark:text-stone-400">You are subscribed to our newsletter for updates and new releases.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-8">
                <h2 className="font-serif text-2xl md:text-3xl text-stone-900 dark:text-stone-50 mb-6 font-light">
                  Order History
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-stone-600 dark:text-stone-400 mb-4">You haven't placed any orders yet.</p>
                    <a
                      href="/#/products"
                      className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:from-amber-700 hover:to-amber-800"
                    >
                      Browse Gallery
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div
                        key={order._id}
                        className="border border-stone-200 dark:border-stone-800 rounded-lg p-6 hover:border-amber-600 dark:hover:border-amber-600 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm text-stone-600 dark:text-stone-400">Order ID: {order._id}</p>
                            <p className="text-lg font-semibold text-stone-900 dark:text-stone-50">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400">
                          Total: <span className="text-xl font-semibold text-amber-600">₹{order.totalAmount}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-8">
                <h2 className="font-serif text-2xl md:text-3xl text-stone-900 dark:text-stone-50 mb-6 font-light">
                  Account Settings
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={user.emailSubscribed}
                        className="w-4 h-4 rounded accent-amber-600"
                      />
                      <span className="text-stone-700 dark:text-stone-300">
                        Subscribe to newsletter for new releases and updates
                      </span>
                    </label>
                  </div>

                  <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
                    <h3 className="font-semibold text-stone-900 dark:text-stone-50 mb-3">Danger Zone</h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                      Delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button
                      className="px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-medium"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Account;
