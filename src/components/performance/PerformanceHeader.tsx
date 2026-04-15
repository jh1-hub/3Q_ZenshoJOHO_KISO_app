import React from 'react';
import { ChevronLeft, BarChart, RotateCcw } from 'lucide-react';

interface PerformanceHeaderProps {
  setGameState: (state: any) => void;
  termSortOrder: 'asc' | 'desc' | null;
  setTermSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc' | null>>;
}

export const PerformanceHeader: React.FC<PerformanceHeaderProps> = ({
  setGameState,
  termSortOrder,
  setTermSortOrder
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setGameState('STATS')}
          className="p-3 bg-theme-card rounded-2xl border border-theme-border hover:bg-theme-muted transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl md:text-4xl font-theme-heading font-bold mb-1 md:mb-2">用語別分析</h2>
          <p className="text-xs md:text-sm text-theme-text-muted">すべての用語の正答率と学習状況を確認できます。</p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <button 
          onClick={() => {
            setTermSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
          }}
          className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full border text-xs md:text-sm font-bold transition-all ${
            termSortOrder 
              ? 'bg-theme-accent text-white border-theme-accent shadow-lg' 
              : 'bg-theme-card text-theme-text border-theme-border hover:bg-theme-muted'
          }`}
        >
          <BarChart size={16} className="md:w-[18px] md:h-[18px]" />
          正答率でソート {termSortOrder === 'asc' ? '（昇順）' : termSortOrder === 'desc' ? '（降順）' : ''}
        </button>
        {termSortOrder && (
          <button 
            onClick={() => {
              setTermSortOrder(null);
            }}
            className="p-2 md:p-3 bg-theme-muted rounded-full text-theme-text-muted hover:text-theme-text transition-colors"
            title="ソートを解除"
          >
            <RotateCcw size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        )}
      </div>
    </div>
  );
};
