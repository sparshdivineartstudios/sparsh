import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchInstagramPosts } from '../utils/instagramAPI';
import { API_URL } from '../utils/apiConfig';

/**
 * Instagram Feed Component
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
        const fetchedPosts = await fetchInstagramPosts(API_URL, postsLimit);
        
        if (!fetchedPosts || fetchedPosts.length === 0) {
          setError('No posts found - ensure System User is assigned to the Instagram asset.');
        } else {
          setPosts(fetchedPosts);
        }
      } catch (err) {
        setError(err.message);
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
          <motion.p className="font-sans text-amber-600 uppercase tracking-widest text-xs font-semibold mb-3">
            Follow the Studio
          </motion.p>
          <div className="h-12 w-64 bg-stone-200 mx-auto animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="aspect-square rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error && posts.length === 0) {
    return (
      <section className="py-24 px-8 max-w-7xl mx-auto text-center">
        <h2 className="font-serif text-3xl mb-4 text-stone-900 dark:text-stone-50">Latest from Instagram</h2>
        <p className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 inline-block px-4 py-2 rounded-md">{error}</p>
      </section>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <motion.a 
          href="https://www.instagram.com/_sparsh_divine_art_studio_"
          target="_blank" 
          rel="noopener noreferrer"
          whileHover={{ x: 4 }}
          className="text-amber-600 font-semibold tracking-widest text-xs uppercase transition-colors dark:text-amber-500"
        >
          Follow on Instagram →
        </motion.a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative overflow-hidden rounded-lg aspect-square shadow-lg bg-stone-900"
          >
            {/* Image/Video with zoom on hover (desktop only) */}
            {post.image && post.image.includes('.mp4') ? (
              <video 
                src={post.image}
                className="w-full h-full object-cover opacity-80 transition-transform duration-500 md:group-hover:scale-110"
                muted
                loop
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={post.image}
                alt={post.caption || 'Instagram Post'}
                crossOrigin="anonymous" 
                className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-110"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400?text=View+on+Instagram';
                }}
              />
            )}

            {/* Overlay - Only at bottom on mobile, full on desktop hover */}
            <div className="absolute bottom-0 left-0 right-0 md:inset-0 bg-gradient-to-t md:bg-black/60 from-black/80 to-transparent md:to-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <p className="text-white text-xs line-clamp-3 mb-3 leading-relaxed">
                {post.caption}
              </p>
              <div className="flex justify-between items-center text-white text-[10px] font-bold tracking-widest uppercase">
                <span className="flex items-center gap-1">
                  <span className="text-amber-500 text-sm">♥</span> {post.likes}
                </span>
                <a 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  View on IG →
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InstagramFeed;