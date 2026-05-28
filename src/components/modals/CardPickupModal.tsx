import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, RotateCcw, MousePointer2 } from 'lucide-react';
import { allTermsMap, quizCategories } from '../../data/quizData';
import { termToId, getRarityStyles } from '../../lib/utils';
import { getTermIcon, getTermEmoji } from '../../lib/termIcon';
import { HaloEffect } from '../effects/HaloEffect';

interface CardPickupModalProps {
  pickedCard: { term: string; descriptionIndex: number } | null;
  setPickedCard: (card: { term: string; descriptionIndex: number } | null) => void;
  ownedCards: Record<string, number>;
  handleCardClick: (term: string) => void;
}

export const CardPickupModal: React.FC<CardPickupModalProps> = ({
  pickedCard,
  setPickedCard,
  ownedCards,
  handleCardClick
}) => {
  if (!pickedCard) return null;

  const termData = allTermsMap[pickedCard.term];
  const rarity = termData?.rarity || 'C';
  const styles = getRarityStyles(rarity);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      >
        <HaloEffect rarity={rarity} />
        {/* Backdrop with Rarity Effect */}
        <div 
          className={`absolute inset-0 backdrop-blur-xl ${
            rarity === 'UR' ? 'bg-purple-900/40' :
            rarity === 'SR' ? 'bg-yellow-900/30' :
            rarity === 'R' ? 'bg-blue-900/30' :
            'bg-black/60'
          }`}
          onClick={() => setPickedCard(null)}
        />

        {/* Floating Particles or Glow for High Rarity */}
        {['SR', 'UR'].includes(rarity) && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  y: [null, Math.random() * -200],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                className={`absolute w-2 h-2 rounded-full ${
                  rarity === 'UR' ? 'bg-pink-400' : 'bg-yellow-300'
                } blur-sm`}
              />
            ))}
          </div>
        )}

        <motion.div
          layoutId={`card-${pickedCard.term}`}
          style={{ perspective: 1000 }}
          initial={{ scale: 0.8, y: 50, rotateY: 180 }}
          animate={{ scale: 1, y: 0, rotateY: 0 }}
          exit={{ scale: 0.8, y: 50, rotateY: 180 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={() => handleCardClick(pickedCard.term)}
          className={`relative w-full max-w-[260px] md:max-w-sm aspect-[2/3] md:aspect-[3/4] max-h-[85vh] rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl border-4 ${styles.border} ${styles.glow} z-10`}
        >
          {/* Card Backgrounds */}
          <div className="absolute inset-0 bg-theme-card" />
          <div className={`absolute inset-0 ${styles.bg} opacity-10`} />

          {/* Pulse Effect (Behind Content) */}
          {styles.pulse && (
            <div className={`absolute inset-0 ${styles.bg} opacity-15 ${styles.pulse} z-0`} />
          )}

          {/* Shine Effect (Behind Content) */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"
          />

          {/* Card Content in Modal */}
          <div className="h-full flex flex-col bg-transparent relative z-10">
            {/* Header */}
            <div className={`px-3 py-2 md:px-4 md:py-3 flex justify-between items-center shrink-0 ${rarity !== 'C' ? styles.bg : 'bg-theme-muted'} ${rarity !== 'C' ? 'text-white' : 'text-theme-text-muted'}`}>
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase drop-shadow-sm">
                {styles.label}
              </span>
              <span className="text-[8px] md:text-[10px] font-bold bg-theme-card/20 px-2 py-0.5 rounded-full font-mono">
                ID: {termToId[pickedCard.term] || "000"}
              </span>
            </div>

            {/* Body */}
            <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center text-center space-y-3 md:space-y-4 overflow-y-auto">
              <div className={`w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl flex items-center justify-center ${styles.bg} ${rarity === 'C' || !termData ? 'text-theme-text' : 'text-white'} shadow-inner shrink-0`}>
                <span className="text-4xl md:text-5xl">{getTermEmoji(pickedCard.term)}</span>
              </div>
              
              <div className="space-y-1 shrink-0">
                <h3 className="text-xl md:text-2xl font-bold leading-tight text-theme-text drop-shadow-sm">{pickedCard.term}</h3>
                <p className="text-[9px] md:text-xs text-theme-text-muted font-bold uppercase tracking-widest">
                  {quizCategories.find(c => c.subcategories.some(s => s.terms.some(t => t.name === pickedCard.term)))?.title || 'Unknown Category'}
                </p>
              </div>

              <motion.div 
                key={pickedCard.descriptionIndex}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-3 md:pt-4 border-t border-theme-border w-full shrink-0"
              >
                <div className="flex items-center justify-center gap-1.5 md:gap-2 text-theme-text-muted mb-2">
                  <Info size={12} className="md:w-3 md:h-3" />
                  <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Pattern {pickedCard.descriptionIndex + 1}</span>
                </div>
                <p className="text-sm md:text-lg text-theme-text leading-relaxed font-bold mb-2 drop-shadow-sm">
                  "{(termData?.descriptions || ["説明がありません。"])[pickedCard.descriptionIndex]}"
                </p>
                <p className="text-[10px] md:text-sm text-theme-text-muted leading-relaxed italic">
                  {(() => {
                    const flavor = termData?.flavorTexts;
                    if (!flavor) return "未知のデータ...";
                    if (Array.isArray(flavor)) {
                      return flavor[pickedCard.descriptionIndex % flavor.length];
                    }
                    return flavor;
                  })()}
                </p>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 md:px-4 md:py-3 bg-theme-muted flex justify-between items-center shrink-0 border-t border-theme-border">
              <div className="flex gap-1 md:gap-1.5">
                {[...Array(Math.min(termData?.descriptions?.length || 1, 3))].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${i === pickedCard.descriptionIndex ? styles.bg : 'bg-theme-border-strong'}`} 
                  />
                ))}
              </div>
              <div className="text-theme-text-muted animate-bounce">
                <RotateCcw size={14} className="md:w-4 md:h-4" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Close Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 md:bottom-10 text-white/40 md:text-white/60 text-[10px] md:text-sm font-medium tracking-widest uppercase flex flex-col md:flex-row items-center gap-1 md:gap-2 text-center"
        >
          <div className="flex items-center gap-1">
            <MousePointer2 size={12} className="md:w-4 md:h-4" />
            <span>Tap card to switch</span>
          </div>
          <span className="hidden md:inline">•</span>
          <span>Tap outside to close</span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
