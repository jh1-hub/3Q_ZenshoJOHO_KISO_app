import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

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
          <p className="font-bold text-sm md:text-base">{sub.title}</p>
          <div className="flex gap-3 text-[9px] md:text-[10px] font-bold text-theme-text-muted uppercase tracking-wider mt-1">
            <span>Best: {highScore.toLocaleString()}</span>
            <span>Cleared: {attempts}</span>
          </div>
        </div>
      </div>
      <ChevronRight size={20} className="text-theme-text-muted group-hover:text-theme-accent transition-colors flex-shrink-0" />
    </button>
  );
};
