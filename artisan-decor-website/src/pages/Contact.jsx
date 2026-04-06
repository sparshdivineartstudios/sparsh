import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-7xl mx-auto">
      <div className="mb-16 border-b border-stone-200 dark:border-stone-800 pb-8 text-center">
        <p className="font-sans text-amber-600 uppercase tracking-widest text-sm font-semibold mb-4">Get in Touch</p>
        <h1 className="font-serif text-5xl font-semibold text-stone-900 dark:text-stone-50 mb-4">
          Let's Create Something Together
        </h1>
        <p className="font-sans text-stone-500 dark:text-stone-400 max-w-xl mx-auto text-sm leading-relaxed">
          Whether you have a custom commission in mind, a question about an existing piece, or just want to say hello — we would love to hear from you.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-16 items-start mt-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/3 space-y-10"
        >
          <div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-50 mb-3">Studio Location</h3>
            <p className="font-sans text-stone-500 text-sm mb-1">Sparsh Divine Art Studio</p>
            <p className="font-sans text-stone-500 text-sm mb-1">Ahmedabad, Gujrat, India</p>
            <p className="font-sans text-amber-600 text-sm mt-3 italic">Studio visits by appointment only — DM us on Instagram to book.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-50 mb-3">Reach Us Directly</h3>
            <p className="font-sans text-stone-500 text-sm mb-1">✉ sparshdivineartstudio@gmail.com</p>
            <p className="font-sans text-stone-500 text-sm">☏ +91 8160901481</p>
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-50 mb-3">Response Time</h3>
            <p className="font-sans text-stone-500 text-sm leading-relaxed">
              We respond to all enquiries within 24–48 hours. For custom commissions, please allow 2–3 business days for a detailed quote.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-50 mb-3">Follow the Studio</h3>
            <div className="flex gap-4">
              {[
                { name: 'Instagram', url: 'https://www.instagram.com/_sparsh_divine_art_studio_' }
                // ,{ name: 'Pinterest', url: 'https://pinterest.com/sparshdivineartstudio' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs text-stone-500 hover:text-amber-600 uppercase tracking-widest transition-colors border-b border-stone-300 dark:border-stone-700 pb-0.5"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-2/3 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-8 md:p-12"
        >
          <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-50 mb-8">Send an Enquiry</h2>
          <form className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Your Name</label>
                <input type="text" placeholder="e.g. Priya Sharma" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all text-stone-900 dark:text-stone-50 placeholder:text-stone-400" />
              </div>
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Email Address</label>
                <input type="email" placeholder="your@email.com" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all text-stone-900 dark:text-stone-50 placeholder:text-stone-400" />
              </div>
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">What are you interested in?</label>
              <select className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-all text-stone-600 dark:text-stone-400">
                <option value="">Select a category</option>
                <option value="resin">Resin Art</option>
                <option value="candle">Soy Wax Candles</option>
                <option value="concrete">Concrete Antiques</option>
                <option value="custom">Custom Commission</option>
                <option value="other">Something Else</option>
              </select>
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Your Message</label>
              <textarea rows="5" placeholder="Tell us what you have in mind — the more detail the better for commissions." className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all text-stone-900 dark:text-stone-50 resize-none placeholder:text-stone-400"></textarea>
            </div>
            <button className="bg-amber-500 hover:bg-amber-400 text-stone-900 px-10 py-4 uppercase tracking-widest text-xs font-bold transition-colors rounded-sm">
              Send Enquiry
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

export default Contact;
