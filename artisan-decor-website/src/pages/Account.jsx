import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';

const Account = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    // Handle redirect if not authenticated
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Only fetch once on mount
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Populate form with current user data
        if (user) {
          setFormData({
            name: user.name || '',
            email: user.email || ''
          });
          setEmailSubscribed(user.emailSubscribed || false);
        }
        
        // Try to fetch user's orders
        try {
          const ordersResponse = await axios.get(`${API_URL}/api/orders/my-orders`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOrders(ordersResponse.data.orders || []);
        } catch (ordersErr) {
          console.warn('Orders endpoint not available:', ordersErr);
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Only depend on token, not navigate

  // Update checkbox state when user object changes
  useEffect(() => {
    if (user) {
      setEmailSubscribed(user.emailSubscribed || false);
    }
  }, [user?.emailSubscribed]);

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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleteLoading(true);
      await axios.delete(`${API_URL}/api/auth/delete-account`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Account deleted successfully');
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleNewsletterToggle = async (e) => {
    const isChecked = e.target.checked;
    setEmailSubscribed(isChecked);
    
    try {
      setNewsletterLoading(true);
      setError('');
      
      await axios.put(
        `${API_URL}/api/auth/update-newsletter`,
        { emailSubscribed: isChecked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(isChecked ? 'Successfully subscribed to newsletter' : 'Successfully unsubscribed from newsletter');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setEmailSubscribed(!isChecked); // Revert on error
      setError(err.response?.data?.message || 'Failed to update newsletter subscription');
      setTimeout(() => setError(''), 3000);
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Password validation function
  const validatePassword = (newPass, confirmPass) => {
    const errors = {};
    
    // Minimum 8 characters
    if (newPass.length < 8) {
      errors.length = 'Password must be at least 8 characters';
    }
    
    // At least one uppercase letter
    if (!/[A-Z]/.test(newPass)) {
      errors.uppercase = 'Password must contain at least one uppercase letter';
    }
    
    // At least one lowercase letter
    if (!/[a-z]/.test(newPass)) {
      errors.lowercase = 'Password must contain at least one lowercase letter';
    }
    
    // At least one digit
    if (!/\d/.test(newPass)) {
      errors.digit = 'Password must contain at least one number';
    }
    
    // At least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPass)) {
      errors.special = 'Password must contain at least one special character (!@#$%^&* etc.)';
    }
    
    // Passwords match
    if (newPass !== confirmPass) {
      errors.match = 'Passwords do not match';
    }
    
    return errors;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setPasswordErrors({});

    // Validate passwords
    const errors = validatePassword(passwordData.newPassword, passwordData.confirmPassword);
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    if (!passwordData.currentPassword) {
      setError('Please enter your current password');
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 px-4 pt-32 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 mt-6"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 dark:text-stone-50 font-light mb-2">
            My Account
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-lg">Welcome back! Manage your profile, orders, and account settings</p>
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

        <div>
          {/* Main Content - Full Width */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Profile Tab */}
            {true && (
              <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-stone-200 dark:border-stone-800">
                  <div>
                    <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-stone-50 font-light mb-1">
                      Profile Information
                    </h2>
                    <p className="text-sm text-stone-500 dark:text-stone-400">View and edit your account details</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg font-semibold transition-all text-sm shadow-md hover:shadow-lg"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        setLoading(true);
                        await axios.put(
                          `${API_URL}/api/auth/update-profile`,
                          formData,
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        setSuccess('Profile updated successfully');
                        setIsEditing(false);
                        setTimeout(() => {
                          window.location.reload();
                        }, 1500);
                      } catch (err) {
                        setError(err.response?.data?.message || 'Failed to update profile');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600/60 rounded-lg px-4 py-3 text-stone-900 dark:text-stone-50 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600/60 rounded-lg px-4 py-3 text-stone-900 dark:text-stone-50 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30 transition-all"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold py-3 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-stone-50 dark:bg-stone-800/30 rounded-lg p-6">
                      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                        Full Name
                      </label>
                      <p className="text-xl text-stone-900 dark:text-stone-50 font-medium">{user.name}</p>
                    </div>

                    {user.username && (
                      <div className="bg-stone-50 dark:bg-stone-800/30 rounded-lg p-6">
                        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                          Username
                        </label>
                        <p className="text-lg text-stone-600 dark:text-stone-300">@{user.username}</p>
                      </div>
                    )}

                    <div className="bg-stone-50 dark:bg-stone-800/30 rounded-lg p-6">
                      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                        Email Address
                      </label>
                      <p className="text-lg text-stone-900 dark:text-stone-50">{user.email}</p>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-800/30 rounded-lg p-6">
                      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                        Account Status
                      </label>
                      <p className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold border border-green-300 dark:border-green-700/50">
                        Active
                      </p>
                    </div>

                    {user.emailSubscribed && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800/50">
                        <label className="block text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                          Newsletter
                        </label>
                        <p className="text-stone-700 dark:text-stone-400">You are subscribed to our newsletter for updates and new releases.</p>
                      </div>
                    )}

                    <hr className="my-6 border-stone-200 dark:border-stone-800" />

                    <div className="bg-stone-50 dark:bg-stone-800/30 rounded-lg p-6 border border-stone-200 dark:border-stone-700/50">
                      <label className="flex items-center gap-4 cursor-pointer opacity-75 hover:opacity-100 transition-opacity" style={{ opacity: newsletterLoading ? 0.6 : 1 }}>
                        <input
                          type="checkbox"
                          checked={emailSubscribed}
                          onChange={handleNewsletterToggle}
                          disabled={newsletterLoading}
                          className="w-5 h-5 rounded accent-amber-600 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div>
                          <p className="text-stone-900 dark:text-stone-50 font-medium flex items-center gap-2">
                            Newsletter Subscription
                            {newsletterLoading && (
                              <span className="text-xs text-stone-500 dark:text-stone-400">Updating...</span>
                            )}
                          </p>
                          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Receive updates about new releases, special offers, and design inspiration</p>
                        </div>
                      </label>
                    </div>

                    <hr className="my-6 border-stone-200 dark:border-stone-800" />

                    {/* Password Change Section */}
                    <div className="bg-stone-50 dark:bg-stone-800/30 rounded-lg p-6 border border-stone-200 dark:border-stone-700/50">
                      {!isChangingPassword ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg text-stone-900 dark:text-stone-50 mb-1">
                              Password & Security
                            </h3>
                            <p className="text-sm text-stone-600 dark:text-stone-400">Update your password to keep your account secure</p>
                          </div>
                          <button
                            onClick={() => setIsChangingPassword(true)}
                            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg font-semibold transition-all text-sm shadow-md hover:shadow-lg"
                          >
                            Change Password
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <h3 className="font-semibold text-lg text-stone-900 dark:text-stone-50 mb-4">Change Your Password</h3>

                          {/* Current Password */}
                          <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                placeholder="Enter your current password"
                                className="w-full bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600/60 rounded-lg px-4 py-3 text-stone-900 dark:text-stone-50 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                                className="absolute right-3 top-3 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                              >
                                {showPasswords.current ? '🙈' : '👁️'}
                              </button>
                            </div>
                          </div>

                          {/* New Password */}
                          <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                placeholder="Create a new password"
                                className="w-full bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600/60 rounded-lg px-4 py-3 text-stone-900 dark:text-stone-50 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                                className="absolute right-3 top-3 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                              >
                                {showPasswords.new ? '🙈' : '👁️'}
                              </button>
                            </div>
                          </div>

                          {/* Password Requirements */}
                          {passwordData.newPassword && (
                            <div className="bg-white dark:bg-stone-900/50 rounded-lg p-4 border border-stone-200 dark:border-stone-700/50">
                              <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-3">Password Requirements:</p>
                              <ul className="space-y-2">
                                <li className={`text-xs flex items-center gap-2 ${passwordData.newPassword.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  <span>{passwordData.newPassword.length >= 8 ? '✓' : '✗'}</span>
                                  At least 8 characters
                                </li>
                                <li className={`text-xs flex items-center gap-2 ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  <span>{/[A-Z]/.test(passwordData.newPassword) ? '✓' : '✗'}</span>
                                  At least one uppercase letter
                                </li>
                                <li className={`text-xs flex items-center gap-2 ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  <span>{/[a-z]/.test(passwordData.newPassword) ? '✓' : '✗'}</span>
                                  At least one lowercase letter
                                </li>
                                <li className={`text-xs flex items-center gap-2 ${/\d/.test(passwordData.newPassword) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  <span>{/\d/.test(passwordData.newPassword) ? '✓' : '✗'}</span>
                                  At least one number
                                </li>
                                <li className={`text-xs flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  <span>{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword) ? '✓' : '✗'}</span>
                                  At least one special character (!@#$%^&* etc.)
                                </li>
                              </ul>
                            </div>
                          )}

                          {/* Confirm Password */}
                          <div>
                            <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                placeholder="Confirm your new password"
                                className="w-full bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600/60 rounded-lg px-4 py-3 text-stone-900 dark:text-stone-50 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                                className="absolute right-3 top-3 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                              >
                                {showPasswords.confirm ? '🙈' : '👁️'}
                              </button>
                            </div>
                          </div>

                          {/* Password Match Check */}
                          {passwordData.confirmPassword && (
                            <div className={`text-xs flex items-center gap-2 ${passwordData.newPassword === passwordData.confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              <span>{passwordData.newPassword === passwordData.confirmPassword ? '✓' : '✗'}</span>
                              Passwords match
                            </div>
                          )}

                          {/* Validation Errors */}
                          {Object.keys(passwordErrors).length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                              <ul className="space-y-1">
                                {Object.values(passwordErrors).map((err, idx) => (
                                  <li key={idx} className="text-xs text-red-700 dark:text-red-300">• {err}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4">
                            <button
                              type="submit"
                              disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                              className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                              {passwordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsChangingPassword(false);
                                setPasswordData({currentPassword: '', newPassword: '', confirmPassword: ''});
                                setPasswordErrors({});
                              }}
                              className="flex-1 border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold py-3 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                      <h3 className="font-semibold text-lg text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                      <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
                        Deleting your account is permanent and will remove all your data, order history, and preferences. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-all font-semibold"
                      >
                        {deleteLoading ? 'Deleting...' : 'Delete Account'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Account;
