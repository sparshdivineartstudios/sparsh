import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';
import { useAuth } from '../context/AuthContext';

const NewsletterSection = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Only show for logged-in users
  if (!isAuthenticated) {
    return (
      <section className="py-24 px-8 bg-stone-900 dark:bg-stone-950">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-900/30 border border-blue-700 rounded-2xl p-8 md:p-12"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-sans text-blue-400 uppercase tracking-widest text-xs font-semibold mb-3"
            >
              📧 Newsletter
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl md:text-4xl text-blue-50 mb-4"
            >
              Stay Connected
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-sans text-blue-200 text-base leading-relaxed mb-6"
            >
              Please log in to manage your newsletter subscription and receive exclusive updates.
            </motion.p>
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              📥 Log In
            </motion.a>
          </motion.div>
        </div>
      </section>
    );
  }

  // If already subscribed, show unsubscribe option
  if (user?.emailSubscribed) {
    return (
      <section className="py-24 px-8 bg-stone-900 dark:bg-stone-950">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-emerald-900/30 border border-emerald-700 rounded-2xl p-8 md:p-12"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-sans text-emerald-400 uppercase tracking-widest text-xs font-semibold mb-3"
            >
              ✓ You're Subscribed
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl md:text-4xl text-emerald-50 mb-4"
            >
              Thanks for Joining Us!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-sans text-emerald-200 text-base leading-relaxed mb-6"
            >
              {user?.name}, you'll receive exclusive previews, special offers, and studio stories. We can't wait to share our journey with you.
            </motion.p>

            <motion.button
              onClick={handleUnsubscribe}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              className="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? '⏳ Processing...' : '👋 Unsubscribe'}
            </motion.button>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-emerald-300 mt-4"
              >
                {message}
              </motion.p>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 mt-4"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  // Show subscribe form
  const handleUnsubscribe = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        `${API_URL}/api/newsletter/unsubscribe`,
        { email: user?.email },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage('👋 You\'ve been unsubscribed. We\'ll miss you!');
        await refreshUser();
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to unsubscribe';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        `${API_URL}/api/newsletter/subscribe`,
        { email: user?.email },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage('🎉 Welcome to our newsletter! Check your email.');
        await refreshUser();
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to subscribe';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-8 bg-stone-900 dark:bg-stone-950">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-700 rounded-2xl p-8 md:p-12"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-sans text-purple-400 uppercase tracking-widest text-xs font-semibold mb-3"
          >
            📧 Newsletter
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl text-purple-50 mb-4"
          >
            Exclusive Updates Await
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-purple-200 text-base leading-relaxed mb-8"
          >
            Be the first to discover new collections, behind-the-scenes stories, and special offers. Stay inspired.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-6 py-3 bg-white/10 border border-purple-500 rounded-lg text-purple-50 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              placeholder="your@email.com"
            />
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? '⏳ Subscribing...' : '✓ Subscribe to Newsletter'}
            </button>
          </motion.div>

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-emerald-300 mt-4 text-sm"
            >
              {message}
            </motion.p>
          )}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 mt-4 text-sm"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
