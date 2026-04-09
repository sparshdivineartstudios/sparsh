import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MagneticButton from '../components/MagneticButton';
import { API_URL } from '../utils/apiConfig';
import FeaturedReviews from '../components/FeaturedReviews';
import Newsletter from '../components/Newsletter';

/* ─── Drive URL → reliable thumbnail URL ─── */
function getDriveFileId(url = '') {
  const m = url.match(/[?&]id=([^&]+)/);
  return m ? m[1] : null;
}
function driveThumbnail(url = '', size = 'w600') {
  const id = getDriveFileId(url);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=${size}` : url;
}

/* ─── Marquee Strip ─── */
const Marquee = () => {
  const items = [
    'Hand-Poured Resin Art',
    'Soy Wax Candles',
    'Concrete Antiques',
    'Custom Commissions',
    'Artisan Crafted',
    'Ships Across India',
  ];
  return (
    <div className="bg-stone-900 dark:bg-amber-600 overflow-hidden py-4 border-y border-stone-800">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, idx) => (
          <span key={idx} className="inline-flex items-center mx-8 text-stone-100 font-sans text-xs uppercase tracking-[0.3em] font-semibold">
            {item}
            <span className="mx-8 text-amber-500 dark:text-stone-900">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Featured Product Card ─── */
const ProductCard = ({ product, idx }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const rawSrc = product.images?.[0];
  const imgSrc = rawSrc && !imgErr
    ? driveThumbnail(rawSrc, 'w600')
    : 'https://sparshdivineartstudio.me/img-resin-tray.png';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: idx * 0.15 }}
      className="group"
    >
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-900 aspect-[3/4] mb-4 shadow-md">
          {/* Skeleton shimmer while loading */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800 animate-pulse" />
          )}
          <img
            src={imgSrc}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgErr(true); setImgLoaded(true); }}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <span className="text-white font-sans text-xs uppercase tracking-widest font-semibold">View Details →</span>
          </div>
        </div>
        <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-50 group-hover:text-amber-600 transition-colors">{product.name}</h3>
        <p className="font-sans text-sm font-semibold text-amber-600 dark:text-amber-500 mt-1">{product.price}</p>
      </Link>
    </motion.div>
  );
};

/* ─── Skeleton card for loading state ─── */
const SkeletonCard = ({ idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: idx * 0.1 }}
  >
    <div className="aspect-[3/4] rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse mb-4" />
    <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded animate-pulse w-3/4 mb-2" />
    <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded animate-pulse w-1/3" />
  </motion.div>
);

/* ─── Main Home Component ─── */
const Home = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroTextY = useTransform(scrollY, [0, 400], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  const aboutRef = useRef(null);
  const { scrollYProgress: aboutProgress } = useScroll({ target: aboutRef, offset: ['start end', 'end start'] });
  const aboutImgY = useTransform(aboutProgress, [0, 1], ['-12%', '12%']);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/products`)
      .then(res => {
        const data = res.data || [];
        setAllProducts(data);
        setFeaturedProducts(data.slice(0, 3));
      })
      .catch(() => { })
      .finally(() => setProductsLoading(false));
  }, []);

  useEffect(() => {
    axios.get(`${API_URL}/api/reviews`, { params: { page: 1, limit: 6, sort: 'newest' } })
      .then(res => {
        // Handle paginated response
        const reviewsData = res.data.reviews || res.data || [];
        setReviews(reviewsData);
      })
      .catch(() => { });
  }, []);

  // Pick first product image per category for the category cards
  const catImgs = {
    'Resin Art': 'https://sparshdivineartstudio.me/img-resin-wall.png',
    'Wax Candles': 'https://sparshdivineartstudio.me/img-candle-set.png',
    'Concrete Decor': 'https://sparshdivineartstudio.me/img-coasters.png',
  };
  // const catImgs = {
  //   'Resin Art': driveThumbnail(allProducts.find(p => p.category === 'Resin Art')?.images?.[0], 'w800') || catImgFallbacks['Resin Art'],
  //   'Wax Candles': driveThumbnail(allProducts.find(p => p.category === 'Wax Candles')?.images?.[0], 'w800') || catImgFallbacks['Wax Candles'],
  //   'Concrete Decor': driveThumbnail(allProducts.find(p => p.category === 'Concrete Decor')?.images?.[0], 'w800') || catImgFallbacks['Concrete Decor'],
  // };

  // Instagram grid: first 4 product images
  const gridImages = allProducts
    .filter(p => p.images?.[0])
    .slice(0, 4)
    .map(p => ({ url: driveThumbnail(p.images[0], 'w400'), id: p._id }));

  return (
    <main className="bg-stone-50 dark:bg-stone-950 transition-colors duration-500 overflow-x-hidden">

      {/* ── 1. HERO ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <picture style={{ display: 'contents' }}>
            {/* Desktop: wide landscape shot with all 3 products in frame */}
            <source
              media="(min-width: 768px)"
              srcSet="https://sparshdivineartstudio.me/img-hero-desktop.png"
            />
            {/* Mobile: portrait lifestyle shot */}
            <img
              src="https://sparshdivineartstudio.me/img-hero-bg.png"
              alt="Sparsh Divine Art Studio — Resin Art, Soy Candles & Concrete Antiques"
              fetchPriority="high"
              className="w-full h-full object-cover object-center"
            />
          </picture>
          <div className="absolute inset-0 bg-stone-900/50"></div>
        </motion.div>

        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.35em' }}
            transition={{ duration: 1.2 }}
            className="font-sans text-amber-400 uppercase text-xs font-semibold mb-6 tracking-[0.3em]"
          >
            Sparsh Divine Art Studio · Handmade in India
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.9] mb-6"
          >
            Art you can<br />
            <span className="italic text-amber-400">touch & feel.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-sans text-white/70 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Handcrafted resin art, soy wax candles &amp; concrete antiques — each piece a one-of-a-kind story born from pure human touch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MagneticButton>
              <Link
                to="/products"
                className="inline-block bg-amber-500 hover:bg-amber-400 text-stone-900 px-10 py-4 font-sans uppercase tracking-widest text-xs font-bold transition-colors duration-300 rounded-sm"
              >
                Shop the Collection
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to="/about"
                className="inline-block border border-white/60 hover:border-white text-white px-10 py-4 font-sans uppercase tracking-widest text-xs font-semibold transition-colors duration-300 rounded-sm"
              >
                Our Story
              </Link>
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 gap-2"
        >
          <span className="font-sans text-[10px] uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-10 bg-white/30"
          ></motion.div>
        </motion.div>
      </section>

      {/* ── 2. MARQUEE STRIP ── */}
      <Marquee />

      {/* ── 3. PRODUCT CATEGORIES ── */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-amber-600 dark:text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3"
          >
            What We Make
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-stone-50"
          >
            Three Crafts, One Soul
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Resin Art',
              subtitle: 'Fluid · Luminous · Eternal',
              desc: 'Each resin piece is poured by hand — pigments swirled through liquid glass, frozen mid-flow into abstract landscapes. No two pieces are ever alike.',
              img: catImgs['Resin Art'] || catImgFallbacks['Resin Art'],
              badge: 'Best Seller',
            },
            {
              title: 'Wax Candles',
              subtitle: 'Warm · Aromatic · Mindful',
              desc: 'Hand-poured soy wax candles in concrete vessels, infused with essential oils. Light one and let the room breathe. Perfect for gifting or keeping.',
              img: catImgs['Wax Candles'] || catImgFallbacks['Wax Candles'],
              badge: 'Fan Favourite',
            },
            {
              title: 'Concrete Decor',
              subtitle: 'Raw · Bold · Timeless',
              desc: 'Sculptural concrete pieces with golden detailing — vases, trays, coasters, and bookends that bring brutalist beauty into everyday living.',
              img: catImgs['Concrete Decor'] || catImgFallbacks['Concrete Decor'],
              badge: 'New Arrivals',
            },
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
            >
              <Link to={`/products?category=${encodeURIComponent(cat.title)}`}>
                <div className="relative h-[480px] overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-500 text-stone-900 font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {cat.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="font-sans text-amber-400 text-xs uppercase tracking-widest mb-2">{cat.subtitle}</p>
                    <h3 className="font-serif text-3xl text-white mb-3 group-hover:text-amber-400 transition-colors">{cat.title}</h3>
                    <p className="font-sans text-stone-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {cat.desc}
                    </p>
                    <span className="inline-flex items-center gap-2 text-amber-400 font-sans text-xs uppercase tracking-widest font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4. FEATURED PRODUCTS ── */}
      <section className="py-24 px-8 max-w-7xl mx-auto bg-stone-100/50 dark:bg-stone-900/30 rounded-3xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-sans text-amber-600 dark:text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3"
            >
              Curated for You
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-stone-50"
            >
              Featured Pieces
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Link to="/products" className="font-sans text-sm text-stone-500 hover:text-amber-600 transition-colors uppercase tracking-widest border-b border-stone-300 dark:border-stone-700 pb-1">
              View All →
            </Link>
          </motion.div>
        </div>

        {productsLoading ? (
          /* Skeleton while API loads */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[0, 1, 2].map(i => <SkeletonCard key={i} idx={i} />)}
          </div>
        ) : featuredProducts.length > 0 ? (
          /* Real API products */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredProducts.map((product, idx) => (
              <ProductCard key={product._id} product={product} idx={idx} />
            ))}
          </div>
        ) : (
          /* Fallback: local generated images if API fails */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { img: 'https://sparshdivineartstudio.me/img-resin-tray.png', name: 'Obsidian Resin Tray', price: '₹2,499', tag: 'Resin Art' },
              { img: 'https://sparshdivineartstudio.me/img-candle.png', name: 'Amber Soy Pillar Candle', price: '₹1,299', tag: 'Wax Candle' },
              { img: 'https://sparshdivineartstudio.me/img-concrete-vase.png', name: 'Brutalist Concrete Vase', price: '₹3,799', tag: 'Concrete Antique' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group"
              >
                <Link to="/products">
                  <div className="relative overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-900 aspect-[3/4] mb-4 shadow-md">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-stone-900/80 text-amber-400 font-sans text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {item.tag}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white font-sans text-xs uppercase tracking-widest font-semibold">Explore Gallery →</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-50 group-hover:text-amber-600 transition-colors">{item.name}</h3>
                  <p className="font-sans text-sm font-semibold text-amber-600 dark:text-amber-500 mt-1">{item.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── 4a. FEATURED REVIEWS CAROUSEL ── */}
      <FeaturedReviews />

      {/* ── 5. FULL-WIDTH PARALLAX STORY SECTION ── */}
      <section ref={aboutRef} className="relative flex flex-col md:flex-row min-h-[600px] overflow-hidden mt-0">
        <div className="w-full md:w-1/2 relative h-[400px] md:h-auto overflow-hidden">
          <motion.img
            style={{ y: aboutImgY }}
            src="https://sparshdivineartstudio.me/img-studio.png"
            alt="Artist at Work"
            className="absolute inset-0 w-full h-[130%] object-cover object-center"
          />
        </div>
        <div className="w-full md:w-1/2 bg-stone-900 dark:bg-stone-950 px-12 md:px-20 py-20 flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-sans text-amber-500 uppercase tracking-widest text-xs font-semibold mb-4"
          >
            Born in a Studio, Made for Your Home
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-white leading-snug mb-8"
          >
            Every flaw is a<br /><span className="italic text-amber-400">signature.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-sans text-stone-400 leading-relaxed text-base mb-6"
          >
            At Sparsh Divine Art Studio, we pour our entire selves into each creation. Our resin pieces capture the wild beauty of colour in motion. Our candles hold the warmth of intention. Our concrete antiques carry the quiet strength of raw earth — refined with golden touches.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="font-sans text-stone-500 leading-relaxed text-sm mb-10 italic"
          >
            No two pieces leave our studio looking the same. That is not a flaw — it is the entire point.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-3 text-amber-400 hover:text-amber-300 font-sans text-sm uppercase tracking-widest font-semibold transition-colors group"
            >
              Read Our Full Story
              <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 6. HOW IT'S MADE PROCESS ── */}
      <section className="py-28 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-amber-600 uppercase tracking-widest text-xs font-semibold mb-3"
          >
            The Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-stone-50"
          >
            From Raw Material to Heirloom
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              num: '01',
              title: 'Source & Envision',
              icon: 'eco',
              desc: 'We carefully source non-toxic resin, natural soy wax, and premium concrete. Each batch begins with a mood — a feeling we want to capture before the first drop is poured.',
            },
            {
              num: '02',
              title: 'Pour & Shape by Hand',
              icon: 'water_drop',
              desc: 'Every piece is poured, sculpted, or cast by hand — no machines, no moulds en masse. We manipulate pigments while they flow freely, letting the material guide us.',
            },
            {
              num: '03',
              title: 'Cure, Polish & Deliver',
              icon: 'local_shipping',
              desc: 'Each piece cures at its own pace. We sand, polish, and finish with golden accents before wrapping it with care — ready to find its forever home.',
            },
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group p-8 border border-stone-200 dark:border-stone-800 rounded-2xl hover:border-amber-500 dark:hover:border-amber-600 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="font-serif text-4xl text-amber-500/40 dark:text-amber-600/40 font-bold leading-none">{step.num}</span>
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 text-3xl">{step.icon}</span>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-stone-900 dark:text-stone-50 mb-4 group-hover:text-amber-600 transition-colors">{step.title}</h3>
              <p className="font-sans text-stone-500 dark:text-stone-400 leading-relaxed text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 7. WHY CHOOSE US ── */}
      <section className="py-20 px-8 bg-stone-900 dark:bg-stone-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-sans text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3"
            >
              The Sparsh Promise
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl text-white"
            >
              Why Artisans & Collectors Choose Us
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'handshake', title: '100% Handmade', desc: 'Every single piece is hand-poured, hand-shaped, or hand-cast. We do not use factories or machines.' },
              { icon: 'fingerprint', title: 'Truly One-of-a-Kind', desc: 'You own the only one. We cannot replicate our pieces — even if we tried, nature won\'t allow it.' },
              { icon: 'local_shipping', title: 'Safe Delivery Pan-India', desc: 'Fragile art deserves careful packaging. We triple-wrap everything and deliver across India.' },
              { icon: 'palette', title: 'Custom Commissions', desc: 'Tell us your vision — colours, size, scent. We will bring your personal piece to life.' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5">
                  <span className="material-symbols-outlined text-amber-500 text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-serif text-xl text-white mb-3">{item.title}</h3>
                <p className="font-sans text-stone-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. STATS BANNER ── */}
      <section className="bg-amber-600 dark:bg-amber-700 py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '150+', label: 'Pieces Crafted' },
            { stat: '100%', label: 'Non-toxic Materials' },
            { stat: '3', label: 'Art Forms Mastered' },
            { stat: '30+', label: 'Happy Customers' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <p className="font-serif text-5xl font-bold text-white mb-2">{item.stat}</p>
              <p className="font-sans text-amber-100 text-sm uppercase tracking-widest font-semibold">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 9. INSTAGRAM / VISUAL GRID ── */}
      <section className="py-16 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-amber-600 dark:text-amber-500 uppercase tracking-widest text-xs font-semibold mb-2"
          >
            @sparshdivineartstudio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl text-stone-900 dark:text-stone-50"
          >
            Follow the Studio
          </motion.h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(gridImages.length > 0 ? gridImages : [
            { url: 'https://sparshdivineartstudio.me/img-resin-tray.png', id: null },
            { url: 'https://sparshdivineartstudio.me/img-candle.png', id: null },
            { url: 'https://sparshdivineartstudio.me/img-coasters.png', id: null },
            { url: 'https://sparshdivineartstudio.me/img-concrete-vase.png', id: null },
          ]).map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer"
            >
              {item.id ? (
                <Link to={`/products/${item.id}`}>
                  <img src={item.url} alt="Studio Work" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-all duration-300 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">open_in_new</span>
                  </div>
                </Link>
              ) : (
                <img src={item.url} alt="Studio Work" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 10. COMMUNITY REVIEWS FEED (DYNAMIC) ── */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-amber-600 dark:text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3"
          >
            Community
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-stone-50"
          >
            From Our Collectors
          </motion.h2>
        </div>
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review, idx) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all duration-300"
              >
                <div>
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className={`text-base ${s <= review.rating ? 'text-amber-500' : 'text-stone-200 dark:text-stone-700'}`}>★</span>
                    ))}
                  </div>
                  {review.title && (
                    <p className="font-serif text-base font-semibold text-stone-900 dark:text-stone-50 mb-2">{review.title}</p>
                  )}
                  <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed text-sm italic mb-5">"{review.comment}"</p>
                </div>
                <div className="border-t border-stone-100 dark:border-stone-800 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <span className="font-serif text-amber-600 text-sm font-bold">{review.user?.name?.[0]?.toUpperCase() || '?'}</span>
                    </div>
                    <div>
                      <p className="font-serif text-stone-900 dark:text-stone-50 text-sm font-semibold">{review.user?.name || 'Collector'}</p>
                      <p className="font-sans text-[10px] text-stone-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  {review.product && (
                    <Link
                      to={`/products/${review.product._id}`}
                      className="text-amber-600 dark:text-amber-500 font-sans text-[10px] uppercase tracking-widest hover:underline"
                    >
                      {review.product.name?.split(' ').slice(0, 2).join(' ') || 'View'} →
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-stone-300 dark:text-stone-700 block mb-4">rate_review</span>
            <p className="font-serif text-2xl text-stone-400 dark:text-stone-600 mb-2">No reviews yet</p>
            <p className="font-sans text-stone-500 dark:text-stone-400">Be the first to share your experience with one of our pieces!</p>
          </div>
        )}
      </section>

      {/* ── 11. NEWSLETTER ── */}
      <Newsletter />

      {/* ── 12. CTA SECTION ── */}
      <section className="py-32 px-8 text-center max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-5xl md:text-6xl text-stone-900 dark:text-stone-50 mb-8"
        >
          Ready to own something<br /><span className="italic text-amber-600">made just for you?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-sans text-stone-500 dark:text-stone-400 mb-12 text-lg leading-relaxed"
        >
          Browse our full collection of resin art, soy wax candles, and concrete antiques — or reach out for a custom commission made entirely around you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <MagneticButton>
            <Link
              to="/products"
              className="inline-block bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 px-10 py-4 font-sans uppercase tracking-widest text-xs font-bold hover:bg-amber-600 hover:text-white transition-colors rounded-sm"
            >
              Shop the Collection
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link
              to="/contact"
              className="inline-block border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 px-10 py-4 font-sans uppercase tracking-widest text-xs font-semibold hover:border-amber-600 hover:text-amber-600 transition-colors rounded-sm"
            >
              Commission a Piece
            </Link>
          </MagneticButton>
        </motion.div>
      </section>

    </main>
  );
};

export default Home;
