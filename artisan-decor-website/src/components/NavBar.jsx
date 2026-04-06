import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const NavBar = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const isDarkMode = theme === 'dark';
  const [scrolled, setScrolled] = useState(false);
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

  const iconClass = heroMode
    ? 'text-white/80 hover:text-white'
    : 'text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
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

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-10">
          {['/', '/products', '/about', '/contact'].map((path, idx) => {
            const labels = ['Home', 'Gallery', 'Story', 'Contact'];
            const isActive = location.pathname === path || (path === '/products' && location.pathname.startsWith('/products'));
            return (
              <Link
                key={path}
                to={path}
                className={`font-sans tracking-widest uppercase text-xs transition-colors duration-300 font-medium ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400'
                    : heroMode
                      ? 'text-white/75 hover:text-white'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-50'
                }`}
              >
                {labels[idx]}
              </Link>
            );
          })}
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-5">
          <button
            onClick={toggleTheme}
            className={`transition-colors flex items-center hover:text-amber-600 ${iconClass}`}
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
              <Link to="/favorites" className={`transition-colors hover:text-amber-600 ${iconClass}`}>
                <span className="material-symbols-outlined text-[20px]">favorite</span>
              </Link>
              <button onClick={logout} className={`transition-colors hover:text-amber-600 ${iconClass}`}>
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className={`transition-colors hover:text-amber-600 ${iconClass}`}>
              <span className="material-symbols-outlined text-[20px]">person</span>
            </Link>
          )}

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
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
