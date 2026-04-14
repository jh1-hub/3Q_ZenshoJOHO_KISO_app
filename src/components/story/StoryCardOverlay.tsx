import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { StoryCard } from '../../data/storyData';
import { SpeedLines } from '../effects/SpeedLines';

export const StoryCardOverlay = ({ card, onClose }: { card: StoryCard; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6"
      onClick={onClose}
    >
      <SpeedLines />
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateY: 180 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        className="relative w-full max-w-sm aspect-[2/3] bg-slate-900 rounded-[2.5rem] border-4 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
        
        {/* Card Header */}
        <div className="p-6 border-b border-amber-500/20 flex justify-between items-center bg-amber-500/5">
          <span className="text-amber-500 font-black tracking-widest text-xs uppercase">Story Card #{card.id}</span>
          <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">{card.chapter}</span>
        </div>

        {/* Card Content */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
          <div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center">
            <BookOpen size={40} className="text-amber-500" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">「{card.title}」</h3>
            <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full opacity-50" />
            <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap text-left">
              {card.content}
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-6 text-center border-t border-amber-500/10">
          <button 
            onClick={onClose}
            className="text-amber-500/60 font-bold text-xs uppercase tracking-[0.2em] hover:text-amber-500 transition-colors"
          >
            Tap to close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
