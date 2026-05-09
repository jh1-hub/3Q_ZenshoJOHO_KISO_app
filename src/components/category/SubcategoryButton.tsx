import React from 'react';
import { BookOpen, ChevronRight, CreditCard } from 'lucide-react';

interface SubcategoryButtonProps {
  sub: any;
  isLoading: boolean;
  highScore: number;
  attempts: number;
  onClick: () => void;
}

export const SubcategoryButton: React.FC<SubcategoryButtonProps> = ({
  sub,
  isLoading,
  highScore,
  attempts,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center justify-between p-4 md:p-6 bg-theme-card rounded-2xl border border-theme-border shadow-sm hover:shadow-md hover:border-theme-accent transition-all text-left group"
    >
      <div className="flex items-center gap-3 md:gap-4">
        <div className="p-2 md:p-3 bg-theme-bg rounded-xl group-hover:bg-theme-accent group-hover:text-white transition-colors">
          <BookOpen size={20} />
        </div>
        <div>
          <p className="font-bold text-sm md:text-base pr-8">{sub.title}</p>
          <div className="flex flex-wrap gap-2 md:gap-3 text-[9px] md:text-[10px] font-bold text-theme-text-muted uppercase tracking-wider mt-1.5">
            <span className="flex items-center gap-1 bg-theme-bg px-2 py-0.5 rounded-lg border border-theme-border">Best: {highScore.toLocaleString()}</span>
            <span className="flex items-center gap-1 bg-theme-bg px-2 py-0.5 rounded-lg border border-theme-border">Cleared: {attempts}</span>
            <span className="flex items-center gap-1 bg-theme-secondary/20 text-theme-secondary px-2 py-0.5 rounded-lg border border-theme-secondary/30">
              <CreditCard size={10} /> CARD x1
            </span>
          </div>
        </div>
      </div>
      <ChevronRight size={20} className="text-theme-text-muted group-hover:text-theme-accent transition-colors flex-shrink-0" />
    </button>
  );
};
