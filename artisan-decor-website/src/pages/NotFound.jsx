import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollToTop from '../components/ScrollToTop';

const NotFound = () => {
  return (
    <>
      <ScrollToTop />
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center pt-20 pb-20 px-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600 dark:opacity-5 opacity-[0.02] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600 dark:opacity-5 opacity-[0.02] rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10 max-w-md"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="font-serif text-9xl md:text-[150px] text-amber-600 dark:text-amber-500 font-light leading-none">
              404
            </h1>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-stone-50 font-light mb-4"
          >
            Page Not Found
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-stone-600 dark:text-stone-400 text-lg mb-8"
          >
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </motion.p>

          {/* Decorative Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-8"
          />

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-amber-600/20"
            >
              Back to Home
            </Link>
            <Link
              to="/products"
              className="inline-block border-2 border-amber-600 text-amber-600 hover:bg-amber-600/5 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
            >
              Browse Gallery
            </Link>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800"
          >
            <p className="text-stone-600 dark:text-stone-400 text-sm mb-4">
              Need more help?
            </p>
            <Link
              to="/contact"
              className="text-amber-600 hover:text-amber-700 dark:hover:text-amber-500 font-semibold transition-colors"
            >
              Contact our team
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
};

export default NotFound;
