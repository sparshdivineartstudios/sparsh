import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const CheckoutShipping = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, total } = location.state || { cartItems: [], total: 0 };
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  const [shippingCost, setShippingCost] = useState(150);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    navigate('/checkout/review', {
      state: {
        cartItems,
        total,
        shippingDetails: form,
        shippingCost,
        finalTotal: total + shippingCost,
      }
    });
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-5xl text-stone-900 dark:text-stone-50 mb-2">Shipping Details</h1>
        <p className="font-sans text-stone-500">Step 1 of 3</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="lg:col-span-2 space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-600"
                placeholder="Your name"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-600"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-600"
              placeholder="+91 XXXXX XXXXX"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-600 resize-none"
              placeholder="Street address, apartment, etc."
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-600"
                placeholder="City"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-600"
                placeholder="State"
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Pincode</label>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-600"
                placeholder="Pincode"
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Order Notes (Optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-600 resize-none"
              placeholder="Any special instructions..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-sans font-bold py-3 rounded-lg transition-colors"
          >
            Continue to Review
          </button>
        </motion.form>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 h-fit sticky top-32"
        >
          <h3 className="font-serif text-lg text-stone-900 dark:text-stone-50 mb-4">Order Summary</h3>
          <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
            {cartItems.map(item => (
              <div key={item._id} className="flex justify-between font-sans text-sm">
                <span className="text-stone-600 dark:text-stone-400">{item.name} x{item.quantity}</span>
                <span className="text-stone-900 dark:text-stone-50">₹{(item.priceNum * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between font-sans">
              <span className="text-stone-600 dark:text-stone-400">Subtotal</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-sans">
              <span className="text-stone-600 dark:text-stone-400">Shipping</span>
              <span>₹{shippingCost}</span>
            </div>
          </div>

          <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
            <div className="flex justify-between font-serif text-xl font-semibold">
              <span>Total</span>
              <span className="text-amber-600">₹{(total + shippingCost).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default CheckoutShipping;
