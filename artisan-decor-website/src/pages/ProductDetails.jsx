import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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
      className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all duration-200 ${
        active
          ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-950 scale-105'
          : 'opacity-60 hover:opacity-100'
      }`}
    >
      <img
        src={err ? '/img-resin-tray.png' : driveThumbnail(url, 'w200')}
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
    : '/img-resin-tray.png';

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

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative aspect-[4/5] bg-stone-100 dark:bg-stone-900 rounded-2xl overflow-hidden cursor-zoom-in shadow-lg group"
        onClick={() => setLightboxOpen(true)}
      >
        <motion.img
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
          src={err ? '/img-resin-tray.png' : driveThumbnail(p.images?.[0], 'w500')}
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
   Main ProductDetails page
   ───────────────────────────────────────────── */
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://home-8zob.onrender.com/api/products')
      .then(res => {
        const data = res.data || [];
        setAllProducts(data);
        setProduct(data.find(p => p._id === id) || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

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
            <button className="flex-1 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 py-4 font-sans uppercase tracking-widest text-xs font-bold hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors rounded-lg">
              Add to Cart
            </button>
            <button className="w-14 border border-stone-300 dark:border-stone-700 rounded-lg flex items-center justify-center hover:border-amber-500 hover:text-amber-600 transition-colors text-stone-400">
              <span className="material-symbols-outlined text-[20px]">favorite</span>
            </button>
          </div>

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
              Ships across India · 5–7 business days
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
    </main>
  );
};

export default ProductDetails;
