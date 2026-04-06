import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProxyImageUrl } from '../utils/imageProxy';

const Cart = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, loading } = useCart();

  // Get cart total
  const total = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[₹\s]/g, '')) 
      : (item.price || 0);
    return sum + price * item.quantity;
  }, 0);

  const handleUpdateQuantity = async (productId, newQty) => {
    if (newQty < 1) {
      await removeFromCart(productId);
      return;
    }
    try {
      // Ensure productId is a string
      const id = typeof productId === 'string' ? productId : productId?.toString?.() || productId;
      await updateQuantity(id, newQty);
    } catch (error) {
      console.error('Failed to update quantity', error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      // Ensure productId is a string
      const id = typeof productId === 'string' ? productId : productId?.toString?.() || productId;
      await removeFromCart(id);
    } catch (error) {
      console.error('Failed to remove from cart', error);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }
    navigate('/checkout/shipping', { state: { cartItems, total } });
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-stone-200 dark:border-stone-700 border-t-amber-600 rounded-full animate-spin" />
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <span className="material-symbols-outlined text-5xl sm:text-6xl text-stone-300 dark:text-stone-700 block mb-4 sm:mb-6">shopping_cart</span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 dark:text-stone-50 mb-3 sm:mb-4">Your cart is empty</h1>
          <p className="font-sans text-sm sm:text-base text-stone-500 dark:text-stone-400 mb-6 sm:mb-8">Browse our collection and add some beautiful pieces!</p>
          <Link to="/products" className="inline-block bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-sans font-semibold transition-colors text-sm sm:text-base">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-stone-900 dark:text-stone-50 mb-2">Your Cart</h1>
          <p className="font-sans text-sm sm:text-base text-stone-500 dark:text-stone-400">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart</p>
        </div>

        {/* Mobile & Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cartItems.map((item, idx) => {
              const price = typeof item.price === 'string' 
                ? parseFloat(item.price.replace(/[₹\s]/g, '')) 
                : (item.price || 0);
              const subtotal = price * item.quantity;

              return (
                <motion.div
                  key={item.productId?._id || item.productId?.toString() || item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg sm:rounded-xl p-4 sm:p-6"
                >
                  {/* Mobile Layout */}
                  <div className="block sm:hidden space-y-3">
                    {/* Image */}
                    <div className="w-full h-40 bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden">
                      <img
                        src={getProxyImageUrl(item.image) || 'https://home-8zob.onrender.com/api/drive/file/1MXoVV7Uln237VbjnRo9I2yHpN8lkWexpo'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(item.name);
                        }}
                      />
                    </div>
                    
                    {/* Name & Category */}
                    <div>
                      <Link to={`/products/${item.productId || item._id}`} className="font-serif text-lg sm:text-xl text-stone-900 dark:text-stone-50 hover:text-amber-600 transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="font-sans text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">{item.category}</p>
                    </div>

                    {/* Price & Quantity Row */}
                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <p className="font-sans text-xs text-stone-500 dark:text-stone-400 mb-1">Price</p>
                        <p className="font-sans text-amber-600 font-semibold">₹{price}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-sans text-xs text-stone-500 dark:text-stone-400 mb-1">Qty</p>
                        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 rounded p-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.productId?._id || item.productId?.toString?.() || item._id, item.quantity - 1)}
                            className="px-2 py-1 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 font-semibold"
                          >
                            −
                          </button>
                          <span className="px-2 font-sans text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.productId?._id || item.productId?.toString?.() || item._id, item.quantity + 1)}
                            className="px-2 py-1 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 font-semibold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-sans text-xs text-stone-500 dark:text-stone-400 mb-1">Subtotal</p>
                        <p className="font-serif font-semibold text-stone-900 dark:text-stone-50">₹{subtotal.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromCart(item.productId?._id || item.productId?.toString?.() || item._id)}
                      className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-sans text-xs uppercase tracking-widest py-2 rounded transition-colors"
                    >
                      Remove from Cart
                    </button>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex gap-6 items-start">
                    {/* Product Image */}
                    <div className="w-28 md:w-32 h-28 md:h-32 bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getProxyImageUrl(item.image) || 'https://home-8zob.onrender.com/api/drive/file/1MXoVV7Uln237VbjnRo9I2yHpN8lkWexpo'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300?text=' + encodeURIComponent(item.name);
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.productId || item._id}`} className="font-serif text-lg md:text-xl text-stone-900 dark:text-stone-50 hover:text-amber-600 transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="font-sans text-sm md:text-base text-stone-500 dark:text-stone-400 mt-1">{item.category}</p>
                      <p className="font-sans text-amber-600 font-semibold mt-2">₹{price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 rounded-lg p-1 flex-shrink-0">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId?._id || item.productId?.toString?.() || item._id, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 hover:bg-white dark:hover:bg-stone-700 rounded transition-colors"
                      >
                        −
                      </button>
                      <span className="px-3 font-sans text-sm font-medium min-w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId?._id || item.productId?.toString?.() || item._id, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 hover:bg-white dark:hover:bg-stone-700 rounded transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-24 flex-shrink-0">
                      <p className="font-sans text-xs md:text-sm text-stone-500 dark:text-stone-400">Subtotal</p>
                      <p className="font-serif text-lg md:text-xl font-semibold text-stone-900 dark:text-stone-50">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromCart(item.productId?._id || item.productId?.toString?.() || item._id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-sans text-xs uppercase tracking-widest px-3 py-2 rounded transition-colors flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-stone-50 dark:bg-stone-900 rounded-lg sm:rounded-2xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 h-fit lg:sticky lg:top-32"
          >
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-50 mb-6">Order Summary</h2>

            <div className="space-y-3 sm:space-y-4 border-b border-stone-200 dark:border-stone-800 pb-6 mb-6">
              <div className="flex justify-between font-sans text-sm sm:text-base">
                <span className="text-stone-600 dark:text-stone-400">Subtotal</span>
                <span className="text-stone-900 dark:text-stone-50 font-medium">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-sans text-sm sm:text-base">
                <span className="text-stone-600 dark:text-stone-400">Shipping</span>
                <span className="text-stone-900 dark:text-stone-50 font-medium">At checkout</span>
              </div>
              <div className="flex justify-between font-sans text-sm sm:text-base">
                <span className="text-stone-600 dark:text-stone-400">Tax</span>
                <span className="text-stone-900 dark:text-stone-50 font-medium">At checkout</span>
              </div>
            </div>

            <div className="flex justify-between mb-8 pb-6 sm:pb-8">
              <span className="font-sans font-semibold text-stone-900 dark:text-stone-50">Total</span>
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-amber-600">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-sans font-bold py-3 sm:py-4 rounded-lg transition-colors mb-3 sm:mb-4 text-sm sm:text-base"
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login & Checkout'}
            </button>

            <Link
              to="/products"
              className="block text-center py-2 sm:py-3 text-amber-600 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 font-sans text-xs sm:text-sm uppercase tracking-widest transition-colors rounded-lg"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
