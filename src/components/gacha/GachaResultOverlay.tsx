import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SpeedLines } from '../effects/SpeedLines';
import { HaloEffect } from '../effects/HaloEffect';
import { Burst } from '../effects/Burst';

interface GachaResultOverlayProps {
  currentGachaCard: any;
  getRarityStyles: (rarity: string) => any;
  allTermsMap: Record<string, any>;
  getTermIcon: (term: string, size: number) => React.ReactNode;
  quizCategories: any[];
  gachaHistory: any[];
  gachaQueue: number;
  handleRedraw: () => void;
  handleKeepCard: (action: 'next' | 'close' | 'collection') => void;
}

export const GachaResultOverlay: React.FC<GachaResultOverlayProps> = ({
  currentGachaCard,
  getRarityStyles,
  allTermsMap,
  getTermIcon,
  quizCategories,
  gachaHistory,
  gachaQueue,
  handleRedraw,
  handleKeepCard
}) => {
  const rarity = allTermsMap[currentGachaCard.term]?.rarity || 'C';
  const styles = getRarityStyles(rarity);
  const descriptions = allTermsMap[currentGachaCard.term]?.descriptions || ["説明がありません。"];
  const flavorTexts = allTermsMap[currentGachaCard.term]?.flavorTexts;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 overflow-y-auto"
    >
      <SpeedLines />
      
      {/* Reveal Flash */}
      <motion.div
        key={`flash-${currentGachaCard.term}-${currentGachaCard.redrawsUsed}`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className={`absolute inset-0 z-[250] pointer-events-none ${styles.flash}`}
      />

      <HaloEffect rarity={rarity} />
      
      {/* Burst Effect */}
      <Burst 
        color={styles.flash} 
        count={styles.particles} 
      />

      <motion.div
        key={`${currentGachaCard.term}-${currentGachaCard.redrawsUsed}`}
        initial={{ scale: 0.2, opacity: 0, rotateY: 180, rotate: -15 }}
        animate={{ 
          scale: 1,
          opacity: 1, 
          rotateY: 0, 
          rotate: 0,
          x: [0, -10, 10, -5, 5, 0]
        }}
        transition={{ 
          scale: { type: "spring", damping: 12, stiffness: 100, delay: 0.1 },
          x: { duration: 0.4, delay: 0.2 }
        }}
        className="relative w-full max-w-[280px] md:max-w-sm aspect-[2/3] md:aspect-[3/4] z-10"
      >
        {/* Card Display */}
        <div className={`relative w-full h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden group ${styles.border} ${styles.glow} transition-all duration-300 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4`}>
          {/* Card Backgrounds */}
          <div className="absolute inset-0 bg-theme-card" />
          <div className={`absolute inset-0 ${styles.bg} opacity-10`} />
          
          {/* Pulse Effect (Behind Content) */}
          {styles.pulse && (
            <div className={`absolute inset-0 ${styles.bg} opacity-15 ${styles.pulse} z-0`} />
          )}

          {/* Sparkles for High Rarity (Behind Content) */}
          {['SR', 'UR'].includes(rarity) && (
            <div className="absolute inset-0 pointer-events-none z-0">
              <motion.div 
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/15 to-white/0"
              />
            </div>
          )}

          <div className="h-full flex flex-col bg-transparent relative z-10">
            {/* Card Header */}
            <div className={`px-3 py-2 md:px-4 md:py-3 flex justify-between items-center relative z-10 ${rarity !== 'C' ? styles.bg : 'bg-theme-muted'} ${rarity !== 'C' ? 'text-white' : 'text-theme-text-muted'}`}>
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase drop-shadow-sm">{styles.label}</span>
              <span className="text-[8px] md:text-[10px] font-bold bg-theme-card/20 px-2 py-0.5 rounded-full">NEW!</span>
            </div>

            {/* Card Content */}
            <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center text-center space-y-3 md:space-y-4 relative z-10">
              <div className={`w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl flex items-center justify-center ${styles.bg} ${rarity === 'C' ? 'text-theme-text' : 'text-white'} shadow-inner`}>
                <div className="hidden md:block">{getTermIcon(currentGachaCard.term, 48)}</div>
                <div className="block md:hidden">{getTermIcon(currentGachaCard.term, 32)}</div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-bold leading-tight text-theme-text drop-shadow-sm">{currentGachaCard.term}</h3>
                <p className="text-[9px] md:text-xs text-theme-text-muted font-bold uppercase tracking-widest">
                  {quizCategories.find(c => c.subcategories.some((s: any) => s.terms.some((t: any) => t.name === currentGachaCard.term)))?.title || 'Unknown Category'}
                </p>
              </div>

              <div className="pt-3 md:pt-4 border-t border-theme-border w-full">
                <p className="text-sm md:text-lg text-theme-text leading-relaxed font-bold mb-2 drop-shadow-sm">
                  "{descriptions[0]}"
                </p>
                {flavorTexts && (
                  <p className="text-[10px] md:text-sm text-theme-text-muted leading-relaxed italic">
                    {Array.isArray(flavorTexts) ? flavorTexts[0] : flavorTexts}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 md:mt-12 flex flex-col items-center gap-4 md:gap-6 w-full max-w-[280px] md:max-w-sm">
        <p className="text-white/60 font-bold tracking-widest text-sm md:text-base">
          {gachaHistory.length + 1} / {gachaHistory.length + gachaQueue + 1}
        </p>
        
        {currentGachaCard.isDuplicate && currentGachaCard.redrawsUsed < currentGachaCard.maxRedraws && (
          <div className="text-amber-400 font-bold text-sm mb-2">
            ダブり発生！再抽選可能です（残り {currentGachaCard.maxRedraws - currentGachaCard.redrawsUsed} 回）
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4 w-full">
          {currentGachaCard.isDuplicate && currentGachaCard.redrawsUsed < currentGachaCard.maxRedraws ? (
            <>
              <button 
                onClick={handleRedraw}
                className="w-full md:w-auto px-4 py-3 md:px-8 md:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl md:rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/40 text-sm md:text-base whitespace-nowrap"
              >
                再抽選する
              </button>
              <button 
                onClick={() => handleKeepCard('next')}
                className="w-full md:w-auto px-4 py-3 md:px-8 md:py-4 bg-theme-card/20 text-white rounded-xl md:rounded-2xl font-bold hover:bg-theme-card/30 transition-all text-sm md:text-base whitespace-nowrap"
              >
                このまま獲得
              </button>
            </>
          ) : gachaQueue > 0 ? (
            <>
              <button 
                onClick={() => handleKeepCard('next')}
                className="w-full md:w-auto px-4 py-3 md:px-12 md:py-4 bg-theme-accent text-white rounded-xl md:rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-theme-accent/40 text-sm md:text-base whitespace-nowrap order-first md:order-last"
              >
                続けて引く
              </button>
              <button 
                disabled
                className="w-full md:w-auto px-4 py-3 md:px-8 md:py-4 bg-white/5 text-white/20 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/10 text-sm md:text-base whitespace-nowrap cursor-not-allowed"
              >
                コレクションで見る <ArrowRight size={16} className="md:w-[18px] md:h-[18px] shrink-0" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleKeepCard('close')}
                className="w-full md:w-auto px-4 py-3 md:px-12 md:py-4 bg-theme-card text-black rounded-xl md:rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl text-sm md:text-base whitespace-nowrap"
              >
                結果を閉じる
              </button>
              <button 
                onClick={() => handleKeepCard('collection')}
                className="w-full md:w-auto px-4 py-3 md:px-8 md:py-4 bg-theme-card/10 hover:bg-theme-card/20 text-white rounded-xl md:rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-white/20 text-sm md:text-base whitespace-nowrap"
              >
                コレクションで見る <ArrowRight size={16} className="md:w-[18px] md:h-[18px] shrink-0" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
