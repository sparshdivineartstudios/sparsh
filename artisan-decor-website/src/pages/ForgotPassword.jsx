import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../utils/apiConfig';

const ForgotPassword = () => {
  // Step 1: Email/OTP Request
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  // OTP expiry timer
  useEffect(() => {
    if (!otpExpiry) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const remaining = Math.round((otpExpiry - now) / 1000);
      
      if (remaining <= 0) {
        setOtpExpiry(null);
        clearInterval(timer);
      } else {
        setOtpExpiry(prev => {
          if (prev) return new Date(prev.getTime());
          return prev;
        });
      }
    }, 500);

    return () => clearInterval(timer);
  }, [otpExpiry]);

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    
    const timer = setTimeout(() => {
      setResendCooldown(resendCooldown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const getOtpExpiry = () => {
    if (!otpExpiry) return '';
    const remaining = Math.round((otpExpiry - new Date()) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/send-forgot-password-code`, {
        email: email.toLowerCase()
      });

      if (response.data.success) {
        setError(''); // Clear any previous errors
        setOtpSent(true);
        setOtpExpiry(new Date(Date.now() + 2 * 60 * 1000)); // 2 minutes
        setStep(2);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send password reset code';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Handle Step 2: Move to password reset
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    // Move directly to step 3 - no API call needed here
    // Verification will happen when submitting password reset
    setStep(3);
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    setResendCooldown(60);

    try {
      const response = await axios.post(`${API_URL}/api/auth/send-forgot-password-code`, {
        email: email.toLowerCase()
      });

      if (response.data.success) {
        setOtp(['', '', '', '', '', '']);
        setOtpExpiry(new Date(Date.now() + 2 * 60 * 1000)); // 2 minutes
        document.getElementById('otp-0')?.focus();
        setError(''); // Clear any errors
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to resend password reset code';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const otpString = otp.join('');
      const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
        email: email.toLowerCase(),
        verificationCode: otpString,
        newPassword: password,
        confirmPassword: confirmPassword
      });

      if (response.data.success) {
        // Show success and redirect
        setError('');
        if (isAuthenticated) {
          // Redirect authenticated user to home with success message
          setTimeout(() => {
            navigate('/');
          }, 500);
        } else {
          // Redirect unauthenticated user to login
          setTimeout(() => {
            navigate('/login');
          }, 500);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center pt-32 pb-12 px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600 dark:opacity-5 opacity-[0.02] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600 dark:opacity-5 opacity-[0.02] rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Card */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-8 shadow-sm">
          {/* Header Progress */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2">
              <motion.div
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step >= 1 ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
                layoutId="step1"
              />
              <motion.div
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step >= 2 ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
                layoutId="step2"
              />
              <motion.div
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step >= 3 ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
                layoutId="step3"
              />
            </div>
            <span className="text-xs text-stone-600 dark:text-stone-400 ml-4 font-medium">Step {step}/3</span>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Email Input */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-8">
                  <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-50 font-light mb-2">
                    Reset Your Password
                  </h2>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {isAuthenticated ? 'Confirm your email to proceed with password reset' : 'Enter your email address to reset your password'}
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200 text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSendOtp} className="space-y-4 mt-6">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      disabled={loading || isAuthenticated}
                      className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600/60 rounded-lg px-4 py-3 text-sm text-stone-900 dark:text-stone-50 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all disabled:opacity-50"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide shadow-md hover:shadow-lg hover:shadow-amber-600/20"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>

                {!isAuthenticated && (
                  <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-800 text-center">
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Remember your password?{' '}
                      <Link to="/login" className="text-amber-600 hover:text-amber-700 dark:hover:text-amber-500 font-semibold">
                        Sign In
                      </Link>
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-8">
                  <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-50 font-light mb-2">
                    Verify Email
                  </h2>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    We sent a 6-digit code to <span className="text-amber-600 dark:text-amber-500 font-medium">{email}</span>
                  </p>
                </div>

                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    Check your email for the verification code. If you don't see it, check your spam folder.
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200 text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-6 mt-6">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-4 uppercase tracking-wide">
                      Verification Code
                    </label>
                    <div className="flex gap-2 justify-between">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          disabled={loading}
                          className="w-full aspect-square bg-stone-50 dark:bg-stone-950/40 border-2 border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600/60 rounded-lg text-center text-lg font-semibold text-stone-900 dark:text-stone-50 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all disabled:opacity-50"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600 dark:text-stone-400">
                      {otpExpiry ? (
                        <>
                          Code expires in: <span className="text-amber-600 dark:text-amber-500 font-semibold">{getOtpExpiry()}</span>
                        </>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">Code expired</span>
                      )}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide shadow-md hover:shadow-lg hover:shadow-amber-600/20"
                  >
                    {loading ? 'Verifying...' : 'Continue'}
                  </button>

                  <div className="text-center">
                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                      Didn't receive the code?
                    </p>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || loading}
                      className="text-amber-600 hover:text-amber-700 dark:hover:text-amber-500 font-medium text-sm transition-colors disabled:text-stone-500 disabled:cursor-not-allowed"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    disabled={loading}
                    className="w-full text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-300 font-medium text-sm transition-colors disabled:opacity-50 py-2"
                  >
                    Back to Email
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: New Password */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-8">
                  <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-50 font-light mb-2">
                    Create New Password
                  </h2>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    Enter a strong password to secure your account
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200 text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4 mt-6">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        disabled={loading}
                        className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600/60 rounded-lg px-4 py-3 pr-10 text-sm text-stone-900 dark:text-stone-50 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
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

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        disabled={loading}
                        className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600/60 rounded-lg px-4 py-3 pr-10 text-sm text-stone-900 dark:text-stone-50 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                        tabIndex="-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showConfirmPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide shadow-md hover:shadow-lg hover:shadow-amber-600/20"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(2);
                      setPassword('');
                      setConfirmPassword('');
                      setError('');
                    }}
                    disabled={loading}
                    className="w-full text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-300 font-medium text-sm transition-colors disabled:opacity-50 py-2"
                  >
                    Back to Verification
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          {step === 1 && !isAuthenticated && (
            <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800 text-center">
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-amber-600 hover:text-amber-700 dark:hover:text-amber-500 font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-stone-600 dark:text-stone-500">
            Your data is encrypted and secure. We never share your information.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default ForgotPassword;
