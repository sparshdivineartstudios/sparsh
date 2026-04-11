import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';
import { useAuth } from '../context/AuthContext';

// Confetti particle component
const Confetti = ({ id, duration = 2 }) => {
  const randomX = Math.random() * 400 - 200;
  const randomDelay = Math.random() * 0.3;
  const randomDuration = 2 + Math.random() * 1;
  const confettiColors = ['#F59E0B', '#D97706', '#B45309', '#FBBF24', '#FCD34D', '#C084FC', '#E879F9'];
  const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  
  return (
    <motion.div
      key={id}
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
      animate={{ x: randomX, y: 400, opacity: 0, rotate: 360 }}
      transition={{ duration: randomDuration, delay: randomDelay, ease: 'easeIn' }}
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{ backgroundColor: color, left: '50%', top: '50%' }}
    />
  );
};

const Contact = () => {
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: '',
    message: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confetti, setConfetti] = useState([]);

  // Prefill form with logged-in user data
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.email) {
      setErrorMessage('Email address is required');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(
        `${API_URL}/api/salesforce/create-lead`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        // Show success modal with confetti
        setShowSuccess(true);
        // Generate confetti particles
        const confettiPieces = Array.from({ length: 30 }, (_, i) => i);
        setConfetti(confettiPieces);
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          category: '',
          message: '',
        });
        
        // Auto close success modal after 4 seconds
        setTimeout(() => setShowSuccess(false), 4000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to send your inquiry. Please try again or email us directly.');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-7xl mx-auto">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-12 max-w-md w-full text-center relative overflow-hidden"
            >
              {/* Confetti */}
              {confetti.map((id) => (
                <Confetti key={id} id={id} />
              ))}
              
              {/* Animated Checkmark */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
                className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <motion.svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-10 h-10 text-emerald-600 dark:text-emerald-400"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </motion.div>

              {/* Text */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-3xl text-stone-900 dark:text-stone-50 mb-3"
              >
                Thank You! 🎨
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="font-sans text-stone-600 dark:text-stone-400 mb-2"
              >
                Your enquiry has been received
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="font-sans text-sm text-stone-500 dark:text-stone-500 mb-6"
              >
                We'll get back to you within 24-48 hours. ✨
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => setShowSuccess(false)}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-sans text-sm font-semibold transition-colors"
              >
                Got it!
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="font-sans text-xs text-stone-400 dark:text-stone-600 mt-4"
              >
                Closing in 4 seconds...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-16 border-b border-stone-200 dark:border-stone-800 pb-8 text-center">
        <p className="font-sans text-amber-600 uppercase tracking-widest text-sm font-semibold mb-4">Get in Touch</p>
        <h1 className="font-serif text-5xl font-semibold text-stone-900 dark:text-stone-50 mb-4">
          Let's Create Something Together
        </h1>
        <p className="font-sans text-stone-500 dark:text-stone-400 max-w-xl mx-auto text-sm leading-relaxed">
          Whether you have a custom commission in mind, a question about an existing piece, or just want to say hello — we would love to hear from you.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-16 items-start mt-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/3 space-y-10"
        >
          <div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-50 mb-3">Studio Location</h3>
            <p className="font-sans text-stone-500 text-sm mb-1">Sparsh Divine Art Studio</p>
            <p className="font-sans text-stone-500 text-sm mb-1">Ahmedabad, Gujrat, India</p>
            <p className="font-sans text-amber-600 text-sm mt-3 italic">Studio visits by appointment only — DM us on Instagram to book.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-50 mb-3">Reach Us Directly</h3>
            <p className="font-sans text-stone-500 text-sm mb-1">✉ sparshdivineartstudio@gmail.com</p>
            <p className="font-sans text-stone-500 text-sm">☏ +91 8160901481</p>
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-50 mb-3">Response Time</h3>
            <p className="font-sans text-stone-500 text-sm leading-relaxed">
              We respond to all enquiries within 24–48 hours. For custom commissions, please allow 2–3 business days for a detailed quote.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-50 mb-3">Follow the Studio</h3>
            <div className="flex gap-4">
              {[
                { name: 'Instagram', url: 'https://www.instagram.com/_sparsh_divine_art_studio_' }
                // ,{ name: 'Pinterest', url: 'https://pinterest.com/sparshdivineartstudio' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs text-stone-500 hover:text-amber-600 uppercase tracking-widest transition-colors border-b border-stone-300 dark:border-stone-700 pb-0.5"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-2/3 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-8 md:p-12"
        >
          <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-50 mb-8">Send an Enquiry</h2>
          
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm"
            >
              {errorMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Priya" 
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all text-stone-900 dark:text-stone-50 placeholder:text-stone-400 disabled:opacity-50" 
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Sharma" 
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all text-stone-900 dark:text-stone-50 placeholder:text-stone-400 disabled:opacity-50" 
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com" 
                  required
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all text-stone-900 dark:text-stone-50 placeholder:text-stone-400 disabled:opacity-50" 
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 81609..." 
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all text-stone-900 dark:text-stone-50 placeholder:text-stone-400 disabled:opacity-50" 
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">What are you interested in?</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-all text-stone-600 dark:text-stone-400 disabled:opacity-50" 
                disabled={loading}
              >
                <option value="">Select a category</option>
                <option value="Resin Art">Resin Art</option>
                <option value="Soy Wax Candles">Soy Wax Candles</option>
                <option value="Concrete Antiques">Concrete Antiques</option>
                <option value="Custom Commission">Custom Commission</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Other">Something Else</option>
              </select>
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Your Message</label>
              <textarea 
                rows="5" 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what you have in mind — the more detail the better for commissions." 
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all text-stone-900 dark:text-stone-50 resize-none placeholder:text-stone-400 disabled:opacity-50" 
                disabled={loading}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-stone-900 px-10 py-4 uppercase tracking-widest text-xs font-bold transition-colors rounded-sm disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Enquiry'}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

export default Contact;
