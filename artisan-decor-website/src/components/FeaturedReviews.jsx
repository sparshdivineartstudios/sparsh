import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_URL } from '../utils/apiConfig';

/* Star Rating Component */
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`material-symbols-outlined text-[14px] ${
          i < (rating || 0) ? 'text-amber-500' : 'text-stone-300 dark:text-stone-700'
        }`}
      >
        star
      </span>
    ))}
  </div>
);

/* Helper to get drive thumbnail */
function getDriveFileId(url = '') {
  const ucMatch = url.match(/[?&]id=([^&]+)/);
  if (ucMatch) return ucMatch[1];
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) return fileMatch[1];
  return null;
}

function driveThumbnail(url = '', size = 'w400') {
  const id = getDriveFileId(url);
  if (!id) return url;
  return `https://drive.google.com/thumbnail?id=${id}&sz=${size}`;
}

export default function FeaturedReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    axios.get(`${API_URL}/api/reviews/featured?limit=6`)
      .then(res => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching featured reviews:', err);
        setError('Failed to load reviews');
        setLoading(false);
      });

    // Rotate through reviews every 6 seconds
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % Math.max(1, reviews.length || 1));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 space-y-3">
            <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded-lg w-64 mx-auto animate-pulse" />
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-lg w-80 mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-stone-100 dark:bg-stone-900 rounded-2xl p-6 h-52 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-stone-50 dark:bg-stone-950/50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="font-sans text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2"
          >
            What Our Customers Say
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-stone-50 mb-3"
          >
            Loved by Design Enthusiasts
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-sans text-stone-600 dark:text-stone-400 max-w-2xl mx-auto"
          >
            Real reviews from our customers who have brought Sparsh's artisan pieces into their homes
          </motion.p>
        </div>

        {/* Featured Carousel */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reviews.map((review, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                animate={{
                  scale: isActive ? 1.02 : 1,
                }}
                className={`group rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isActive
                    ? 'border-amber-200 dark:border-amber-700 shadow-lg'
                    : 'border-stone-200 dark:border-stone-800 shadow-sm'
                }`}
              >
                <div className="bg-white dark:bg-stone-900 h-full flex flex-col">
                  {/* Rating Stars */}
                  <div className="px-6 pt-6">
                    <StarRating rating={review.rating} />
                  </div>

                  {/* Review Content */}
                  <div className="px-6 py-4 flex-1 flex flex-col">
                    {review.title && (
                      <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">
                        {review.title}
                      </h3>
                    )}
                    <p className="font-sans text-sm text-stone-600 dark:text-stone-400 line-clamp-3 flex-1 mb-4">
                      "{review.comment}"
                    </p>

                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-serif text-amber-600 text-sm font-bold">
                          {review.user?.name?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-semibold text-stone-800 dark:text-stone-200">
                          {review.user?.name || 'Anonymous'}
                        </p>
                        <p className="font-sans text-xs text-stone-500">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Product Link */}
                    {review.product && (
                      <Link
                        to={`/products/${review.product._id}`}
                        className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-500 text-xs font-semibold uppercase tracking-widest hover:gap-3 transition-all group/link"
                      >
                        See {review.product.name}
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    )}
                  </div>

                  {/* Visual Indicator */}
                  <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2">
          {reviews.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              animate={{
                scale: activeIndex === idx ? 1.2 : 1,
                backgroundColor: activeIndex === idx ? 'rgb(217, 119, 6)' : 'rgb(168, 162, 158)',
              }}
              className="w-2.5 h-2.5 rounded-full transition-colors"
              title={`Review ${idx + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-full font-sans text-sm font-bold uppercase tracking-widest hover:gap-3 transition-all hover:shadow-lg"
          >
            Explore All Products
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
