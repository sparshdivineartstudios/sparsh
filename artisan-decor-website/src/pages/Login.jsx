import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-24 px-8 bg-stone-50 dark:bg-stone-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-10 shadow-sm"
      >
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-50 font-medium">Welcome Back</h2>
          <p className="font-sans text-sm text-stone-500 mt-2">Sign in to your studio account</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm font-sans focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-stone-900 dark:text-stone-50 transition-all disabled:opacity-50"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 pr-10 text-sm font-sans focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-stone-900 dark:text-stone-50 transition-all disabled:opacity-50"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white py-4 rounded font-sans tracking-widest uppercase text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? '⏳ Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-stone-500 text-sm font-sans">
          Don't have an account? <Link to="/register" className="text-amber-600 hover:underline font-medium">Create one</Link>
        </p>
      </motion.div>
    </main>
  );
};

export default Login;
