import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight } from 'lucide-react';
import { SpeedLines } from '../effects/SpeedLines';
import { Burst } from '../effects/Burst';
import { storyCards, StoryCard } from '../../data/storyData';

interface LevelUpOverlayProps {
  showLevelUp: number | null;
  setShowLevelUp: (level: number | null) => void;
  setShowStoryCard: (card: StoryCard | null) => void;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = React.memo(({
  showLevelUp,
  setShowLevelUp,
  setShowStoryCard
}) => {
  return (
    <AnimatePresence>
      {showLevelUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-xl overflow-hidden"
          onClick={() => {
            const unlockedLevel = showLevelUp;
            setShowLevelUp(null);
            if (unlockedLevel && unlockedLevel >= 2 && unlockedLevel <= 99) {
              const card = storyCards.find(c => c.id === unlockedLevel - 1);
              if (card) setShowStoryCard(card);
            }
          }}
        >
          <SpeedLines />
          <Burst color="bg-amber-400" count={20} />
          
          <motion.div
            initial={{ scale: 0.5, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="text-center space-y-10 p-12 relative z-10"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-40px] bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500 rounded-full blur-3xl opacity-40"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative bg-gradient-to-b from-amber-300 to-amber-600 p-1.5 rounded-full shadow-[0_0_50px_rgba(251,191,36,0.6)]"
              >
                <div className="bg-theme-card rounded-full p-10">
                  <Trophy size={100} className="text-amber-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                </div>
              </motion.div>
            </div>
            
            <div className="space-y-4">
              <motion.h2 
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-6xl md:text-8xl font-theme-heading font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                LEVEL UP!
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-6 text-amber-400 font-bold"
              >
                <span className="text-3xl opacity-60">Lv.{showLevelUp ? showLevelUp - 1 : ''}</span>
                <ArrowRight size={32} className="text-white/40" />
                <span className="text-white text-6xl md:text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">{showLevelUp}</span>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-white/40 text-lg font-bold tracking-[0.3em] uppercase animate-pulse"
            >
              Tap to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
