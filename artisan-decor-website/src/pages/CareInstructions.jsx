import React from 'react';
import { motion } from 'framer-motion';

const CareInstructions = () => {
  return (
    <main className="min-h-screen pt-32 pb-24 px-8 max-w-4xl mx-auto">
      <div className="mb-16 border-b border-stone-200 dark:border-stone-800 pb-8">
        <p className="font-sans text-amber-600 uppercase tracking-widest text-sm font-semibold mb-4">Tips</p>
        <h1 className="font-serif text-5xl font-semibold text-stone-900 dark:text-stone-50 mb-4">
          How to Care for Your Pieces
        </h1>
        <p className="font-sans text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
          Keep your handmade pieces looking beautiful! Here are some simple tips for each product.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
        <section>
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-50 mb-4 flex items-center gap-3">
            <span className="text-3xl">✨</span> Resin Art
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-sans font-semibold text-stone-800 dark:text-stone-300 mb-2">Cleaning</h3>
              <ul className="space-y-1 font-sans text-stone-600 dark:text-stone-400 text-sm">
                <li>• Wipe gently with a soft cloth</li>
                <li>• If dusty, use a barely damp cloth and dry immediately</li>
                <li>• Don't use harsh chemicals or rough materials</li>
              </ul>
            </div>
            <div>
              <h3 className="font-sans font-semibold text-stone-800 dark:text-stone-300 mb-2">Where to Display</h3>
              <ul className="space-y-1 font-sans text-stone-600 dark:text-stone-400 text-sm">
                <li>• Keep away from direct sunlight (it can fade colors over time)</li>
                <li>• Avoid very hot or very cold spots</li>
                <li>• Sit it somewhere stable, away from moisture</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-50 mb-4 flex items-center gap-3">
            <span className="text-3xl">🕯️</span> Soy Wax Candles
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-sans font-semibold text-stone-800 dark:text-stone-300 mb-2">First Time Lighting</h3>
              <ul className="space-y-1 font-sans text-stone-600 dark:text-stone-400 text-sm">
                <li>• Burn for about 2-3 hours the first time</li>
                <li>• This helps the wax melt evenly across the top</li>
                <li>• Otherwise it might only melt in the middle (we call that tunneling!)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-sans font-semibold text-stone-800 dark:text-stone-300 mb-2">While Burning</h3>
              <ul className="space-y-1 font-sans text-stone-600 dark:text-stone-400 text-sm">
                <li>• Keep the wick short (about 1/4 inch)</li>
                <li>• Never leave a burning candle unattended</li>
                <li>• Keep away from kids and pets</li>
                <li>• Burn in a room with good air</li>
              </ul>
            </div>
            <div>
              <h3 className="font-sans font-semibold text-stone-800 dark:text-stone-300 mb-2">Storage</h3>
              <ul className="space-y-1 font-sans text-stone-600 dark:text-stone-400 text-sm">
                <li>• Keep in a cool, dry place</li>
                <li>• Put the lid back on to keep the scent fresh</li>
                <li>• Avoid very hot or cold places</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-50 mb-4 flex items-center gap-3">
            <span className="text-3xl">🏛️</span> Concrete Pieces
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-sans font-semibold text-stone-800 dark:text-stone-300 mb-2">Cleaning</h3>
              <ul className="space-y-1 font-sans text-stone-600 dark:text-stone-400 text-sm">
                <li>• Dust regularly with a soft brush</li>
                <li>• Wipe with a slightly damp cloth if needed</li>
                <li>• Let dry completely after cleaning</li>
              </ul>
            </div>
            <div>
              <h3 className="font-sans font-semibold text-stone-800 dark:text-stone-300 mb-2">Tips</h3>
              <ul className="space-y-1 font-sans text-stone-600 dark:text-stone-400 text-sm">
                <li>• For outdoor pieces, avoid waterlogging</li>
                <li>• Bring inside during heavy rain or snow</li>
                <li>• They'll develop a nice patina over time — that's part of their charm!</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="mt-12 p-8 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
          <p className="font-sans text-sm text-stone-600 dark:text-stone-400">
            <strong>Need help with your piece?</strong> Drop us a line at <a href="mailto:sparshdivineartstudio@gmail.com" className="text-amber-600 hover:underline">sparshdivineartstudio@gmail.com</a> — we love hearing from our customers!
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default CareInstructions;
