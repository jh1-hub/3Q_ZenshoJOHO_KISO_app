import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lock } from 'lucide-react';
import { StoryCard } from '../../data/storyData';

interface StoryItemProps {
  card: StoryCard;
  isUnlocked: boolean;
  onClick: () => void;
}

export const StoryItem: React.FC<StoryItemProps> = ({
  card,
  isUnlocked,
  onClick
}) => {
  return (
    <motion.button
      whileHover={isUnlocked ? { scale: 1.02, y: -4 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`relative p-6 rounded-3xl border-2 text-left transition-all ${
        isUnlocked 
          ? 'bg-theme-card border-theme-border hover:border-amber-500/50 shadow-sm' 
          : 'bg-theme-muted border-transparent opacity-40 grayscale cursor-not-allowed'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
          isUnlocked ? 'bg-amber-500 text-black' : 'bg-theme-border text-theme-text-muted'
        }`}>
          #{card.id}
        </span>
        {isUnlocked ? (
          <BookOpen size={18} className="text-amber-500" />
        ) : (
          <Lock size={18} className="text-theme-text-muted" />
        )}
      </div>
      <h4 className={`font-bold mb-2 ${isUnlocked ? 'text-theme-text' : 'text-theme-text-muted'}`}>
        {isUnlocked ? card.title : 'Locked Episode'}
      </h4>
      <p className="text-xs text-theme-text-muted line-clamp-2">
        {isUnlocked ? card.content : 'レベルを上げてストーリーを解放しましょう。'}
      </p>
    </motion.button>
  );
};
