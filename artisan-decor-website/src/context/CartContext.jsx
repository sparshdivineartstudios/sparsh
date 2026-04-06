import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const CartProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to create axios instance with current token
  const getCartAPI = () => {
    return axios.create({
      baseURL: API,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  };

  // Fetch cart from database when user logs in
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setCartItems([]);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const cartAPI = getCartAPI();
        const response = await cartAPI.get('/api/cart');
        console.log('Fetched cart response:', response.data);
        
        // Handle both cases: response.data is cart object or response.data.items
        const items = response.data.items || response.data || [];
        console.log('Setting cart items:', items);
        setCartItems(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, token]);

  const addToCart = async (product) => {
    try {
      const cartAPI = getCartAPI();
      const response = await cartAPI.post('/api/cart/add', {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category
      });
      console.log('Added to cart, response:', response.data);
      
      const items = response.data.items || response.data || [];
      setCartItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.data?.details) {
        console.error('Server error details:', error.response.data.details);
        alert('Error: ' + error.response.data.details);
      }
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const cartAPI = getCartAPI();
      const response = await cartAPI.delete(`/api/cart/remove/${productId}`);
      console.log('Removed from cart, response:', response.data);
      
      const items = response.data.items || response.data || [];
      setCartItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      const cartAPI = getCartAPI();
      const response = await cartAPI.put(`/api/cart/update/${productId}`, {
        quantity
      });
      console.log('Updated quantity, response:', response.data);
      
      const items = response.data.items || response.data || [];
      setCartItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const cartAPI = getCartAPI();
      await cartAPI.delete('/api/cart/clear');
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
