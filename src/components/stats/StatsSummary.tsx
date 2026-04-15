import React from 'react';
import { Trophy } from 'lucide-react';

interface StatsSummaryProps {
  highScore: number;
  attempts: number;
  totalScore: number;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  highScore,
  attempts,
  totalScore
}) => {
  return (
    <section className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2 text-theme-accent">
        <Trophy size={24} /> 総合演習
      </h3>
      <div className="bg-theme-card p-8 rounded-[2rem] shadow-sm border border-theme-border grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <p className="text-sm text-theme-text-muted font-bold uppercase tracking-wider">ハイスコア</p>
          <p className="text-3xl font-mono font-bold">{highScore.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-theme-text-muted font-bold uppercase tracking-wider">演習回数</p>
          <p className="text-3xl font-mono font-bold">{attempts}回</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-theme-text-muted font-bold uppercase tracking-wider">平均スコア</p>
          <p className="text-3xl font-mono font-bold">
            {attempts > 0 ? Math.floor(totalScore / attempts).toLocaleString() : 0}
          </p>
        </div>
      </div>
    </section>
  );
};
