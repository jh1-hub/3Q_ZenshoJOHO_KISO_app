import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { getTermIcon, getTermEmoji } from '../../lib/termIcon';

interface CardItemProps {
  term: string;
  subId: string;
  rarity: string;
  styles: any;
  isOwned: boolean;
  count: number;
  isTarget: boolean;
  pickedCard: { term: string; descriptionIndex: number } | null;
  allTermsMap: Record<string, any>;
  handleCardClick: (term: string) => void;
  cardRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export const CardItem: React.FC<CardItemProps> = ({
  term,
  subId,
  rarity,
  styles,
  isOwned,
  count,
  isTarget,
  pickedCard,
  allTermsMap,
  handleCardClick,
  cardRefs
}) => {
  const descriptionIndex = pickedCard?.term === term ? pickedCard.descriptionIndex : 0;
  const descriptions = allTermsMap[term]?.descriptions || ["説明がありません。"];
  const flavorTexts = allTermsMap[term]?.flavorTexts;

  return (
    <div 
      ref={el => {
        if (cardRefs.current) {
          cardRefs.current[term] = el;
        }
      }}
      className={`aspect-[3/4] relative ${isTarget ? 'ring-4 ring-amber-400 ring-offset-4 ring-offset-theme-bg rounded-2xl z-10 scale-105 transition-all' : ''}`}
    >
      <motion.div
        whileHover={isOwned ? { scale: 1.05, y: -5 } : {}}
        onClick={() => handleCardClick(term)}
        className={`relative h-full flex flex-col rounded-2xl overflow-hidden ${isOwned ? 'cursor-pointer' : 'cursor-not-allowed grayscale opacity-50'} group ${isOwned ? styles.border : 'border-2 border-dashed border-theme-border-strong'} ${isOwned ? styles.glow : ''} bg-theme-card`}
      >
        {/* Card Backgrounds */}
        <div className={`absolute inset-0 ${isOwned ? styles.bg : 'bg-theme-border'} opacity-10 group-hover:opacity-20 transition-opacity`} />
      
        {/* Pulse Effect (Behind Content) */}
        {isOwned && styles.pulse && (
          <div className={`absolute inset-0 ${styles.bg} opacity-15 ${styles.pulse} z-0`} />
        )}

        <div className="flex-1 flex flex-col bg-transparent relative z-10" style={{ perspective: 1000 }}>
          {/* Card Header */}
          <div className={`px-2 py-1.5 md:px-3 md:py-2 flex justify-between items-center shrink-0 ${isOwned && rarity !== 'C' ? styles.bg : 'bg-theme-muted'} ${isOwned && rarity !== 'C' ? 'text-white' : 'text-theme-text-muted'}`}>
            <span className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase drop-shadow-sm">{isOwned ? styles.label : 'LOCKED'}</span>
            {isOwned && count > 1 && (
              <span className="text-[8px] md:text-[10px] font-bold bg-theme-card/20 px-1.5 py-0.5 rounded-full">x{count}</span>
            )}
          </div>

          {/* Card Content */}
          <div className="flex-1 p-3 md:p-4 flex flex-col items-center justify-start text-center space-y-2 md:space-y-3">
            <div className={`hidden md:flex w-12 h-12 shrink-0 rounded-xl items-center justify-center ${isOwned ? styles.bg : 'bg-theme-border'} ${isOwned ? (rarity === 'C' ? 'text-theme-text' : 'text-white') : 'text-theme-text-muted'} shadow-inner`}>
              {isOwned ? <span className="text-2xl">{getTermEmoji(term)}</span> : <Lock size={20} />}
            </div>
            
            <div className="space-y-0.5 w-full shrink-0">
              <h3 className={`text-sm md:text-base font-bold leading-tight ${isOwned ? 'text-theme-text' : 'text-theme-text-muted'} break-words drop-shadow-sm`}>{isOwned ? term : '???'}</h3>
            </div>

            {isOwned && (
                <motion.div 
                  key={descriptionIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="pt-2 md:pt-3 border-t border-theme-border w-full flex-1 flex flex-col justify-between"
                >
                <p className="text-[10px] md:text-xs text-theme-text leading-relaxed text-left mb-1 drop-shadow-sm font-bold">
                  {descriptions[descriptionIndex]}
                </p>
                {flavorTexts && (
                  <p className="text-[8px] md:text-[10px] text-theme-text-muted leading-relaxed text-left mb-2 italic">
                    {(() => {
                      if (Array.isArray(flavorTexts)) {
                        return flavorTexts[descriptionIndex % flavorTexts.length];
                      }
                      return flavorTexts;
                    })()}
                  </p>
                )}
                <div className="flex justify-center gap-1 mt-auto pb-1">
                  {[...Array(Math.min(descriptions.length, 3))].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                        i === descriptionIndex
                          ? (isOwned ? styles.bg : 'bg-theme-text-muted') 
                          : (i < count ? 'bg-theme-border-strong' : 'bg-theme-border')
                      }`} 
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
