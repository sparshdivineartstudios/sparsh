import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Navigate, Link } from 'react-router-dom';

const Favorites = () => {
  const { isAuthenticated, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get('https://home-8zob.onrender.com/api/favorites');
        setFavorites(res.data.products || res.data); 
      } catch (err) {
        console.error("Error fetching favorites", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-7xl mx-auto">
      <div className="mb-16 border-b border-stone-200 dark:border-stone-800 pb-8 text-center animate-fade-in">
        <p className="font-sans text-amber-600 dark:text-amber-500 uppercase tracking-widest text-sm font-semibold mb-4">
          Your Collection
        </p>
        <h1 className="font-serif text-5xl font-semibold text-stone-900 dark:text-stone-50">
          Favorites
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-lg p-24 text-center shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-stone-400 mb-6">favorite_border</span>
          <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-50 mb-4 font-medium">Your wishlist is empty</h3>
          <p className="font-sans text-stone-500 mb-8">Save your favorite artisanal pieces here.</p>
          <Link to="/products" className="inline-block bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 px-8 py-4 font-sans uppercase tracking-widest text-xs font-semibold hover:bg-amber-600 hover:text-stone-50 transition-colors rounded">
             Explore Gallery
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {favorites.map((product, idx) => (
             <motion.div 
               key={product._id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1, duration: 0.6 }}
               className="group flex flex-col"
             >
               <Link to={`/products/${product._id}`} className="block relative overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-900 mb-4 aspect-square shadow-sm">
                 <img src={product.images && product.images[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500" />
                 <button className="absolute top-4 right-4 bg-white/90 dark:bg-stone-900/90 w-8 h-8 rounded-full flex items-center justify-center text-amber-600 shadow hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-[16px] fill-current">favorite</span>
                 </button>
               </Link>
               <div>
                  <Link to={`/products/${product._id}`}>
                    <h5 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-50 group-hover:text-amber-600 transition-colors truncate">{product.name}</h5>
                  </Link>
                  <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100 mt-1">₹{product.priceNum?.toLocaleString() || product.price}</p>
               </div>
             </motion.div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Favorites;
