import React from 'react';
import { motion } from 'framer-motion';

const ReturnsRefunds = () => {
  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-4xl mx-auto">
      <div className="mb-16 border-b border-stone-200 dark:border-stone-800 pb-8">
        <p className="font-sans text-amber-600 uppercase tracking-widest text-sm font-semibold mb-4">Your peace of mind</p>
        <h1 className="font-serif text-5xl font-semibold text-stone-900 dark:text-stone-50 mb-4">
          Returns &amp; Refunds
        </h1>
        <p className="font-sans text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          We believe in standing behind our work. If something's not right, let's figure it out together.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10"
      >
        <section>
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-50 mb-4">Can You Return It?</h2>
          <div className="space-y-4">
            <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed">
              You can return items within <strong>14 days</strong> of getting them if they're:
            </p>
            <ul className="space-y-2 font-sans text-stone-600 dark:text-stone-400 text-sm">
              <li>✓ Unused and in good condition</li>
              <li>✓ Still in original packaging</li>
              <li>✓ NOT a custom order made just for you</li>
            </ul>
            <p className="font-sans text-sm text-amber-600 font-semibold mt-4">
              Custom pieces are non-returnable — they're made especially for you!
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-50 mb-4">How to Return Something</h2>
          <div className="space-y-4">
            <ol className="space-y-3 font-sans text-stone-600 dark:text-stone-400 text-sm">
              <li><strong>1. Get in Touch:</strong> Email us at sparshdivineartstudio@gmail.com with your order number and why you want to return it.</li>
              <li><strong>2. We'll Reply:</strong> We'll get back to you within 2 business days with instructions.</li>
              <li><strong>3. Ship It Back:</strong> Send the item back to us (costs are usually your responsibility).</li>
              <li><strong>4. We'll Check It:</strong> Once we receive it, we'll make sure it's in good condition.</li>
              <li><strong>5. Refund Time:</strong> We'll refund your money within 5-7 business days.</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-50 mb-4">Shipping Back</h2>
          <div className="space-y-4">
            <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed">
              You usually pay to ship it back. BUT if the item showed up damaged or we made a mistake, we'll cover it!
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-50 mb-4">Things We Can't Accept Back</h2>
          <ul className="space-y-2 font-sans text-stone-600 dark:text-stone-400 text-sm">
            <li>✗ Custom made-to-order pieces</li>
            <li>✗ Items that have been used</li>
            <li>✗ Burned candles</li>
            <li>✗ Items that look worn or damaged</li>
            <li>✗ Anything older than 14 days</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-50 mb-4">Arrived Broken?</h2>
          <div className="space-y-4">
            <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed">
              Tell us within 48 hours with photos and we'll sort it out — either send you a new one or refund you completely. No hassle!
            </p>
          </div>
        </section>

        <div className="mt-12 p-8 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
          <p className="font-sans text-sm text-stone-600 dark:text-stone-400">
            <strong>Any questions?</strong> Just send us an email at <a href="mailto:sparshdivineartstudio@gmail.com" className="text-amber-600 hover:underline">sparshdivineartstudio@gmail.com</a> or give us a call at +91 8160901481. We're here to help!
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default ReturnsRefunds;
