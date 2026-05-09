import React from 'react';
import { motion } from 'framer-motion';

export const SpeedLines = ({ count = 15 }: { count?: number }) => {
  if (count === 0) return null;
  return (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          rotate: (i * 360) / count,
          scaleX: 0,
          opacity: 0,
          x: "-50%",
          y: "-50%",
          left: "50%",
          top: "50%"
        }}
        animate={{ 
          scaleX: [0, 1.2, 0],
          opacity: [0, 0.4, 0],
        }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          delay: Math.random() * 0.5,
          ease: "easeInOut"
        }}
        className="absolute h-[2px] w-[1000px] bg-gradient-to-r from-transparent via-white/30 to-transparent origin-left"
      />
    ))}
  </div>
  );
};
