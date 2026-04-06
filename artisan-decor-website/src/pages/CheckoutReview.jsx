import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const CheckoutReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, shippingDetails, shippingCost, finalTotal } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [editStep, setEditStep] = useState(null);

  if (!cartItems) {
    return (
      <main className="min-h-screen pt-32 pb-24 px-8">
        <p>No order data found. Please start from cart.</p>
      </main>
    );
  }

  const handleProceedToPayment = async () => {
    setLoading(true);
    try {
      // Create order on backend
      const response = await fetch('https://home-8zob.onrender.com/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          items: cartItems.map(item => ({ productId: item._id, quantity: item.quantity })),
          shippingDetails,
          totalAmount: finalTotal,
          notes: shippingDetails.notes,
        })
      });

      if (response.ok) {
        const { orderId } = await response.json();
        navigate('/checkout/payment', {
          state: {
            orderId,
            cartItems,
            shippingDetails,
            shippingCost,
            finalTotal,
          }
        });
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-5xl text-stone-900 dark:text-stone-50 mb-2">Review Order</h1>
        <p className="font-sans text-stone-500">Step 2 of 3</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Review Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8"
          >
            <h2 className="font-serif text-xl text-stone-900 dark:text-stone-50 mb-6">Order Items</h2>
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div key={item._id} className="flex justify-between items-center pb-4 border-b border-stone-200 dark:border-stone-800 last:border-0">
                  <div>
                    <p className="font-sans text-stone-900 dark:text-stone-50 font-semibold">{item.name}</p>
                    <p className="font-sans text-stone-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-serif text-amber-600 font-semibold">₹{(item.priceNum * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shipping Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl text-stone-900 dark:text-stone-50">Shipping Address</h2>
              <button
                onClick={() => navigate('/checkout/shipping', { state: { cartItems } })}
                className="text-amber-600 text-sm font-sans uppercase tracking-widest hover:text-amber-500"
              >
                Edit
              </button>
            </div>
            <div className="space-y-2 font-sans text-stone-600 dark:text-stone-400">
              <p>{shippingDetails.fullName}</p>
              <p>{shippingDetails.address}</p>
              <p>{shippingDetails.city}, {shippingDetails.state} {shippingDetails.pincode}</p>
              <p className="mt-3 text-stone-900 dark:text-stone-50">{shippingDetails.phone}</p>
              <p className="text-stone-900 dark:text-stone-50">{shippingDetails.email}</p>
            </div>
            {shippingDetails.notes && (
              <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
                <p className="font-sans text-sm"><strong>Notes:</strong> {shippingDetails.notes}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Order Total */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 h-fit sticky top-32"
        >
          <h3 className="font-serif text-lg text-stone-900 dark:text-stone-50 mb-6">Order Total</h3>
          <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
            <div className="flex justify-between font-sans">
              <span className="text-stone-600 dark:text-stone-400">Subtotal</span>
              <span className="text-stone-900 dark:text-stone-50">₹{cartItems.reduce((s, i) => s + (i.priceNum * i.quantity), 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-sans">
              <span className="text-stone-600 dark:text-stone-400">Shipping</span>
              <span className="text-stone-900 dark:text-stone-50">₹{shippingCost}</span>
            </div>
          </div>

          <div className="border-t border-stone-200 dark:border-stone-800 pt-4 mb-8">
            <div className="flex justify-between font-serif text-2xl font-semibold">
              <span className="text-stone-900 dark:text-stone-50">Total</span>
              <span className="text-amber-600">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToPayment}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-stone-900 font-sans font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </motion.div>
      </div>
    </main>
  );
};

export default CheckoutReview;
