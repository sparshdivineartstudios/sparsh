import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmailVerificationRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Step 1: Request verification code
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  // Timer for resend code
  React.useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [timer]);

  // STEP 1: Send Verification Code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!name || !email) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/send-verification-code`,
        { name, email }
      );

      if (response.data.success) {
        setMessage('✅ Verification code sent! Check your email (and spam folder).');
        setStep(2);
        setTimer(60); // Resend after 60 seconds
        setEmail(email);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send code';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify Code & Complete Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate
    if (!verificationCode || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          email,
          password,
          verificationCode
        }
      );

      if (response.data.success) {
        setMessage('🎉 Registration successful! Redirecting...');
        
        // Store token and login
        localStorage.setItem('token', response.data.token);
        login(response.data.token);

        // Redirect after 1.5 seconds
        setTimeout(() => navigate('/account'), 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/send-verification-code`,
        { name, email }
      );

      if (response.data.success) {
        setMessage('New code sent! Check your email.');
        setTimer(60);
      }
    } catch (err) {
      setError('Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-amber-600 dark:bg-amber-700 p-8 text-center">
          <h1 className="text-3xl font-serif text-white mb-2">🎨 Join Us</h1>
          <p className="text-amber-100">Create your Sparsh account</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 ? (
            // STEP 1: Email & Name
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleRequestCode}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 transition disabled:opacity-50"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 transition disabled:opacity-50"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {loading ? '⏳ Sending Code...' : '📧 Send Verification Code'}
              </button>

              {message && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800"
                >
                  {message}
                </motion.p>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
                >
                  {error}
                </motion.p>
              )}

              <p className="text-sm text-stone-600 dark:text-stone-400 text-center">
                Already have an account?{' '}
                <a href="/login" className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-semibold">
                  Log in
                </a>
              </p>
            </motion.form>
          ) : (
            // STEP 2: Verification Code & Password
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleRegister}
              className="space-y-6"
            >
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-stone-700 dark:text-stone-300">
                  📧 Verification code sent to <strong>{email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all text-center text-2xl tracking-widest disabled:opacity-50"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 transition disabled:opacity-50"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-50 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 transition disabled:opacity-50"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {loading ? '⏳ Creating Account...' : '🎉 Complete Registration'}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading || timer > 0}
                className="w-full py-2 px-4 text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 text-sm font-semibold disabled:opacity-30"
              >
                {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
              </button>

              {message && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800"
                >
                  {message}
                </motion.p>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
                  setMessage('');
                  setVerificationCode('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="w-full py-2 text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 text-sm"
              >
                ← Back
              </button>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationRegister;
