import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { orderId, cartItems, shippingDetails, finalTotal } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

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

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      // Create Razorpay order on your backend
      const response = await fetch('https://home-8zob.onrender.com/api/payment/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          orderId,
          amount: finalTotal,
          currency: 'INR',
        })
      });

      const { razorpayOrderId } = await response.json();

      // Razorpay checkout options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: finalTotal * 100, // Amount in paise
        currency: 'INR',
        name: 'Sparsh Divine Art Studio',
        description: 'Order ' + orderId,
        order_id: razorpayOrderId,
        handler: async (response) => {
          // Verify payment on backend
          const verifyRes = await fetch('https://home-8zob.onrender.com/api/payment/verify-razorpay', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            })
          });

          if (verifyRes.ok) {
            // Clear cart
            await clearCart();
            // Navigate to confirmation
            navigate('/order-confirmation', {
              state: { orderId, amount: finalTotal }
            });
          }
        },
        prefill: {
          name: shippingDetails.fullName,
          email: shippingDetails.email,
          contact: shippingDetails.phone,
        },
        theme: {
          color: '#f59e0b', // Amber color
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-50 mb-6">Select Payment Method</h2>

            {/* Razorpay Option */}
            <label className="flex items-start gap-4 p-6 border-2 border-amber-500 rounded-xl bg-amber-50 dark:bg-stone-950 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1"
              />
              <div>
                <p className="font-sans font-semibold text-stone-900 dark:text-stone-50">Razorpay (UPI, Cards, Wallets)</p>
                <p className="font-sans text-sm text-stone-500 mt-1">Secure payment gateway with multiple options</p>
              </div>
            </label>

            {/* Bank Transfer for future */}
            <label className="flex items-start gap-4 p-6 border-2 border-stone-200 dark:border-stone-700 rounded-xl opacity-50 cursor-not-allowed mt-4">
              <input
                type="radio"
                name="payment"
                value="bank"
                disabled
                className="mt-1"
              />
              <div>
                <p className="font-sans font-semibold text-stone-900 dark:text-stone-50">Bank Transfer</p>
                <p className="font-sans text-sm text-stone-500 mt-1">Coming soon</p>
              </div>
            </label>
          </div>

          {/* Order Summary */}
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
            <h3 className="font-serif text-xl text-stone-900 dark:text-stone-50 mb-4">Order Details</h3>
            <div className="space-y-3 font-sans text-sm">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between">
                  <span className="text-stone-600 dark:text-stone-400">{item.name} x{item.quantity}</span>
                  <span className="text-stone-900 dark:text-stone-50">₹{(item.priceNum * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
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
              <span className="text-stone-900 dark:text-stone-50">₹{cartItems.reduce((s, i) => s + (i.priceNum * i.quantity), 0).toLocaleString('en-IN')}</span>
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
            onClick={handleRazorpayPayment}
            disabled={loading || paymentMethod !== 'razorpay'}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-stone-900 font-sans font-bold py-3 rounded-lg transition-colors mb-4"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>

          <p className="font-sans text-xs text-stone-500 text-center">
            Your payment information is secure and encrypted
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default CheckoutPayment;
