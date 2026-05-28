import React from 'react';
import { SubcategoryButton } from '../category/SubcategoryButton';
import { CreditCard, Play } from 'lucide-react';

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-theme-border-strong pb-4 mb-2 mt-4 gap-4 md:gap-0">
        <div className="flex flex-col gap-1.5 pr-4">
          <h3 className="text-xl md:text-2xl font-black text-theme-text tracking-tight leading-tight">
            {category.title}
          </h3>
          <div className="flex gap-3 text-[10px] md:text-xs font-bold text-theme-text-muted uppercase tracking-wider">
            <span>Best: {catStats.highScore.toLocaleString()}</span>
            <span>Cleared: {catStats.attempts}</span>
          </div>
        </div>
        
        <button
          onClick={() => startQuiz(category)}
          disabled={isLoading}
          className="w-full md:w-auto text-left relative group overflow-hidden bg-theme-bg border-2 border-theme-border rounded-xl transition-all hover:border-theme-accent shadow-sm hover:shadow-md active:scale-[0.98] flex-shrink-0"
        >
          <div className="absolute inset-0 bg-theme-accent/5 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
          <div className="relative px-3 py-2 md:px-4 md:py-2.5 flex items-center justify-between gap-4 md:gap-6">
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-black text-theme-text group-hover:text-theme-accent transition-colors">
                単元演習 <span className="text-xs font-bold opacity-60 ml-0.5">(5問)</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="flex items-center gap-0.5 text-[9px] md:text-[10px] font-black bg-theme-secondary/10 text-theme-secondary px-1.5 py-0.5 rounded border border-theme-secondary/20 uppercase leading-none">
                  <CreditCard size={10} /> CARD x2
                </span>
                <span className="flex items-center gap-0.5 text-[9px] md:text-[10px] font-black bg-amber-400/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-400/20 uppercase leading-none">
                  PERFECT +1
                </span>
              </div>
            </div>
            <div className="bg-white group-hover:bg-theme-accent text-theme-text-muted group-hover:text-white border border-theme-border group-hover:border-theme-accent p-2 rounded-lg transition-colors shadow-sm">
              <Play size={16} fill="currentColor" className="ml-0.5" />
            </div>
          </div>
        </button>
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
