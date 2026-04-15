import React from 'react';

interface CategoryStatsProps {
  category: any;
  getStatsFor: (id: string) => { highScore: number; attempts: number; totalScore: number };
}

export const CategoryStats: React.FC<CategoryStatsProps> = ({
  category,
  getStatsFor
}) => {
  const catStats = getStatsFor(category.id);
  
  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-theme-border-strong pb-2 gap-2">
        <h3 className="text-xl font-bold text-theme-accent">
          {category.title}
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <span className="text-theme-text-muted">単元ハイスコア: <span className="text-black font-mono font-bold">{catStats.highScore.toLocaleString()}</span></span>
          <span className="text-theme-text-muted">演習回数: <span className="text-black font-mono font-bold">{catStats.attempts}回</span></span>
          <span className="text-theme-text-muted">平均スコア: <span className="text-black font-mono font-bold">
            {catStats.attempts > 0 
              ? Math.floor(catStats.totalScore / catStats.attempts).toLocaleString() 
              : 0}
          </span></span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {category.subcategories.map((sub: any) => {
          const s = getStatsFor(sub.id);
          return (
            <div key={sub.id} className="bg-theme-card p-6 rounded-2xl border border-theme-border shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-bold">{sub.title}</p>
                <p className="text-xs text-theme-text-muted">演習回数: {s.attempts}回</p>
              </div>
              <div className="flex gap-8">
                <div className="text-right">
                  <p className="text-[10px] text-theme-text-muted font-bold uppercase tracking-tighter">Avg Score</p>
                  <p className="text-lg font-mono font-bold text-theme-text-muted">
                    {s.attempts > 0 ? Math.floor(s.totalScore / s.attempts).toLocaleString() : 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-theme-text-muted font-bold uppercase tracking-tighter">High Score</p>
                  <p className="text-xl font-mono font-bold">{s.highScore.toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
