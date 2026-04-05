import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Extract Drive file ID from a Drive URL
   Supports: uc?id=FILE_ID and /file/d/FILE_ID/
   ───────────────────────────────────────────── */
function getDriveFileId(url = '') {
  const ucMatch = url.match(/[?&]id=([^&]+)/);
  if (ucMatch) return ucMatch[1];
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) return fileMatch[1];
  return null;
}

/* ─────────────────────────────────────────────
   Convert Drive URL → thumbnail URL
   sz=w600 gives a good-quality 600px-wide image
   ───────────────────────────────────────────── */
function driveThumbnail(url = '', size = 'w600') {
  const id = getDriveFileId(url);
  if (!id) return url;
  return `https://drive.google.com/thumbnail?id=${id}&sz=${size}`;
}

/* ─────────────────────────────────────────────
   Single Product Card
   ───────────────────────────────────────────── */
const ProductCard = ({ product, idx }) => {
  const [imgError, setImgError] = useState(false);

  const rawSrc = product.images?.[0];
  // Use Drive thumbnail URL for reliable loading
  const imgSrc = rawSrc && !imgError
    ? driveThumbnail(rawSrc)
    : 'https://sparshdivineartstudios.github.io/sparsh/img-resin-tray.png';

  // Category badge colour
  const badgeColor = {
    'Resin Art': 'bg-teal-900/80 text-teal-300',
    'Wax Candles': 'bg-amber-900/80 text-amber-300',
    'Concrete Decor': 'bg-stone-700/80 text-stone-300',
  }[product.category] || 'bg-stone-700/80 text-stone-300';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: (idx % 6) * 0.07 }}
      className="group cursor-pointer flex flex-col"
    >
      <Link
        to={`/products/${product._id}`}
        className="block relative overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-900 mb-4 aspect-[4/5] shadow-sm group-hover:shadow-lg transition-shadow duration-300"
      >
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`${badgeColor} font-sans text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm`}>
            {product.category}
          </span>
        </div>

        {/* Multiple photos indicator */}
        {product.images?.length > 1 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-stone-900/70 text-stone-300 text-[9px] font-sans font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
            <span className="material-symbols-outlined text-[12px]">photo_library</span>
            {product.images.length}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-x-0 bottom-0 py-5 bg-gradient-to-t from-black/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
          <span className="font-sans text-white text-xs font-semibold tracking-widest uppercase">View Details →</span>
        </div>

        {/* Out of stock overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
            <span className="bg-stone-900 text-stone-300 font-sans text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border border-stone-600">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      <div className="flex justify-between items-start px-1">
        <div>
          <Link to={`/products/${product._id}`}>
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-50 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>
          <p className="font-sans text-[10px] text-stone-500 dark:text-stone-500 uppercase tracking-widest mt-1">
            {product.material && `${product.material} · `}{product.size || product.category}
          </p>
        </div>
        <p className="font-sans font-semibold text-stone-900 dark:text-stone-100 whitespace-nowrap ml-2">
          {product.price}
        </p>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Filter Pill Button
   ───────────────────────────────────────────── */
const FilterPill = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-sans text-xs font-semibold uppercase tracking-widest transition-all duration-200 border ${active
        ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 border-stone-900 dark:border-amber-500 shadow-md'
        : 'bg-transparent text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700 hover:border-stone-500 dark:hover:border-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
      }`}
  >
    {label}
    <span className={`text-[10px] font-bold ${active ? 'opacity-70' : 'opacity-50'}`}>
      {count}
    </span>
  </button>
);

/* ─────────────────────────────────────────────
   Sort Select
   ───────────────────────────────────────────── */
const SortSelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="font-sans text-xs uppercase tracking-widest bg-transparent border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 px-4 py-2 rounded-full cursor-pointer focus:outline-none focus:border-amber-500 transition-colors"
  >
    <option value="default">Sort: Default</option>
    <option value="price-asc">Price: Low → High</option>
    <option value="price-desc">Price: High → Low</option>
    <option value="name-asc">Name: A → Z</option>
  </select>
);

/* ─────────────────────────────────────────────
   Main Products Page
   ───────────────────────────────────────────── */
const CATEGORIES = ['All', 'Resin Art', 'Wax Candles', 'Concrete Decor'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('https://home-8zob.onrender.com/api/products')
      .then(res => setProducts(res.data || []))
      .catch(err => console.error('Error fetching products:', err))
      .finally(() => setLoading(false));
  }, []);

  // Count per category
  const counts = useMemo(() => {
    const all = products.length;
    const cat = {};
    CATEGORIES.slice(1).forEach(c => {
      cat[c] = products.filter(p => p.category === c).length;
    });
    return { All: all, ...cat };
  }, [products]);

  // Filtered + sorted products
  const displayed = useMemo(() => {
    let list = [...products];
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    // Category filter
    if (activeFilter !== 'All') {
      list = list.filter(p => p.category === activeFilter);
    }
    // Sort
    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0)); break;
      case 'price-desc': list.sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0)); break;
      case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return list;
  }, [products, activeFilter, sortBy, searchQuery]);

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 md:px-10 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="mb-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-sans text-amber-600 dark:text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3"
        >
          Curated Catalog
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-5xl md:text-6xl font-semibold text-stone-900 dark:text-stone-50"
        >
          The Gallery
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-sans text-stone-500 dark:text-stone-400 mt-4 text-sm max-w-md mx-auto leading-relaxed"
        >
          Every piece is made by hand. No two are identical.
        </motion.p>
      </div>

      {/* ── Filter + Search Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        {/* Search */}
        <div className="relative max-w-sm mx-auto mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search pieces..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-sans text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Category filter chips + sort */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <FilterPill
                key={cat}
                label={cat}
                active={activeFilter === cat}
                count={counts[cat] ?? 0}
                onClick={() => setActiveFilter(cat)}
              />
            ))}
          </div>
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>
      </motion.div>

      {/* ── Results count ── */}
      <div className="mb-6 flex items-center justify-between">
        <p className="font-sans text-sm text-stone-500 dark:text-stone-500">
          {loading ? 'Loading…' : `${displayed.length} piece${displayed.length !== 1 ? 's' : ''} found`}
        </p>
        {(activeFilter !== 'All' || searchQuery) && (
          <button
            onClick={() => { setActiveFilter('All'); setSearchQuery(''); setSortBy('default'); }}
            className="font-sans text-xs text-amber-600 hover:text-amber-700 dark:text-amber-500 underline underline-offset-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-stone-200 dark:bg-stone-800 rounded-xl mb-4" />
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && displayed.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-24 text-center"
        >
          <span className="material-symbols-outlined text-6xl text-stone-300 dark:text-stone-700 block mb-4">search_off</span>
          <p className="font-serif text-2xl text-stone-400 dark:text-stone-600 mb-2">No pieces found</p>
          <p className="font-sans text-sm text-stone-400">Try a different filter or search term.</p>
          <button
            onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
            className="mt-6 font-sans text-xs uppercase tracking-widest text-amber-600 border border-amber-600 px-5 py-2 rounded-full hover:bg-amber-600 hover:text-white transition-colors"
          >
            Show all pieces
          </button>
        </motion.div>
      )}

      {/* ── Product Grid ── */}
      {!loading && displayed.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {displayed.map((product, idx) => (
              <ProductCard key={product._id} product={product} idx={idx} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
};

export default Products;
