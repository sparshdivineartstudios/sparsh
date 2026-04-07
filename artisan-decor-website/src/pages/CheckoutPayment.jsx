import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import RazorpayCheckout from '../components/RazorpayCheckout';

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { token } = useAuth();
  const { orderId, cartItems, shippingDetails, finalTotal } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!orderId) {
    return (
      <main className="min-h-screen pt-32 pb-24 px-8">
        <p>No payment data found. Please complete the review step.</p>
      </main>
    );
  }

  const handlePaymentSuccess = async (response) => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://home-8zob.onrender.com';
      const verifyResponse = await fetch(`${apiUrl}/api/payment/verify-razorpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          orderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }),
      });

      if (verifyResponse.ok) {
        clearCart();
        navigate('/order-confirmation', {
          state: {
            orderId,
            cartItems,
            shippingDetails,
            finalTotal,
          },
        });
      } else {
        const errorData = await verifyResponse.json().catch(() => ({}));
        alert(`Payment verification failed: ${errorData.message || 'Please contact support'}`);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('An error occurred. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
    setShowRazorpay(false);
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-5xl text-stone-900 dark:text-stone-50 mb-2">Payment</h1>
        <p className="font-sans text-stone-500">Step 3 of 3</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
            <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-50 mb-6">Payment Method</h2>
            <p className="font-sans text-stone-600 dark:text-stone-400 mb-6">Click "Proceed to Payment" to open our secure Razorpay checkout where you can choose from:</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-amber-600 font-bold">✓</span>
                <span className="font-sans text-stone-700 dark:text-stone-300">UPI Payments</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-amber-600 font-bold">✓</span>
                <span className="font-sans text-stone-700 dark:text-stone-300">Credit/Debit Cards</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-amber-600 font-bold">✓</span>
                <span className="font-sans text-stone-700 dark:text-stone-300">Digital Wallets (Google Pay, Apple Pay, etc.)</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
            <h3 className="font-serif text-xl text-stone-900 dark:text-stone-50 mb-4">Order Details</h3>
            <div className="space-y-3 font-sans text-sm">
              {cartItems.map(item => {
                const price = typeof item.price === 'string' 
                  ? parseFloat(item.price.replace(/[₹\s]/g, '')) 
                  : (item.price || 0);
                return (
                  <div key={item._id} className="flex justify-between">
                    <span className="text-stone-600 dark:text-stone-400">{item.name} x{item.quantity}</span>
                    <span className="text-stone-900 dark:text-stone-50">₹{(price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Payment Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 h-fit sticky top-32"
        >
          <h3 className="font-serif text-lg text-stone-900 dark:text-stone-50 mb-6">Payment Summary</h3>

          <div className="space-y-4 border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
            <div className="flex justify-between font-sans text-sm">
              <span className="text-stone-600 dark:text-stone-400">Items</span>
              <span className="text-stone-900 dark:text-stone-50">₹{cartItems.reduce((s, i) => {
                const price = typeof i.price === 'string' 
                  ? parseFloat(i.price.replace(/[₹\s]/g, '')) 
                  : (i.price || 0);
                return s + (price * i.quantity);
              }, 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-sans text-sm">
              <span className="text-stone-600 dark:text-stone-400">Shipping</span>
              <span className="text-stone-900 dark:text-stone-50">₹150</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between font-serif text-2xl font-semibold">
              <span className="text-stone-900 dark:text-stone-50">Total</span>
              <span className="text-amber-600">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => setShowRazorpay(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-sans font-bold py-3 rounded-lg transition-colors mb-4"
          >
            Proceed to Payment
          </button>

          <p className="font-sans text-xs text-stone-500 text-center">
            Your payment information is secure and encrypted
          </p>
        </motion.div>
      </div>

      {/* Razorpay Checkout Component */}
      <RazorpayCheckout
        isOpen={showRazorpay}
        orderId={orderId}
        amount={finalTotal}
        customerName={shippingDetails?.fullName}
        customerEmail={shippingDetails?.email}
        customerPhone={shippingDetails?.phone}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        onClose={() => setShowRazorpay(false)}
      />
    </main>
  );
};

export default CheckoutPayment;
