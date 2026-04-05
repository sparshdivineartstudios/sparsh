import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ──────────────────────────────────────────────────────
   SPARSH Splash Screen
   A cinematic resin-pour loading experience.
   Shows on the very first visit (sessionStorage controlled).
   Duration: ~2.8s then fades out.
   ────────────────────────────────────────────────────── */

const LETTERS = 'SPARSH'.split('');

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('drop'); // drop → reveal → exit

  useEffect(() => {
    // Phase 1: drops animate in (0–1s), then text reveals
    const t1 = setTimeout(() => setPhase('reveal'), 900);
    // Phase 2: hold at full brightness
    const t2 = setTimeout(() => setPhase('exit'), 2400);
    // Phase 3: parent hides this component
    const t3 = setTimeout(() => onDone?.(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'gone' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'exit' ? 0 : 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#0c0a09' }}          /* stone-950 */
        >
          {/* ── Ambient blobs ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2.5, opacity: 0.18 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
              style={{ background: 'radial-gradient(circle, #b45309 0%, transparent 70%)' }}
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 0.12 }}
              transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
              className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, #0f766e 0%, transparent 70%)' }}
            />
          </div>

          {/* ── Resin drop animation ── */}
          <div className="relative flex items-end justify-center gap-1 mb-10" style={{ height: 80 }}>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ y: -120, opacity: 0, scaleY: 0.5 }}
                animate={phase === 'drop' || phase === 'reveal' || phase === 'exit'
                  ? { y: 0, opacity: [0, 1, 1, 0.7], scaleY: [0.5, 1.3, 0.8, 1] }
                  : {}}
                transition={{
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  width: 6 + i * 3,
                  height: 24 + i * 12,
                  borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
                  background: `linear-gradient(180deg, 
                    ${['#f59e0b','#d97706','#b45309','#92400e'][i]} 0%, 
                    ${['#fcd34d','#f59e0b','#d97706','#b45309'][i]} 100%)`,
                  filter: 'blur(0.5px)',
                  transformOrigin: 'bottom center',
                }}
              />
            ))}

            {/* Splat ring that appears on impact */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.5, delay: 0.55, ease: 'easeOut' }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-3 rounded-full"
              style={{
                background: 'radial-gradient(ellipse, rgba(245,158,11,0.5) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* ── SPARSH letter-by-letter reveal ── */}
          <div className="flex items-center gap-1 md:gap-2 mb-4">
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={phase === 'reveal' || phase === 'exit'
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 20, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: 'easeOut' }}
                className="font-serif text-5xl md:text-7xl tracking-[0.15em] text-white"
                style={{ textShadow: '0 0 40px rgba(245,158,11,0.3)' }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* ── Tagline ── */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={phase === 'reveal' || phase === 'exit'
              ? { opacity: 0.5, y: 0 }
              : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="font-sans text-[10px] uppercase tracking-[0.4em] text-stone-400"
          >
            Divine Art Studio · Handmade in India
          </motion.p>

          {/* ── Thin progress line ── */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-amber-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.4, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
