import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';

interface WeakPointsStatsProps {
  weakPoints: { name: string; rate: number; correct: number; total: number }[];
  setGameState: (state: any) => void;
}

export const WeakPointsStats: React.FC<WeakPointsStatsProps> = ({
  weakPoints,
  setGameState
}) => {
  if (weakPoints.length === 0) return null;

  return (
    <section className="space-y-6 mt-12">
      <div className="flex items-center justify-between border-b border-theme-border-strong pb-2">
        <h3 className="text-xl font-bold text-red-500 flex items-center gap-2 uppercase tracking-tighter">
          <AlertCircle size={24} /> weak point 3
        </h3>
        <button 
          onClick={() => setGameState('TERM_PERFORMANCE')}
          className="text-sm font-bold text-theme-accent hover:underline flex items-center gap-1"
        >
          詳細データ <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weakPoints.slice(0, 3).map((wp, idx) => (
          <div key={wp.name} className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <span className="text-4xl font-black text-red-900">#{idx + 1}</span>
            </div>
            <p className="font-bold text-red-900 mb-1 truncate pr-8">{wp.name}</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-mono font-bold text-red-600">{wp.rate.toFixed(1)}%</p>
              <p className="text-[10px] text-red-400 font-bold mb-1 uppercase tracking-tighter">Correct Rate</p>
            </div>
            <p className="text-xs text-red-400 mt-2">正解: {wp.correct} / 出題: {wp.total}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
