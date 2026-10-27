import React from 'react';
import { motion } from 'framer-motion';
import { Rarity } from '../../types';

export const HaloEffect: React.FC<{ rarity: Rarity }> = React.memo(({ rarity }) => {
  // 高負荷な filter: blur(...) を廃止し、滑らかな多段階 color-stops による radial-gradient で
  // 60fps以上のシルクのような滑らかさと豪華な光彩オーラを両立
  const getRadialGradient = (r: Rarity) => {
    switch (r) {
      case 'UR':
        return 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.45) 0%, rgba(236, 72, 153, 0.32) 25%, rgba(251, 146, 60, 0.18) 48%, rgba(168, 85, 247, 0.05) 68%, transparent 80%)';
      case 'SR':
        return 'radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.45) 0%, rgba(249, 115, 22, 0.32) 30%, rgba(249, 115, 22, 0.12) 55%, rgba(250, 204, 21, 0.03) 72%, transparent 85%)';
      case 'R':
        return 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.45) 0%, rgba(79, 70, 229, 0.32) 30%, rgba(59, 130, 246, 0.12) 55%, rgba(79, 70, 229, 0.03) 72%, transparent 85%)';
      default:
        return 'radial-gradient(circle at 50% 50%, rgba(148, 163, 184, 0.22) 0%, rgba(148, 163, 184, 0.1) 35%, rgba(148, 163, 184, 0.02) 60%, transparent 75%)';
    }
  };

  const getConicGradient = (r: Rarity) => {
    if (r === 'UR') {
      return 'conic-gradient(from 0deg, transparent 0deg, rgba(168, 85, 247, 0.22) 45deg, transparent 90deg, rgba(236, 72, 153, 0.22) 135deg, transparent 180deg, rgba(168, 85, 247, 0.22) 225deg, transparent 270deg, rgba(236, 72, 153, 0.22) 315deg, transparent 360deg)';
    }
    if (r === 'SR') {
      return 'conic-gradient(from 0deg, transparent 0deg, rgba(250, 204, 21, 0.18) 45deg, transparent 90deg, rgba(249, 115, 22, 0.18) 135deg, transparent 180deg, rgba(250, 204, 21, 0.18) 225deg, transparent 270deg, rgba(249, 115, 22, 0.18) 315deg, transparent 360deg)';
    }
    return '';
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      {/* 画面全体に広がる巨大な光彩オーラ（GPU合成を有効化） */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: [0.35, 0.55, 0.35],
          scale: [1, 1.3, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[150vmax] h-[150vmax] rounded-full pointer-events-none"
        style={{
          background: getRadialGradient(rarity),
          transform: 'translateZ(0)',
          willChange: 'transform, opacity',
        }}
      />
      
      {/* 高レアリティ（UR / SR）のコアグロー */}
      {['UR', 'SR'].includes(rarity) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.2, 0.45, 0.2],
            scale: [0.95, 1.15, 0.95]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[70vmax] h-[70vmax] rounded-full pointer-events-none"
          style={{
            background: rarity === 'UR'
              ? 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.35) 0%, rgba(168, 85, 247, 0.18) 35%, transparent 70%)'
              : 'radial-gradient(circle at 50% 50%, rgba(254, 240, 138, 0.35) 0%, rgba(249, 115, 22, 0.18) 35%, transparent 70%)',
            transform: 'translateZ(0)',
            willChange: 'transform, opacity',
          }}
        />
      )}

      {rarity === 'UR' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.12, 0.32, 0.12],
            rotate: [0, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-[100vmax] h-[100vmax] rounded-full mix-blend-screen pointer-events-none"
          style={{
            background: getConicGradient('UR'),
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 15%, rgba(0,0,0,0.6) 45%, transparent 75%)',
            maskImage: 'radial-gradient(circle at 50% 50%, black 15%, rgba(0,0,0,0.6) 45%, transparent 75%)',
            transform: 'translateZ(0)',
            willChange: 'transform, opacity',
          }}
        />
      )}
      
      {rarity === 'SR' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.25, 0.1],
            rotate: [0, 180]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[120vmax] h-[120vmax] rounded-full mix-blend-screen pointer-events-none"
          style={{
            background: getConicGradient('SR'),
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 15%, rgba(0,0,0,0.6) 45%, transparent 75%)',
            maskImage: 'radial-gradient(circle at 50% 50%, black 15%, rgba(0,0,0,0.6) 45%, transparent 75%)',
            transform: 'translateZ(0)',
            willChange: 'transform, opacity',
          }}
        />
      )}
    </div>
  );
});
