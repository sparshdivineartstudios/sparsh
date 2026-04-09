import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { API_URL } from '../utils/apiConfig';

/* ─────────────────────────────────────────────
   Drive URL helpers (same as Products.jsx)
   ───────────────────────────────────────────── */
function getDriveFileId(url = '') {
  const ucMatch = url.match(/[?&]id=([^&]+)/);
  if (ucMatch) return ucMatch[1];
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) return fileMatch[1];
  return null;
}

function driveThumbnail(url = '', size = 'w800') {
  const id = getDriveFileId(url);
  if (!id) return url;
  return `https://drive.google.com/thumbnail?id=${id}&sz=${size}`;
}

function drivePreviewUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/* ─────────────────────────────────────────────
   Thumbnail strip item
   ───────────────────────────────────────────── */
const ThumbItem = ({ url, active, onClick, index }) => {
  const [err, setErr] = useState(false);
  return (
    <button
      onClick={onClick}
      className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all duration-200 ${active
        ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-950 scale-105'
        : 'opacity-60 hover:opacity-100'
        }`}
    >
      <img
        src={err ? 'https://sparshdivineartstudio.me/img-resin-tray.png' : driveThumbnail(url, 'w200')}
        alt={`View ${index + 1}`}
        onError={() => setErr(true)}
        className="w-full h-full object-cover"
      />
    </button>
  );
};

/* ─────────────────────────────────────────────
   Main photo viewer with Drive iframe lightbox
   ───────────────────────────────────────────── */
const PhotoViewer = ({ images, driveFolderId }) => {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const currentRaw = images?.[selected];
  const currentFileId = currentRaw ? getDriveFileId(currentRaw) : null;
  const currentThumb = currentRaw && !imgErr
    ? driveThumbnail(currentRaw, 'w900')
    : 'https://sparshdivineartstudio.me/img-resin-tray.png';

  const goNext = () => { setImgErr(false); setSelected(s => (s + 1) % images.length); };
  const goPrev = () => { setImgErr(false); setSelected(s => (s - 1 + images.length) % images.length); };

  // Keyboard nav in lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-stone-100 dark:bg-stone-900 rounded-2xl flex items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-stone-300">image</span>
      </div>
    );
  }

  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 800], [0, 150]);
  
  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative aspect-[4/5] bg-stone-100 dark:bg-stone-900 rounded-2xl overflow-hidden cursor-zoom-in shadow-lg group"
        onClick={() => setLightboxOpen(true)}
      >
        <motion.img
          style={{ y: yImage }}
          key={selected}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          src={currentThumb}
          alt="Product view"
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {/* Expand hint */}
        <div className="absolute bottom-4 right-4 bg-stone-900/70 text-white rounded-full p-2 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">zoom_in</span>
        </div>
        {/* Navigation arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); goPrev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-stone-900/60 text-white rounded-full p-1.5 backdrop-blur-sm hover:bg-stone-900/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              onClick={e => { e.stopPropagation(); goNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-stone-900/60 text-white rounded-full p-1.5 backdrop-blur-sm hover:bg-stone-900/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </>
        )}
        {/* Counter badge */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-stone-900/70 text-white text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
            {selected + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <ThumbItem
              key={i}
              url={url}
              active={i === selected}
              onClick={() => { setImgErr(false); setSelected(i); }}
              index={i}
            />
          ))}
        </div>
      )}

      {/* ── Lightbox with Drive iframe ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/90 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 bg-stone-800/80 text-white rounded-full p-2 hover:bg-stone-800 z-[110] transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>

            {/* Prev */}
            {images.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-stone-800/80 text-white rounded-full p-2 hover:bg-stone-800 z-[110] transition-colors"
                onClick={e => { e.stopPropagation(); goPrev(); }}
              >
                <span className="material-symbols-outlined text-[24px]">chevron_left</span>
              </button>
            )}

            {/* Content: Drive iframe for full quality, fallback to img */}
            <div
              className="w-[90vw] max-w-4xl max-h-[88vh] rounded-xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {currentFileId ? (
                <iframe
                  key={currentFileId}
                  src={drivePreviewUrl(currentFileId)}
                  className="w-full h-[85vh] border-0 bg-stone-900"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title="Product photo"
                />
              ) : (
                <img
                  src={currentThumb}
                  alt="Product"
                  className="w-full h-[85vh] object-contain bg-stone-900"
                />
              )}
            </div>

            {/* Next */}
            {images.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-stone-800/80 text-white rounded-full p-2 hover:bg-stone-800 z-[110] transition-colors"
                onClick={e => { e.stopPropagation(); goNext(); }}
              >
                <span className="material-symbols-outlined text-[24px]">chevron_right</span>
              </button>
            )}

            {/* Counter */}
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-stone-400 text-xs font-sans">
              {selected + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Drive Folder Gallery embed
   ───────────────────────────────────────────── */
const DriveFolderGallery = ({ folderId }) => {
  const [show, setShow] = useState(false);
  if (!folderId) return null;

  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;

  return (
    <div className="mt-12 border-t border-stone-200 dark:border-stone-800 pt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-sans text-xs text-stone-500 dark:text-stone-500 uppercase tracking-widest mb-1">Full Collection</p>
          <h3 className="font-serif text-xl text-stone-900 dark:text-stone-50">Browse All Photos</h3>
        </div>
        <button
          onClick={() => setShow(s => !s)}
          className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest font-semibold text-amber-600 dark:text-amber-500 border border-amber-500 px-4 py-2 rounded-full hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-stone-900 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">
            {show ? 'expand_less' : 'photo_library'}
          </span>
          {show ? 'Hide Gallery' : 'Open Full Gallery'}
        </button>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 520 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800 shadow-md"
          >
            <iframe
              src={embedUrl}
              className="w-full h-[520px] border-0"
              allow="fullscreen"
              allowFullScreen
              title="Product photo gallery"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Related Product Card (needs its own state)
   ───────────────────────────────────────────── */
const RelatedCard = ({ product: p, idx }) => {
  const [err, setErr] = useState(false);
  return (
    <motion.div
      key={p._id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="group"
    >
      <Link to={`/products/${p._id}`} className="block aspect-[4/5] relative overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-900 mb-3 shadow-sm group-hover:shadow-md transition-shadow">
        <img
          src={err ? 'https://sparshdivineartstudio.me/img-resin-tray.png' : driveThumbnail(p.images?.[0], 'w500')}
          alt={p.name}
          onError={() => setErr(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <Link to={`/products/${p._id}`}>
        <h4 className="font-serif text-base font-medium text-stone-900 dark:text-stone-50 group-hover:text-amber-600 transition-colors">{p.name}</h4>
      </Link>
      <p className="font-sans text-sm text-amber-600 dark:text-amber-500 font-semibold mt-0.5">{p.price}</p>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Star Rating Display
   ───────────────────────────────────────────── */
const StarRating = ({ rating, interactive = false, onRate }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type={interactive ? 'button' : undefined}
        onClick={interactive ? () => onRate(star) : undefined}
        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} text-lg leading-none ${star <= rating ? 'text-amber-500' : 'text-stone-300 dark:text-stone-700'}`}
      >
        ★
      </button>
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   Reviews section
   ───────────────────────────────────────────── */
const ReviewsSection = ({ productId }) => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 0, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formErr, setFormErr] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pollInterval, setPollInterval] = useState(null);
  const [newReviewsCount, setNewReviewsCount] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 0, title: '', comment: '' });

  const fetchReviews = (pageNum = 1, sort = sortBy) => {
    axios.get(`${API_URL}/api/reviews/product/${productId}`, {
      params: { page: pageNum, limit: 10, sort }
    })
      .then(res => {
        const { reviews: data, stats: s, pagination } = res.data;
        setReviews(data);
        setStats(s);
        setPage(pagination.page);
        setTotalPages(pagination.pages);
        setNewReviewsCount(0);
        
        // Check if current user has already reviewed this product
        if (isAuthenticated && user) {
          const userReview = data.find(r => r.user._id === user._id || r.user === user._id);
          setHasReviewed(!!userReview);
        }
      })
      .finally(() => setLoading(false));
  };

  // Initial fetch and set up polling
  useEffect(() => {
    fetchReviews(1, sortBy);
    // Poll for new reviews every 10 seconds
    const interval = setInterval(() => {
      axios.get(`${API_URL}/api/reviews/product/${productId}`, {
        params: { page: 1, limit: 10, sort: sortBy }
      })
        .then(res => {
          const newReviewsData = res.data.reviews;
          // If there are NEW reviews (by comparing first review IDs), show notification
          if (reviews.length > 0 && newReviewsData.length > 0 && newReviewsData[0]._id !== reviews[0]._id) {
            setNewReviewsCount(prev => prev + 1);
          }
        })
        .catch(err => console.error('Polling error:', err));
    }, 10000); // Poll every 10 seconds
    
    setPollInterval(interval);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [productId, user, sortBy]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setPage(1);
    fetchReviews(1, newSort);
  };

  const refreshReviews = () => {
    setNewReviewsCount(0);
    fetchReviews(1, sortBy);
  };

  const avgRating = stats.average || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) { setFormErr('Please select a star rating'); return; }
    if (form.comment.length < 5) { setFormErr('Comment must be at least 5 characters'); return; }
    setFormErr('');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFormErr('You must be logged in to submit a review');
        return;
      }
      await axios.post(`${API_URL}/api/reviews/product/${productId}`, form, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setFormSuccess(true);
      setForm({ rating: 0, title: '', comment: '' });
      // Reset success message after 3 seconds
      setTimeout(() => setFormSuccess(false), 3000);
      // Refresh reviews
      setTimeout(() => {
        setPage(1);
        fetchReviews(1, sortBy);
      }, 500);
    } catch (err) {
      console.error('Review submission error:', err.response?.data || err.message);
      setFormErr(err.response?.data?.message || err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFormErr('You must be logged in to delete a review');
        return;
      }
      await axios.delete(`${API_URL}/api/reviews/${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchReviews(page, sortBy);
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
      setFormErr(err.response?.data?.message || err.response?.data?.error || 'Failed to delete review');
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setEditForm({ rating: review.rating, title: review.title, comment: review.comment });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.rating) { setFormErr('Please select a star rating'); return; }
    if (editForm.comment.length < 5) { setFormErr('Comment must be at least 5 characters'); return; }
    setFormErr('');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFormErr('You must be logged in to update a review');
        return;
      }
      await axios.put(`${API_URL}/api/reviews/${editingReviewId}`, editForm, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setFormSuccess(true);
      setEditingReviewId(null);
      setEditForm({ rating: 0, title: '', comment: '' });
      setTimeout(() => setFormSuccess(false), 3000);
      setTimeout(() => {
        fetchReviews(page, sortBy);
      }, 500);
    } catch (err) {
      console.error('Review update error:', err.response?.data || err.message);
      setFormErr(err.response?.data?.message || err.response?.data?.error || 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditForm({ rating: 0, title: '', comment: '' });
    setFormErr('');
  };

  return (
    <div className="mt-14 border-t border-stone-200 dark:border-stone-800 pt-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-1">Customer Feedback</p>
          <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-50">
            Reviews {avgRating && <span className="text-amber-500 text-2xl ml-2">★ {avgRating}</span>}
          </h2>
        </div>
        <span className="font-sans text-xs text-stone-500">{stats.count} review{stats.count !== 1 ? 's' : ''}</span>
      </div>

      {/* New Reviews Notification */}
      {newReviewsCount > 0 && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={refreshReviews}
          className="w-full mb-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl py-2 px-4 text-amber-700 dark:text-amber-400 font-sans text-sm hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          {newReviewsCount} new review{newReviewsCount !== 1 ? 's' : ''} · Click to load
        </motion.button>
      )}

      {/* Star Distribution (if reviews exist) */}
      {stats.count > 0 && (
        <div className="mb-8 bg-stone-50 dark:bg-stone-900/50 rounded-2xl p-6">
          <p className="font-sans text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-widest mb-4">Rating Breakdown</p>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = stats.distribution?.[stars] || 0;
              const percent = stats.count > 0 ? (count / stats.count) * 100 : 0;
              return (
                <motion.div
                  key={stars}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (5 - stars) * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center gap-1 min-w-[60px]">
                    <span className="font-sans text-xs font-semibold text-stone-600 dark:text-stone-400">{stars}</span>
                    <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
                  </div>
                  <div className="flex-1 bg-stone-200 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.6, delay: (5 - stars) * 0.05 }}
                      className="h-full bg-amber-500"
                    />
                  </div>
                  <span className="font-sans text-xs text-stone-500 dark:text-stone-500 min-w-[40px] text-right">{count}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review form for create/edit */}
      {isAuthenticated && !editingReviewId && !hasReviewed && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 mb-8"
        >
          <p className="font-sans text-sm font-semibold text-stone-700 dark:text-stone-300 mb-4">Write a Review</p>

          {formErr && (
            <p className="font-sans text-xs text-red-500 mb-3">{formErr}</p>
          )}

          <div className="mb-4">
            <p className="font-sans text-xs text-stone-500 uppercase tracking-widest mb-2">Your Rating *</p>
            <StarRating rating={form.rating} interactive onRate={r => setForm(f => ({ ...f, rating: r }))} />
          </div>

          <div className="mb-3">
            <input
              type="text"
              placeholder="Review title (optional)"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="mb-4">
            <textarea
              required
              rows={3}
              placeholder="Share your experience with this piece..."
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              maxLength={1000}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 px-6 py-2.5 rounded-xl font-sans text-xs uppercase tracking-widest font-bold hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {submitting ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Posting…</> : 'Post Review'}
          </button>
        </motion.form>
      )}

      {/* Edit form */}
      {editingReviewId && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSaveEdit}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-sans text-sm font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">edit</span>
              Edit Your Review
            </p>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {formErr && (
            <p className="font-sans text-xs text-red-500 mb-3">{formErr}</p>
          )}

          <div className="mb-4">
            <p className="font-sans text-xs text-stone-500 uppercase tracking-widest mb-2">Rating *</p>
            <StarRating rating={editForm.rating} interactive onRate={r => setEditForm(f => ({ ...f, rating: r }))} />
          </div>

          <div className="mb-3">
            <input
              type="text"
              placeholder="Review title (optional)"
              value={editForm.title}
              onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="mb-4">
            <textarea
              required
              rows={3}
              placeholder="Update your experience..."
              value={editForm.comment}
              onChange={e => setEditForm(f => ({ ...f, comment: e.target.value }))}
              maxLength={1000}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 font-sans text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-amber-600 dark:bg-amber-500 text-white dark:text-stone-900 px-6 py-2.5 rounded-xl font-sans text-xs uppercase tracking-widest font-bold hover:bg-amber-700 dark:hover:bg-amber-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-sans text-xs uppercase tracking-widest font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {isAuthenticated && hasReviewed && !editingReviewId && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-600">done</span>
          <p className="font-sans text-sm text-amber-900 dark:text-amber-200">You've already reviewed this product. You can edit your review below.</p>
        </div>
      )}

      {!isAuthenticated && (
        <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined text-stone-400">lock</span>
          <p className="font-sans text-sm text-stone-500"><Link to="/login" className="text-amber-600 underline">Log in</Link> to leave a review</p>
        </div>
      )}

      {formSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-8 flex items-center gap-2 text-green-700 dark:text-green-400 font-sans text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Thank you! Your review has been posted.
        </motion.div>
      )}

      {/* Sort Controls */}
      {reviews.length > 0 && (
        <div className="mb-6 flex items-center justify-between">
          <p className="font-sans text-xs text-stone-500 uppercase tracking-widest">Sort by</p>
          <div className="flex gap-2">
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'highest', label: 'Highest Rated' }
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold transition-colors ${
                  sortBy === opt.value
                    ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse bg-stone-100 dark:bg-stone-900 rounded-2xl h-28" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-5xl text-stone-300 dark:text-stone-700 block mb-3">rate_review</span>
          <p className="font-serif text-xl text-stone-400 dark:text-stone-600">No reviews yet</p>
          <p className="font-sans text-sm text-stone-400 mt-1">Be the first to share your experience!</p>
        </div>
      ) : (
        <>
          <div className="space-y-5 mb-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 relative hover:border-amber-200 dark:hover:border-amber-800 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-7 h-7 bg-amber-500/20 rounded-full flex items-center justify-center"
                      >
                        <span className="font-serif text-amber-600 text-sm font-bold">{review.user?.name?.[0]?.toUpperCase() || '?'}</span>
                      </motion.div>
                      <span className="font-sans text-sm font-semibold text-stone-800 dark:text-stone-200">{review.user?.name || 'Anonymous'}</span>
                      <span className="font-sans text-[10px] text-stone-400">·</span>
                      <span className="font-sans text-[10px] text-stone-400">
                        {new Date(review.updatedAt || review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {review.updatedAt && review.updatedAt !== review.createdAt && (
                          <span className="ml-1 text-amber-600 dark:text-amber-400 italic">· edited</span>
                        )}
                      </span>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <StarRating rating={review.rating} />
                    </motion.div>
                  </div>
                  {/* Edit & Delete buttons for own review or admin */}
                  {user && (review.user?._id === user._id || review.user?.id === user._id) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-stone-400 hover:text-amber-600 transition-colors"
                        title="Edit review"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                        title="Delete review"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  )}
                </div>
                {review.title && (
                  <p className="font-serif text-base font-semibold text-stone-900 dark:text-stone-50 mb-1">{review.title}</p>
                )}
                <p className="font-sans text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => { setPage(p => Math.max(1, p - 1)); fetchReviews(Math.max(1, page - 1), sortBy); }}
                disabled={page === 1}
                className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <motion.button
                    key={p}
                    onClick={() => { setPage(p); fetchReviews(p, sortBy); }}
                    animate={{ scale: page === p ? 1.1 : 1 }}
                    className={`min-w-[32px] h-8 rounded-lg font-sans text-xs font-semibold transition-colors ${
                      page === p
                        ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {p}
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => { setPage(p => Math.min(totalPages, p + 1)); fetchReviews(Math.min(totalPages, page + 1), sortBy); }}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main ProductDetails page
   ───────────────────────────────────────────── */
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, user, token } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/products`)
      .then(res => {
        const data = res.data || [];
        setAllProducts(data);
        setProduct(data.find(p => p._id === id) || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch fav status
  useEffect(() => {
    if (!isAuthenticated) return;
    axios.get(`${API_URL}/api/favorites`)
      .then(res => {
        const favs = res.data || [];
        setIsFav(favs.some(p => p._id === id));
      })
      .catch(() => { });
  }, [id, isAuthenticated]);

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const toggleFav = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setFavLoading(true);
    try {
      if (isFav) {
        await axios.delete(`${API_URL}/api/favorites/${id}`);
        setIsFav(false);
      } else {
        await axios.post(`${API_URL}/api/favorites/${id}`);
        setIsFav(true);
      }
    } catch { }
    finally { setFavLoading(false); }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    // Extract numeric price (remove ₹ and any whitespace)
    const numericPrice = parseFloat(product.price?.replace(/[₹\s]/g, '') || 0);
    
    addToCart({
      _id: product._id,
      name: product.name,
      price: numericPrice,
      image: product.images?.[0] || '',
      category: product.category
    });
    
    navigate('/cart');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-stone-900 dark:text-stone-50 gap-4">
      <span className="material-symbols-outlined text-6xl text-stone-300">search_off</span>
      <h2 className="text-3xl font-serif">Product Not Found</h2>
      <button onClick={() => navigate('/products')} className="text-amber-600 underline font-sans text-sm">
        Return to Gallery
      </button>
    </div>
  );

  // Related products (same category, excluding current)
  const related = allProducts
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 3);

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 md:px-10 max-w-7xl mx-auto">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 font-sans text-xs text-stone-400 uppercase tracking-widest mb-10">
        <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
        <span>·</span>
        <Link to="/products" className="hover:text-amber-600 transition-colors">Gallery</Link>
        <span>·</span>
        <span className="text-stone-600 dark:text-stone-400">{product.name}</span>
      </div>

      {/* ── Main Product Layout ── */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

        {/* Left – Photo viewer */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-[52%]"
        >
          <PhotoViewer images={product.images} driveFolderId={product.driveFolderId} />
        </motion.div>

        {/* Right – Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full lg:w-[48%] flex flex-col lg:pt-4"
        >
          {/* Category + name */}
          <p className="font-sans text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2">
            {product.category}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-stone-900 dark:text-stone-50 leading-tight mb-4">
            {product.name}
          </h1>
          <p className="font-sans text-3xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
            {product.price}
          </p>

          {/* Description */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-6 mb-6">
            <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed text-[15px]">
              {product.description || 'Every piece is carefully handcrafted in our studio. Slight variations in colour, texture and pattern are inherent to artisanal work — ensuring your piece is truly singular.'}
            </p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { icon: 'category', label: 'Category', value: product.category },
              { icon: 'texture', label: 'Material', value: product.material },
              { icon: 'straighten', label: 'Size', value: product.size },
              { icon: 'palette', label: 'Colour', value: product.color },
            ].filter(s => s.value).map(spec => (
              <div key={spec.label} className="bg-stone-100 dark:bg-stone-900 rounded-xl px-4 py-3">
                <p className="font-sans text-[9px] uppercase tracking-widest text-stone-400 mb-0.5">{spec.label}</p>
                <p className="font-sans text-sm font-medium text-stone-800 dark:text-stone-200">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* In stock badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className={`w-2 h-2 rounded-full ${product.inStock !== false ? 'bg-green-500' : 'bg-red-400'}`} />
            <span className="font-sans text-xs text-stone-500 dark:text-stone-500 uppercase tracking-widest">
              {product.inStock !== false ? 'In Stock — Ready to Ship' : 'Currently Out of Stock'}
            </span>
          </div>

          {/* CTA */}
          <div className="flex gap-3 mb-8">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 py-4 font-sans uppercase tracking-widest text-xs font-bold hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors rounded-lg"
            >
              Add to Cart
            </button>
            <button
              onClick={toggleFav}
              disabled={favLoading}
              className={`w-14 border rounded-lg flex items-center justify-center transition-colors ${isFav
                ? 'border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                : 'border-stone-300 dark:border-stone-700 text-stone-400 hover:border-amber-500 hover:text-amber-600'
                }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <span className={`material-symbols-outlined text-[20px] ${isFav ? 'fill-current' : ''}`}>
                {isFav ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          </div>

          {/* Admin edit */}
          {isAdmin && (
            <Link
              to={`/admin/edit/${id}`}
              className="flex items-center gap-2 mb-6 p-3 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-sans text-xs text-stone-600 dark:text-stone-300 hover:border-amber-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-amber-500">edit</span>
              <span>Admin: <strong>Edit this product</strong></span>
            </Link>
          )}

          {/* Commission CTA */}
          <Link
            to="/contact"
            className="flex items-center gap-3 mb-8 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl font-sans text-sm text-amber-800 dark:text-amber-400 hover:border-amber-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">brush</span>
            <span>Want a custom variation? <strong>Commission a piece →</strong></span>
          </Link>

          {/* Delivery info */}
          <div className="space-y-3 font-sans text-sm text-stone-500 dark:text-stone-500 border-t border-stone-200 dark:border-stone-800 pt-6">
            <p className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-stone-400">local_shipping</span>
              Ships across India · Delivery time depends on courier (typically 1-3 weeks)
            </p>
            <p className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-stone-400">verified</span>
              Handcrafted with non-toxic materials
            </p>
            <p className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-stone-400">autorenew</span>
              Each piece unique — slight variations expected
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Full Drive Folder Gallery ── */}
      <DriveFolderGallery folderId={product.driveFolderId} />

      {/* ── Reviews ── */}
      <ReviewsSection productId={id} />

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div className="mt-20 border-t border-stone-200 dark:border-stone-800 pt-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-1">You May Also Like</p>
              <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-50">More {product.category}</h2>
            </div>
            <Link to="/products" className="font-sans text-xs uppercase tracking-widest text-stone-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors border-b border-stone-300 dark:border-stone-700 pb-0.5">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((p, idx) => (
              <RelatedCard key={p._id} product={p} idx={idx} />
            ))}
          </div>
        </div>
      )}

      {/* ── Floating Scroll to Top Button ── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            aria-label="Scroll to top"
          >
            <span className="material-symbols-outlined text-[24px] group-hover:-translate-y-1 transition-transform duration-300">
              arrow_upward
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ProductDetails;
