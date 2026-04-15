import React from 'react';

interface ResultStatsProps {
  score: number;
  maxCombo: number;
}

export const ResultStats: React.FC<ResultStatsProps> = ({
  score,
  maxCombo
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
      <div className="p-4 md:p-6 bg-theme-bg rounded-2xl md:rounded-3xl">
        <p className="text-[10px] md:text-xs text-theme-text-muted uppercase font-bold mb-1">Total Score</p>
        <p className="text-2xl md:text-3xl font-mono font-bold">{score.toLocaleString()}</p>
      </div>
      <div className="p-4 md:p-6 bg-theme-bg rounded-2xl md:rounded-3xl">
        <p className="text-[10px] md:text-xs text-theme-text-muted uppercase font-bold mb-1">Max Combo</p>
        <p className="text-2xl md:text-3xl font-mono font-bold">{maxCombo}</p>
      </div>
    </div>
  );
};
