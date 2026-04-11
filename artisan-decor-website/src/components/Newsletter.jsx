import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';
import { useAuth } from '../context/AuthContext';

const Newsletter = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Hide newsletter completely if not logged in
  if (!isAuthenticated) {
    return null;
  }

  // Hide newsletter if user is already subscribed
  if (isAuthenticated && user?.emailSubscribed) {
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
              ✓ You're Already In!
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl md:text-4xl text-emerald-50 mb-4"
            >
              You're Subscribed
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-sans text-emerald-200 text-base leading-relaxed"
            >
              Thanks for joining our community, {user?.name}! We'll keep you updated with new releases, exclusive previews, and studio stories.
            </motion.p>
          </motion.div>
        </div>
      </section>
    );
  }

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        `${API_URL}/api/salesforce/subscribe`,
        { email },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setMessage('Thank you for subscribing! 🎉');
        setEmail('');
        
        // Refresh user data if logged in
        if (isAuthenticated) {
          await refreshUser();
        }
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to subscribe. Please try again.';
      setError(errorMsg);
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-8 bg-stone-900 dark:bg-stone-950">
      <div className="max-w-2xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-sans text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3"
        >
          Stay Connected
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl text-white mb-4"
        >
          Never Miss a New Creation
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-sans text-stone-400 text-base leading-relaxed mb-8"
        >
          Subscribe to our newsletter for new releases, exclusive previews, and studio updates delivered straight to your inbox.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="flex-1 bg-stone-800 dark:bg-stone-900 border border-stone-700 dark:border-stone-800 rounded px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-stone-900 px-6 py-3 uppercase tracking-widest text-xs font-bold transition-colors rounded disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </motion.form>

        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 font-sans text-sm text-emerald-400"
          >
            {message}
          </motion.p>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 font-sans text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
