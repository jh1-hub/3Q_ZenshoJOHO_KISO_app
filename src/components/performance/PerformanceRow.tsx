import React from 'react';

interface PerformanceRowProps {
  termName: string;
  stat: { correct: number; total: number };
  rate: number;
  ownedCount: number;
  descriptions: string[];
  currentIndex: number;
  onRowClick: () => void;
}

export const PerformanceRow: React.FC<PerformanceRowProps> = ({
  termName,
  stat,
  rate,
  ownedCount,
  descriptions,
  currentIndex,
  onRowClick
}) => {
  const isOwned = ownedCount > 0;

  return (
    <tr 
      className={`transition-colors ${isOwned && ownedCount > 1 ? 'hover:bg-theme-muted/50 cursor-pointer' : 'hover:bg-theme-muted/30'}`}
      onClick={onRowClick}
    >
      <td className="p-4 md:p-6 text-center align-middle">
        <div className={`inline-flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${
          stat.total === 0 ? 'bg-theme-muted text-theme-text-muted' :
          rate < 40 ? 'bg-red-50 text-red-600 border border-red-100' :
          rate < 70 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
          'bg-emerald-50 text-emerald-600 border border-emerald-100'
        }`}>
          <span className="text-sm md:text-lg font-mono font-bold leading-none">{rate.toFixed(1)}</span>
          <span className="text-[8px] font-bold uppercase mt-1">%</span>
        </div>
      </td>
      <td className="p-4 md:p-6 align-top">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm md:text-base">
              {termName}
            </span>
          </div>
          <div className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase w-fit ${
            isOwned ? 'bg-theme-accent/10 text-theme-accent' : 'bg-theme-muted text-theme-text-muted'
          }`}>
            {isOwned ? `x${ownedCount}` : '未所持'}
          </div>
        </div>
      </td>
      <td className="p-4 md:p-6 align-top">
        <div className="space-y-3">
          <p className="text-xs md:text-sm text-theme-text leading-relaxed">
            {descriptions[currentIndex]}
          </p>
        </div>
      </td>
      <td className="p-4 md:p-6 text-center align-middle">
        <div className="space-y-1">
          <p className="text-xs md:text-sm font-mono font-bold">{stat.correct} / {stat.total}</p>
          <p className="text-[8px] md:text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">Correct / Total</p>
        </div>
      </td>
    </tr>
  );
};
