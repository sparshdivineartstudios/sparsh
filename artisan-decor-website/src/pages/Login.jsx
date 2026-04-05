import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-24 px-8">
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

        {error && <p className="text-red-500 text-xs tracking-widest uppercase mb-6 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm font-sans focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-stone-900 dark:text-stone-50 transition-all"
            />
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm font-sans focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-stone-900 dark:text-stone-50 transition-all"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-2 bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 py-4 rounded font-sans tracking-widest uppercase text-xs font-semibold hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white transition-colors"
          >
            Sign In
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
