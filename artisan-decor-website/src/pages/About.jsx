import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const About = () => {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 800], [0, 150]);

  return (
    <main className="min-h-screen pt-32 pb-24">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 text-center mb-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-sans text-amber-600 tracking-widest uppercase text-xs mb-4 font-semibold"
        >
          Our Story
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif text-stone-900 dark:text-stone-50 max-w-4xl mx-auto leading-tight"
        >
          We make things you can feel — not just see.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-sans text-stone-500 dark:text-stone-400 mt-8 max-w-2xl mx-auto leading-relaxed text-lg"
        >
          Sparsh Divine Art Studio is a one-woman studio dedicated to handcrafted resin art, soy wax candles, and concrete antiques — each piece made with full presence and no shortcuts.
        </motion.p>
      </section>

      {/* Parallax Image */}
      <section className="w-full h-[500px] md:h-[650px] overflow-hidden mb-28 relative">
        <motion.img
          style={{ y: yImage }}
          src="https://sparshdivineartstudio.me/img-studio.png"
          alt="Studio Workshop"
          className="w-full h-[120%] object-cover object-center absolute inset-0 opacity-90 dark:opacity-70"
        />
        <div className="absolute inset-0 bg-stone-900/10"></div>
        <div className="absolute inset-0 flex items-end pb-16 px-12">
          <p className="font-serif text-white text-2xl md:text-4xl italic max-w-xl drop-shadow-lg">
            "When concrete meets gold, it highlights the luxury hidden in raw, honest material."
          </p>
        </div>
      </section>

      {/* Two-column story */}
      <section className="max-w-7xl mx-auto px-8 mb-28 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-stone-50 mb-6">How Sparsh began</h2>
          <div className="space-y-5 font-sans text-stone-600 dark:text-stone-400 leading-relaxed">
            <p>
              Sparsh — meaning <em>touch</em> in Sanskrit — started as a deeply personal project. Tired of cold, mass-produced décor, our founder poured her first resin tray at a kitchen table in Ahmedabad with nothing but a YouTube tutorial and a lot of pigment.
            </p>
            <p>
              That first piece found its way to a friend's shelf. Then to another. Then strangers started asking. It became clear: people were hungry for something made by hands, not machines. For something that carries a story.
            </p>
            <p>
              Today, Sparsh Divine Art Studio ships across India — but every piece still begins in the same quiet studio, the same way: with intention, patience, and a belief that ordinary materials can become extraordinary art.
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-stone-50 mb-6">What we make &amp; why</h2>
          <div className="space-y-8">
            {[
              { title: 'Resin Art', desc: 'Liquid pigment captured mid-flow — abstract, luminous, and utterly impossible to replicate. Each tray, coaster, or wall piece is a frozen moment in time.' },
              { title: 'Soy Wax Candles', desc: 'Hand-poured into concrete vessels and infused with essential oils — our candles are designed for the ritual of slowing down. Clean-burning, long-lasting, and beautiful on every shelf.' },
              { title: 'Concrete Antiques', desc: 'Brutalist in form, golden in spirit. We cast and hand-finish each concrete piece — from vases to bookends — giving raw, industrial material an unexpectedly warm character.' },
            ].map((item, idx) => (
              <div key={idx} className="border-l-2 border-amber-500 pl-6">
                <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-50 mb-2">{item.title}</h3>
                <p className="font-sans text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="bg-stone-900 dark:bg-stone-950 py-24 px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <p className="font-sans text-amber-500 uppercase tracking-widest text-xs font-semibold mb-3">What Guides Us</p>
          <h2 className="font-serif text-4xl text-white">Our Values</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: 'spa', title: 'Slow Craft', desc: 'We do not rush. Every piece cures at its own pace. Slow and intentional — always.' },
            { icon: 'eco', title: 'Non-toxic Always', desc: 'We use non-toxic resin, natural soy wax, and skin-safe pigments. Good for you and your home.' },
            { icon: 'volunteer_activism', title: 'Made With Love', desc: 'Not a cliché — literally. Each piece is made in small batches with full attention. You will feel the difference.' },
          ].map((v, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-amber-500 text-2xl">{v.icon}</span>
              </div>
              <h3 className="font-serif text-xl text-white mb-3">{v.title}</h3>
              <p className="font-sans text-stone-400 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  );
};

export default About;
