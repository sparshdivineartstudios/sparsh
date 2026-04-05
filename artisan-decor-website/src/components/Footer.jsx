import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col md:flex-row justify-between gap-14">

        {/* Brand */}
        <div className="md:w-1/3">
          <Link to="/" className="text-2xl font-serif tracking-widest text-stone-900 dark:text-stone-50 mb-4 block">
            SPARSH
          </Link>
          <p className="font-sans text-xs uppercase tracking-widest text-amber-600 mb-4">Sparsh Divine Art Studio</p>
          <p className="font-sans text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            Handcrafted resin art, soy wax candles &amp; concrete antiques — made with love in Pune, India. Every piece is one of a kind.
          </p>
          <div className="flex gap-5 mt-6">
            {['Instagram', 'Pinterest', 'WhatsApp'].map((s, i) => (
              <a
                key={i}
                href="#"
                className="font-sans text-xs text-stone-400 hover:text-amber-600 uppercase tracking-widest transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-3 gap-10 md:w-2/3">
          <div>
            <h4 className="font-sans font-bold text-stone-900 dark:text-stone-50 uppercase tracking-widest text-xs mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-stone-500 hover:text-amber-600 font-sans text-sm transition-colors">Resin Art</Link></li>
              <li><Link to="/products" className="text-stone-500 hover:text-amber-600 font-sans text-sm transition-colors">Soy Wax Candles</Link></li>
              <li><Link to="/products" className="text-stone-500 hover:text-amber-600 font-sans text-sm transition-colors">Concrete Antiques</Link></li>
              <li><Link to="/products" className="text-stone-500 hover:text-amber-600 font-sans text-sm transition-colors">Custom Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-bold text-stone-900 dark:text-stone-50 uppercase tracking-widest text-xs mb-6">Studio</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-stone-500 hover:text-amber-600 font-sans text-sm transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="text-stone-500 hover:text-amber-600 font-sans text-sm transition-colors">Commission a Piece</Link></li>
              <li><Link to="/contact" className="text-stone-500 hover:text-amber-600 font-sans text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-bold text-stone-900 dark:text-stone-50 uppercase tracking-widest text-xs mb-6">Info</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-stone-500 hover:text-amber-600 font-sans text-sm transition-colors">Shipping Policy</Link></li>
              <li><Link to="/" className="text-stone-500 hover:text-amber-600 font-sans text-sm transition-colors">Care Instructions</Link></li>
              <li><Link to="/" className="text-stone-500 hover:text-amber-600 font-sans text-sm transition-colors">Returns &amp; Refunds</Link></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="border-t border-stone-200 dark:border-stone-800 py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-sans text-xs text-stone-400 uppercase tracking-widest">© 2026 Sparsh Divine Art Studio. All Rights Reserved.</p>
        <p className="font-sans text-xs text-stone-400">Made with ♥ in India</p>
      </div>
    </footer>
  );
};

export default Footer;
