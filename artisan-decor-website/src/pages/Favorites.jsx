import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Navigate, Link } from 'react-router-dom';

const API = 'https://home-8zob.onrender.com';

function getDriveFileId(url = '') {
  const ucMatch = url.match(/[?&]id=([^&]+)/);
  if (ucMatch) return ucMatch[1];
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) return fileMatch[1];
  return null;
}
function driveThumbnail(url = '', size = 'w400') {
  const id = getDriveFileId(url);
  // console.log('Extracted Google Drive ID:', id);
  // console.log('Original URL:', `https://drive.google.com/thumbnail?id=${id}&sz=${size}`);
  if (!id) return url;
  return `https://drive.google.com/thumbnail?id=${id}&sz=${size}`;
}

const Favorites = () => {
  const { isAuthenticated, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  if (!isAuthenticated) return <Navigate to="/login" />;

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${API}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // console.log('Fetched favorites:', res.data);
      setFavorites(res.data || []);
    } catch (err) {
      console.error('Error fetching favorites', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFavorites(); }, []);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`${API}/api/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(prev => prev.filter(p => p._id !== productId));
    } catch { 
      console.error('Failed to remove from favorites. Please try again.');
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-7xl mx-auto">
      <div className="mb-16 border-b border-stone-200 dark:border-stone-800 pb-8 text-center">
        <p className="font-sans text-amber-600 dark:text-amber-500 uppercase tracking-widest text-sm font-semibold mb-4">
          Your Collection
        </p>
        <h1 className="font-serif text-5xl font-semibold text-stone-900 dark:text-stone-50">
          Saved Pieces
        </h1>
        <p className="font-sans text-stone-400 text-sm mt-3">Pieces you've saved for later</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin" />
        </div>
      ) : favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-2xl p-24 text-center shadow-sm"
        >
          <span className="material-symbols-outlined text-[56px] text-stone-300 dark:text-stone-700 block mb-5">favorite_border</span>
          <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-50 mb-3">Your wishlist is empty</h3>
          <p className="font-sans text-stone-500 mb-8 text-sm">Browse our collection and save pieces you love.</p>
          <Link
            to="/products"
            className="inline-block bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 px-8 py-4 font-sans uppercase tracking-widest text-xs font-bold hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors rounded-xl"
          >
            Browse Gallery
          </Link>
        </motion.div>
      ) : (
        <>
          <p className="font-sans text-sm text-stone-500 mb-8">{favorites.length} piece{favorites.length !== 1 ? 's' : ''} saved</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {favorites.map((product, idx) => {
              // console.log(`Processing product: ${product.name} (ID: ${product._id})`);
              // console.log('Product images:', product.images);
              const primarySrc = product.images?.[0]
                ? driveThumbnail(product.images[0], 'w400')
                : null;
              // console.log(`Product: ${product.name}, Primary Image URL: ${primarySrc}`);
              const imgSrc = imageErrors[product._id] || !primarySrc
                ? 'https://sparshdivineartstudio.me/img-resin-tray.png'
                : primarySrc;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="group flex flex-col"
                >
                  <div className="relative overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-900 mb-4 aspect-[4/5] shadow-sm">
                    <Link to={`/products/${product._id}`}>
                      <img
                        src={imgSrc}
                        alt={product.name}
                        onError={() => handleImageError(product._id)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    {/* Remove from favorites */}
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="absolute top-3 right-3 bg-white/90 dark:bg-stone-900/90 w-8 h-8 rounded-full flex items-center justify-center text-amber-500 shadow hover:scale-110 transition-transform hover:text-red-500"
                      title="Remove from favorites"
                    >
                      <span className="material-symbols-outlined text-[16px] fill-current">favorite</span>
                    </button>
                    {product.inStock === false && (
                      <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center rounded-xl">
                        <span className="bg-stone-900 text-stone-300 font-sans text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border border-stone-600">Sold Out</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Link to={`/products/${product._id}`}>
                      <h5 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-50 group-hover:text-amber-600 transition-colors leading-tight">
                        {product.name}
                      </h5>
                    </Link>
                    <p className="font-sans text-xs text-stone-500 dark:text-stone-500 uppercase tracking-widest mt-1">{product.category}</p>
                    <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100 mt-1">{product.price}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
};

export default Favorites;
