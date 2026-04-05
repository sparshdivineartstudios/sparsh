import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement using a spring physics effect
  const springConfig = { damping: 40, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Offset by half the width/height of the glowing orb to perfectly center it
      mouseX.set(e.clientX - 400);
      mouseY.set(e.clientY - 400);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        className="absolute w-[800px] h-[800px] rounded-full opacity-10 dark:opacity-[0.07] bg-gradient-to-tr from-amber-600 to-yellow-500 blur-[150px] mix-blend-screen"
      />
    </div>
  );
};

export default CursorGlow;
