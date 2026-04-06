import React from 'react';
import { motion } from 'framer-motion';

const ShippingPolicy = () => {
  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-4xl mx-auto">
      <div className="mb-16 border-b border-stone-200 dark:border-stone-800 pb-8">
        <p className="font-sans text-amber-600 uppercase tracking-widest text-sm font-semibold mb-4">How it works</p>
        <h1 className="font-serif text-5xl font-semibold text-stone-900 dark:text-stone-50 mb-4">
          Shipping
        </h1>
        <p className="font-sans text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          We hand-pack every order with lots of care from our studio in Ahmedabad. Here's what to expect.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10"
      >
        <section>
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-50 mb-4">How We Ship</h2>
          <div className="space-y-4">
            <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed">
              Once you order, we pack it up carefully and send it through India Post or courier services. We ship within 3-5 days of order confirmation. Delivery time after that depends on the courier — usually 1-3 weeks depending on your location and their schedule.
            </p>
            <ul className="space-y-2 font-sans text-stone-600 dark:text-stone-400 text-sm">
              <li>• <strong>Standard Shipping:</strong> ₹150-300 (through India Post)</li>
              <li>• <strong>Courier Shipping:</strong> ₹400-600 (typically faster)</li>
            </ul>
            <p className="font-sans text-stone-600 dark:text-stone-400 text-sm mt-4 italic">
              We'll send you a tracking number so you can keep an eye on your package! Exact delivery time depends on the courier and your location.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-50 mb-4">Packaging</h2>
          <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed">
            We wrap everything carefully in bubble wrap and pack it like we're sending it to a friend. Fragile pieces get extra padding. We want your order to arrive safe and sound.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-50 mb-4">Custom Orders & Large Pieces</h2>
          <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed">
            For custom commissions or large items, shipping costs are different. Just reach out and we'll let you know the exact cost before we confirm your order.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-50 mb-4">Something Arrives Damaged?</h2>
          <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed">
            We're really sorry if that happens. Just send us photos within 48 hours and we'll either send you a new one or figure it out with the courier. We take care of our customers!
          </p>
        </section>

        <div className="mt-12 p-8 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
          <p className="font-sans text-sm text-stone-600 dark:text-stone-400">
            <strong>Questions?</strong> Just reach out to us at <a href="mailto:sparshdivineartstudio@gmail.com" className="text-amber-600 hover:underline">sparshdivineartstudio@gmail.com</a> or call +91 8160901481. We're happy to help!
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default ShippingPolicy;
