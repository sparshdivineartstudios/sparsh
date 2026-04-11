import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../utils/apiConfig';

const Register = () => {
  // Step 1: User Details
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savePassword, setSavePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: OTP Verification
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (!otpExpiry) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const remaining = Math.round((otpExpiry - now) / 1000);
      
      if (remaining <= 0) {
        setOtpExpiry(null);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [otpExpiry]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    
    const timer = setTimeout(() => {
      setResendCooldown(resendCooldown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Validate Step 1 Form
  const validateStep1 = () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return false;
    }
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  // Handle Step 1 Submit
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateStep1()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/send-verification-code`, {
        email: email.toLowerCase(),
        name: fullName
      });

      if (response.data.success) {
        setOtpSent(true);
        setOtpExpiry(new Date(Date.now() + 2 * 60 * 1000)); // 2 minutes
        setStep(2);
        setError('');
        // Save password to browser if checkbox is selected
        if (savePassword) {
          localStorage.setItem('savedPassword', password);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle OTP Backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Handle Step 2 Submit (OTP Verification)
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        username: username.toLowerCase(),
        fullName,
        email: email.toLowerCase(),
        password,
        verificationCode: otpString
      });

      if (response.data.success) {
        // Auto-login after successful registration
        await login(email, password);
        setTimeout(() => {
          navigate('/products');
        }, 500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    setResendCooldown(60);

    try {
      const response = await axios.post(`${API_URL}/api/auth/send-verification-code`, {
        email: email.toLowerCase(),
        name: fullName
      });

      if (response.data.success) {
        setOtp(['', '', '', '', '', '']);
        setOtpExpiry(new Date(Date.now() + 2 * 60 * 1000)); // 2 minutes
        document.getElementById('otp-0')?.focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const getOtpExpiry = () => {
    if (!otpExpiry) return '';
    const remaining = Math.round((otpExpiry - new Date()) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
            </div>
            <span className="text-xs text-stone-600 dark:text-stone-400 ml-4 font-medium">Step {step}/2</span>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: User Details */}
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
                    Create Your Account
                  </h2>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    Join our community of design enthusiasts
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

                <form onSubmit={handleStep1Submit} className="space-y-4 mt-6">
                  {/* Username */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="choose_your_handle"
                      disabled={loading}
                      className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600/60 rounded-lg px-4 py-3 text-sm text-stone-900 dark:text-stone-50 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      disabled={loading}
                      className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600/60 rounded-lg px-4 py-3 text-sm text-stone-900 dark:text-stone-50 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={loading}
                      className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-700/60 hover:border-stone-300 dark:hover:border-stone-600/60 rounded-lg px-4 py-3 text-sm text-stone-900 dark:text-stone-50 placeholder-stone-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
                      Password
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

                  {/* Confirm Password */}
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

                  {/* Save Password Checkbox */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="savePassword"
                      checked={savePassword}
                      onChange={(e) => setSavePassword(e.target.checked)}
                      disabled={loading}
                      className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
                    />
                    <label htmlFor="savePassword" className="text-xs text-stone-600 dark:text-stone-400 cursor-pointer">
                      Save password in this browser
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide shadow-md hover:shadow-lg hover:shadow-amber-600/20"
                  >
                    {loading ? 'Sending verification code...' : 'Continue to Verification'}
                  </button>
                </form>
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
                    Verify Your Email
                  </h2>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    We sent a 6-digit code to <span className="text-amber-600 dark:text-amber-500 font-medium">{email}</span>
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

                <form onSubmit={handleStep2Submit} className="space-y-6 mt-6">
                  {/* OTP Input */}
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

                  {/* Timer */}
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

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide shadow-md hover:shadow-lg hover:shadow-amber-600/20"
                  >
                    {loading ? 'Verifying...' : 'Create Account'}
                  </button>

                  {/* Resend OTP */}
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

                  {/* Back Button */}
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
                    Back to Sign Up
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800 text-center">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-600 hover:text-amber-700 dark:hover:text-amber-500 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
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

export default Register;
