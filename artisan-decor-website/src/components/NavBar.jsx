import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const NavBar = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const isDarkMode = theme === 'dark';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Only the home page has a dark hero behind the nav
  const isHome = location.pathname === '/';
  // Use white-text transparent style only: on home page AND not yet scrolled
  const heroMode = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    // Reset on route change
    setScrolled(window.scrollY > 20);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      // Sidebar is open - disable scroll
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      // Sidebar is closed - enable scroll
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const iconClass = heroMode
    ? 'text-white/80 hover:text-white'
    : 'text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400';

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Gallery' },
    { path: '/about', label: 'Story' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        heroMode
          ? 'bg-transparent py-6'
          : 'bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md shadow-sm py-4 border-b border-stone-200/80 dark:border-stone-800/80'
      }`}>
        <div className="flex justify-between items-center w-full px-8 md:px-16 max-w-7xl mx-auto">

          {/* Logo */}
          <Link
            to="/"
            className={`text-2xl font-serif tracking-widest transition-colors duration-300 hover:text-amber-600 dark:hover:text-amber-500 ${
              heroMode ? 'text-white' : 'text-stone-900 dark:text-stone-50'
            }`}
          >
            SPARSH
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/products' && location.pathname.startsWith('/products'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-sans tracking-widest uppercase text-xs transition-colors duration-300 font-medium ${
                    isActive
                      ? 'text-amber-600 dark:text-amber-400'
                      : heroMode
                        ? 'text-white/75 hover:text-white'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              onClick={toggleTheme}
              className={`transition-colors flex items-center hover:text-amber-600 ${iconClass}`}
              title="Toggle theme"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/add"
                    title="Add Product"
                    className={`transition-colors hover:text-amber-600 ${iconClass}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  </Link>
                )}
                <Link to="/account" className={`transition-colors hover:text-amber-600 ${iconClass}`} title="Account">
                  <span className="material-symbols-outlined text-[20px]">account_circle</span>
                </Link>
                <Link to="/favorites" className={`transition-colors hover:text-amber-600 ${iconClass}`} title="Favorites">
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </Link>
                <Link to="/order-history" className={`transition-colors hover:text-amber-600 ${iconClass}`} title="Order History">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </Link>
                
                {/* Cart Icon - Only show when logged in */}
                <Link 
                  to="/cart" 
                  className={`relative transition-colors hover:text-amber-600 ${iconClass}`}
                  title="View Cart"
                >
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-stone-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>

                <button 
                  onClick={logout} 
                  className={`transition-colors hover:text-amber-600 ${iconClass}`}
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className={`transition-colors hover:text-amber-600 ${iconClass}`} title="Login">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </Link>
            )}
          </div>

          {/* Mobile: Only Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`transition-colors ${iconClass}`}
              title="Toggle menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              style={{ top: 0 }}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-screen w-64 bg-stone-50 dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 z-50 md:hidden flex flex-col"
            >
              {/* Sidebar Header with Close Button */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 dark:border-stone-800">
                <span className="text-sm font-serif text-stone-900 dark:text-stone-50">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors"
                  title="Close menu"
                >
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>
              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
                <div className="space-y-1">
                  {navLinks.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`block font-sans tracking-widest uppercase text-xs font-medium py-3 transition-colors ${
                          isActive
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Fixed footer actions */}
              <div className="border-t border-stone-200 dark:border-stone-800 px-6 py-6 space-y-3">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 font-sans text-sm text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors py-2 w-full"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isDarkMode ? 'light_mode' : 'dark_mode'}
                  </span>
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin/add"
                        className="flex items-center gap-3 font-sans text-sm text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors py-2"
                      >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        <span>Add Product</span>
                      </Link>
                    )}
                    <Link
                      to="/account"
                      className="flex items-center gap-3 font-sans text-sm text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors py-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">account_circle</span>
                      <span>Account</span>
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center gap-3 font-sans text-sm text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors py-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">favorite</span>
                      <span>Favorites</span>
                    </Link>
                    <Link
                      to="/order-history"
                      className="flex items-center gap-3 font-sans text-sm text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors py-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                      <span>Order History</span>
                    </Link>
                    <Link
                      to="/cart"
                      className="flex items-center gap-3 font-sans text-sm text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors py-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                      <span>Cart {cartItems.length > 0 && `(${cartItems.length})`}</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 font-sans text-sm text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors py-2 w-full"
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-3 font-sans text-sm text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors py-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">person</span>
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
