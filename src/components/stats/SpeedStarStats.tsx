import React from 'react';
import { Zap } from 'lucide-react';

interface SpeedStarStatsProps {
  maxCorrect: number;
  maxCombo: number;
  challenges: number;
}

export const SpeedStarStats: React.FC<SpeedStarStatsProps> = ({
  maxCorrect,
  maxCombo,
  challenges
}) => {
  return (
    <section className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2 text-amber-500">
        <Zap size={24} /> SPEED STAR
      </h3>
      <div className="bg-black p-8 rounded-[2rem] shadow-xl border border-amber-400/30 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap size={120} className="text-amber-400" />
        </div>
        <div className="space-y-1 relative z-10">
          <p className="text-sm text-amber-400/60 font-bold uppercase tracking-wider">最高正答数</p>
          <p className="text-3xl font-mono font-bold text-amber-400">{maxCorrect}回</p>
        </div>
        <div className="space-y-1 relative z-10">
          <p className="text-sm text-amber-400/60 font-bold uppercase tracking-wider">最大コンボ</p>
          <p className="text-3xl font-mono font-bold text-amber-400">{maxCombo} COMBO</p>
        </div>
        <div className="space-y-1 relative z-10">
          <p className="text-sm text-amber-400/60 font-bold uppercase tracking-wider">挑戦回数</p>
          <p className="text-3xl font-mono font-bold text-amber-400">{challenges}回</p>
        </div>
      </div>
    </section>
  );
};
