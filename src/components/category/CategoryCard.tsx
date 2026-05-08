import React from 'react';
import { SubcategoryButton } from './SubcategoryButton';
import { CreditCard, ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: any;
  getStatsFor: (id: string) => { highScore: number; attempts: number };
  startQuiz: (category: any) => void;
  isLoading: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  getStatsFor,
  startQuiz,
  isLoading
}) => {
  const catStats = getStatsFor(category.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-theme-border-strong pb-3 md:pb-2 gap-3 md:gap-0">
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
          <h3 className="text-lg md:text-xl font-bold text-theme-accent">
            {category.title}
          </h3>
          <div className="flex gap-3 text-[10px] font-bold text-theme-text-muted uppercase tracking-wider">
            <span>Best: {catStats.highScore.toLocaleString()}</span>
            <span>Cleared: {catStats.attempts}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="flex items-center gap-1.5 text-[10px] font-black bg-theme-secondary/20 text-theme-secondary border border-theme-secondary/30 px-2 py-0.5 rounded-full uppercase">
              <CreditCard size={12} /> CARD x2
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-black bg-amber-400/20 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">
              PERFECT +1
            </span>
          </div>
          <button
            onClick={() => startQuiz(category)}
            className="text-xs md:text-sm font-bold bg-theme-accent text-white px-4 py-2 md:py-1.5 rounded-xl hover:bg-black transition-all flex items-center gap-2 group shadow-sm hover:shadow-md"
          >
            <span className="sm:hidden text-[10px] opacity-70">5問</span>
            単元演習
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {category.subcategories.map((sub: any) => {
          const s = getStatsFor(sub.id);
          return (
            <SubcategoryButton
              key={sub.id}
              sub={sub}
              isLoading={isLoading}
              highScore={s.highScore}
              attempts={s.attempts}
              onClick={() => startQuiz(sub)}
            />
          );
        })}
      </div>
    </div>
  );
};
