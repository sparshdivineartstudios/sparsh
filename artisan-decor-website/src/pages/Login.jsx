import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    // Load saved password if it exists
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      // Save email if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center py-12 px-4 md:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600 opacity-5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Card */}
        <div className="bg-gradient-to-b from-stone-900/80 to-stone-950/80 backdrop-blur-xl border border-stone-800/60 rounded-xl p-8 md:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-stone-50 font-light mb-2">Welcome Back</h1>
            <p className="text-sm text-stone-400">Sign in to your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-lg text-red-300 text-sm font-medium flex items-start gap-3"
            >
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                disabled={loading}
                className="w-full bg-stone-950/40 border border-stone-700/60 hover:border-stone-600/60 rounded-lg px-4 py-3 text-sm text-stone-50 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all disabled:opacity-50"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wide">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-amber-600 hover:text-amber-500 font-medium transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full bg-stone-950/40 border border-stone-700/60 hover:border-stone-600/60 rounded-lg px-4 py-3 pr-10 text-sm text-stone-50 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-300 transition-colors"
                  tabIndex="-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-xs text-stone-400 cursor-pointer hover:text-stone-300 transition-colors">
                Remember me on this device
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide shadow-lg hover:shadow-xl hover:shadow-amber-600/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m0-20a8 8 0 100 16 8 8 0 000-16z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-stone-700/60"></div>
            <span className="text-xs text-stone-500">or</span>
            <div className="flex-1 h-px bg-stone-700/60"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-stone-400 mb-2">
              New to our community?
            </p>
            <Link
              to="/register"
              className="inline-block w-full text-center py-3 border border-amber-600/60 hover:border-amber-600 text-amber-600 hover:text-amber-500 font-semibold rounded-lg transition-all duration-300 text-sm uppercase tracking-wide hover:bg-amber-600/5"
            >
              Create Account
            </Link>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-stone-800/60">
            <div className="flex items-center justify-center gap-4 text-xs text-stone-500">
              <Link to="/about" className="hover:text-stone-400 transition-colors">
                About
              </Link>
              <span className="text-stone-700">•</span>
              <Link to="/contact" className="hover:text-stone-400 transition-colors">
                Contact
              </Link>
              <span className="text-stone-700">•</span>
              <Link to="/privacy" className="hover:text-stone-400 transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-stone-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secured with SSL encryption
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default Login;
