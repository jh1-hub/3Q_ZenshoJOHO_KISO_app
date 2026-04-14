import React from 'react';
import { motion } from 'framer-motion';

export const Burst = ({ color, count }: { color: string, count: number }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          x: "50%", 
          y: "50%", 
          scale: 0,
          opacity: 1,
          left: 0,
          top: 0
        }}
        animate={{ 
          x: `${50 + (Math.random() - 0.5) * 200}%`,
          y: `${50 + (Math.random() - 0.5) * 200}%`,
          scale: [0, 1, 0],
          opacity: [1, 1, 0]
        }}
        transition={{ 
          duration: 1, 
          ease: "easeOut",
          delay: 0.1
        }}
        className={`absolute w-2 h-2 rounded-full ${color} blur-[1px]`}
      />
    ))}
  </div>
);
