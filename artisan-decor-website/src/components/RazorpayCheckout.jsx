import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const RazorpayCheckout = ({ 
  orderId, 
  amount, 
  customerName, 
  customerEmail, 
  customerPhone, 
  onSuccess, 
  onError,
  isOpen,
  onClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const { token } = useAuth();

  // Lock page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://home-8zob.onrender.com';
      const endpoint = `${apiUrl}/api/payment/create-razorpay-order`;
      
      console.log('🔄 Creating Razorpay order:', { 
        endpoint, 
        orderId, 
        amount,
        hasToken: !!token,
        tokenLength: token?.length || 0
      });
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          amount,
          currency: 'INR',
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Backend error:', response.status, errorData);
        throw new Error(`Backend error: ${response.status} ${errorData.error || errorData.message || ''}`);
      }

      const { razorpayOrderId } = await response.json();

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        order_id: razorpayOrderId,
        name: 'Sparsh Divine Art Studio',
        description: `Order ${orderId}`,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#f59e0b',
        },
        handler: async (response) => {
          // Verify payment
          try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://home-8zob.onrender.com';
            const endpoint = `${apiUrl}/api/payment/verify-razorpay`;
            
            console.log('✅ Verifying payment:', { endpoint, orderId });
            
            const verifyRes = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              })
            });

            if (verifyRes.ok) {
              console.log('✅ Payment verified successfully!');
              onSuccess?.(response);
              onClose();
            } else {
              const errorData = await verifyRes.json().catch(() => ({}));
              console.error('❌ Verification failed:', verifyRes.status, errorData);
              onError?.(`Payment verification failed: ${errorData.message || verifyRes.status}`);
            }
          } catch (error) {
            console.error('Verification error:', error);
            onError?.(error.message);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-3 md:p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-stone-900 rounded-2xl md:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden w-full max-w-sm pointer-events-auto flex flex-col max-h-[min(95vh,680px)]">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-stone-950 dark:to-stone-800 px-5 md:px-8 py-3 md:py-5 border-b border-stone-200 dark:border-stone-800 flex-shrink-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-lg md:text-2xl text-stone-900 dark:text-stone-50">Payment</h2>
                    <p className="font-sans text-xs md:text-sm text-stone-600 dark:text-stone-400 truncate mt-0.5">Order #{orderId}</p>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="text-stone-500 hover:text-stone-900 transition-colors flex-shrink-0 text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="overflow-y-auto flex-1 px-5 md:px-8 py-4 md:py-5">
                <div className="space-y-3 md:space-y-4">
                  {/* Amount */}
                  <div className="bg-amber-50 dark:bg-stone-950 rounded-xl p-4 md:p-5 border border-amber-200 dark:border-amber-900">
                    <p className="font-sans text-xs md:text-sm text-stone-600 dark:text-stone-400 mb-1">Total Amount</p>
                    <p className="font-serif text-3xl md:text-4xl font-bold text-amber-600">₹{amount.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <p className="font-sans text-xs md:text-sm font-semibold text-stone-900 dark:text-stone-50 px-1">Choose Payment Method</p>
                    
                    {['upi', 'card', 'wallet'].map((method) => {
                      const labels = {
                        upi: { title: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
                        card: { title: 'Credit/Debit Card', desc: 'Visa, Mastercard, Amex' },
                        wallet: { title: 'Wallets', desc: 'Razorpay Supported Wallets' }
                      };
                      
                      return (
                        <label key={method} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedMethod === method
                            ? 'border-amber-500 bg-amber-50 dark:bg-stone-950'
                            : 'border-stone-200 dark:border-stone-800'
                        }`}>
                          <input
                            type="radio"
                            name="method"
                            value={method}
                            checked={selectedMethod === method}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            className="w-4 h-4 flex-shrink-0"
                          />
                          <div className="ml-3 min-w-0 flex-1">
                            <p className="font-sans font-semibold text-xs md:text-sm text-stone-900 dark:text-stone-50">{labels[method].title}</p>
                            <p className="font-sans text-xs text-stone-500 dark:text-stone-400">{labels[method].desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Order Details */}
                  <div className="bg-stone-50 dark:bg-stone-950 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between font-sans text-xs gap-2">
                      <span className="text-stone-600 dark:text-stone-400">Customer</span>
                      <span className="text-stone-900 dark:text-stone-50 font-medium truncate">{customerName}</span>
                    </div>
                    <div className="flex justify-between font-sans text-xs gap-2">
                      <span className="text-stone-600 dark:text-stone-400">Email</span>
                      <span className="text-stone-900 dark:text-stone-50 font-medium truncate">{customerEmail?.split('@')[0]}</span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2 md:p-3 border border-blue-200 dark:border-blue-900">
                    <p className="font-sans text-xs text-blue-900 dark:text-blue-200">🔒 Secure payment via Razorpay</p>
                  </div>
                </div>
              </div>

              {/* Pay Button - Fixed at bottom */}
              <div className="px-5 md:px-8 py-3 md:py-4 border-t border-stone-200 dark:border-stone-800 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-stone-900 font-sans font-bold py-2.5 md:py-3 rounded-lg transition-all shadow-lg text-sm md:text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 md:w-4 md:h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${amount.toLocaleString('en-IN')}`
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RazorpayCheckout;
