import React from 'react';
import { motion } from 'framer-motion';
import { Rarity } from '../../types';

export const HaloEffect = ({ rarity }: { rarity: Rarity }) => {
  const getColors = () => {
    switch (rarity) {
      case 'UR': return 'rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.3), rgba(251, 146, 60, 0.2)';
      case 'SR': return 'rgba(250, 204, 21, 0.4), rgba(249, 115, 22, 0.3), transparent';
      case 'R': return 'rgba(59, 130, 246, 0.4), rgba(79, 70, 229, 0.3), transparent';
      default: return 'rgba(148, 163, 184, 0.2), transparent, transparent';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      {/* Radial Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[150vmax] h-[150vmax] rounded-full"
        style={{
          background: `radial-gradient(circle, ${getColors()})`,
          filter: 'blur(100px)',
        }}
      />
    </div>
  );
};
