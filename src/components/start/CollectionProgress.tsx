import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ChevronRight, Trophy } from 'lucide-react';
import { Rarity } from '../../data/quizData';

interface CollectionProgressProps {
  rarityOwned: Record<Rarity, number>;
  rarityTotals: Record<Rarity, number>;
  rarityTotalCopies: Record<Rarity, number>;
  rarityOwnedCopies: Record<Rarity, number>;
  hasAnyDuplicate: boolean;
  getRarityStyles: (rarity: Rarity) => any;
  setGameState: (state: any) => void;
}

export const CollectionProgress: React.FC<CollectionProgressProps> = ({
  rarityOwned,
  rarityTotals,
  rarityTotalCopies,
  rarityOwnedCopies,
  hasAnyDuplicate,
  getRarityStyles,
  setGameState
}) => {
  const totalOwned = Object.values(rarityOwned).reduce((a, b) => (a as number) + (b as number), 0);
  const totalPossible = Object.values(rarityTotals).reduce((a, b) => (a as number) + (b as number), 0);

  return (
    <button 
      onClick={() => setGameState('COLLECTION')}
      className="mt-12 w-full max-w-3xl bg-theme-card p-6 md:p-8 rounded-3xl shadow-sm border border-theme-border text-left hover:border-theme-accent transition-all group"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-bold text-theme-text flex items-center gap-2">
          <LayoutGrid className="text-theme-accent group-hover:rotate-12 transition-transform" size={20} />
          Card collection status
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm font-bold text-theme-text-muted bg-theme-border px-3 py-1 rounded-full">
            {totalOwned} / {totalPossible}
          </span>
          <ChevronRight size={16} className="text-theme-text-muted group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {(['UR', 'SR', 'R', 'C'] as const).map(r => {
          const styles = getRarityStyles(r);
          const total = rarityTotals[r];
          const owned = rarityOwned[r];
          const totalCopies = rarityTotalCopies[r];
          const ownedCopies = rarityOwnedCopies[r];
          const percentage = total > 0 ? Math.round((owned / total) * 100) : 0;
          const copiesPercentage = totalCopies > 0 ? Math.round((ownedCopies / totalCopies) * 100) : 0;
          return (
            <div key={r} className="flex flex-col p-3 md:p-4 rounded-2xl bg-theme-muted border border-theme-border relative overflow-hidden">
              <div className={`absolute -right-4 -bottom-4 opacity-5 ${styles.textColor}`}>
                <Trophy size={64} />
              </div>
              <div className="flex justify-between items-end mb-3 relative z-10">
                <span className={`text-lg md:text-xl font-black tracking-wider ${styles.textColor} drop-shadow-sm`}>{r}</span>
              </div>
              <div className="space-y-3 relative z-10">
                {hasAnyDuplicate ? (
                  <>
                    <div>
                      <div className="flex justify-between text-[10px] md:text-xs mb-1">
                        <span className="text-theme-text-muted font-bold">種類</span>
                        <span><span className="font-bold text-theme-text">{owned}</span> <span className="text-theme-text-muted">/ {total}</span></span>
                      </div>
                      <div className="w-full bg-theme-border-strong rounded-full h-1.5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full rounded-full ${styles.bg}`} 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] md:text-xs mb-1">
                        <span className="text-theme-text-muted font-bold">枚数(最大3)</span>
                        <span><span className="font-bold text-theme-text">{ownedCopies}</span> <span className="text-theme-text-muted">/ {totalCopies}</span></span>
                      </div>
                      <div className="w-full bg-theme-border-strong rounded-full h-1.5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${copiesPercentage}%` }}
                          transition={{ duration: 1, delay: 0.4 }}
                          className={`h-full rounded-full ${styles.bg} opacity-50`} 
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="flex justify-between text-[10px] md:text-xs mb-1">
                      <span className="text-theme-text-muted font-bold">収集率</span>
                      <span><span className="font-bold text-theme-text">{owned}</span> <span className="text-theme-text-muted">/ {total}</span></span>
                    </div>
                    <div className="w-full bg-theme-border-strong rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full ${styles.bg}`} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </button>
  );
};
