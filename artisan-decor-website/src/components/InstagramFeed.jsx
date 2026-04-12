import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchInstagramPosts, getInstagramProfileUrl } from '../utils/instagramAPI';
import { API_URL } from '../utils/apiConfig';

/**
 * Instagram Feed Component
 * Displays recent Instagram posts in a grid
 * Fetches credentials securely from Render backend
 * 
 * Props:
 * - instagramHandle: Instagram username/handle
 * - postsLimit: Number of posts to display (default: 4)
 */
const InstagramFeed = ({ instagramHandle = 'sparshdivineartstudio', postsLimit = 4 }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        // console.log('📸 Fetching Instagram posts from:', `${API_URL}/api/instagram/posts?limit=${postsLimit}`);
        
        const fetchedPosts = await fetchInstagramPosts(API_URL, postsLimit);
        // console.log('📸 Received posts:', fetchedPosts.length, fetchedPosts);
        
        if (fetchedPosts.length === 0) {
          setError('No posts found - check backend logs');
          // console.warn('No Instagram posts returned from backend');
        } else {
          setPosts(fetchedPosts);
          // console.log('✅ Instagram posts loaded successfully');
        }
      } catch (err) {
        setError(err.message);
        // console.error('❌ Failed to load Instagram posts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [postsLimit]);

  if (loading) {
    return (
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-amber-600 dark:text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3"
          >
            Follow the Studio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-stone-50"
          >
            Latest from Instagram
          </motion.h2>
        </div>

        {/* Skeleton Loaders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error && posts.length === 0) {
    return (
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-amber-600 dark:text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3"
          >
            Follow the Studio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-stone-50 mb-4"
          >
            Latest from Instagram
          </motion.h2>
          <p className="text-red-600 dark:text-red-400 font-sans text-sm">
            {error}  — Check browser console for details
          </p>
        </div>
      </section>
    );
  }

  const instagramProfileUrl = getInstagramProfileUrl(instagramHandle);

  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-amber-600 dark:text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3"
          >
            Follow the Studio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-stone-50"
          >
            Latest from Instagram
          </motion.h2>
        </div>
        <motion.a
          href={instagramProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-500 transition-colors dark:text-amber-500 dark:hover:text-amber-400 font-sans text-sm uppercase tracking-widest font-semibold"
          whileHover={{ x: 4 }}
        >
          Follow on Instagram
          <span className="inline-block">→</span>
        </motion.a>
      </div>

      {/* Instagram Posts Grid */}
      {posts.length > 0 ? (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${posts.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
          {posts.map((post, idx) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-lg aspect-square shadow-lg hover:shadow-2xl transition-shadow"
              whileHover={{ y: -8 }}
            >
              {/* Image - High Quality Display */}
              <div className="absolute inset-0 overflow-hidden bg-stone-900">
                <img
                  src={post.image}
                  alt={post.caption.slice(0, 50) || 'Instagram Post'}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="high"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.src = 'https://via.placeholder.com/400?text=Image+Unavailable';
                  }}
                />
              </div>

              {/* Overlay - appears on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                {/* Caption text */}
                {post.caption && (
                  <p className="text-white font-sans text-xs leading-relaxed line-clamp-3 mb-3">
                    {post.caption.slice(0, 150)}
                    {post.caption.length > 150 ? '...' : ''}
                  </p>
                )}

                {/* Instagram info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white text-xs font-sans">
                    {post.likes > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="text-amber-400">♥</span> {post.likes > 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
                      </span>
                    )}
                    {post.comments > 0 && (
                      <span className="flex items-center gap-1">
                        💬 {post.comments > 1000 ? `${(post.comments / 1000).toFixed(1)}k` : post.comments}
                      </span>
                    )}
                  </div>
                  <span className="text-amber-400 font-sans text-[10px] uppercase tracking-wider font-semibold">
                    View →
                  </span>
                </div>
              </div>

              {/* Instagram icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      ) : null}

      {/* Follow CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-center"
      >
        <a
          href={instagramProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-900 px-8 py-4 font-sans uppercase tracking-widest text-xs font-bold transition-all duration-300 rounded-sm transform hover:shadow-lg"
        >
          Follow Us on Instagram →
        </a>
      </motion.div>
    </section>
  );
};

export default InstagramFeed;
