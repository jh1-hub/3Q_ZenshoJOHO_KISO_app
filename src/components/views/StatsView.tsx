import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, BarChart, Camera, UserCheck
} from 'lucide-react';
import { StatsSummary } from '../stats/StatsSummary';
import { SpeedStarStats } from '../stats/SpeedStarStats';
import { CategoryStats } from '../stats/CategoryStats';
import { WeakPointsStats } from '../stats/WeakPointsStats';

interface StatsViewProps {
  setGameState: (state: any) => void;
  statsRef: React.RefObject<HTMLDivElement>;
  takeScreenshot: () => void;
  userLevel: number;
  userName: string | null;
  userProfile: { grade: string; classNum: string; attendanceNum: string } | null;
  getStatsFor: (id: string) => { highScore: number; attempts: number; totalScore: number };
  speedStarMaxCorrect: number;
  speedStarMaxCombo: number;
  speedStarChallenges: number;
  quizCategories: any[];
  getCategoryColor: (id: string) => any;
  weakPoints: { name: string; rate: number; correct: number; total: number }[];
}

export const StatsView: React.FC<StatsViewProps> = ({
  setGameState,
  statsRef,
  takeScreenshot,
  userLevel,
  userName,
  userProfile,
  getStatsFor,
  speedStarMaxCorrect,
  speedStarMaxCombo,
  speedStarChallenges,
  quizCategories,
  weakPoints
}) => {
  const allStats = getStatsFor('all');

  return (
    <motion.div 
      key="stats"
      ref={statsRef}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto p-6 py-12 relative"
    >
      {/* Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center overflow-hidden rounded-[3rem]">
        <span className="text-6xl md:text-9xl font-bold text-theme-text select-none whitespace-nowrap rotate-[-20deg]">CONFIDENTIAL</span>
      </div>

      <div className="flex flex-nowrap items-center justify-between gap-2 md:gap-4 mb-12">
        <div className="flex items-center gap-2 md:gap-6 min-w-0">
          <button 
            onClick={() => setGameState('START')}
            className="p-2 md:p-3 bg-theme-card rounded-2xl border border-theme-border hover:bg-theme-muted transition-all shrink-0"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-theme-heading font-bold truncate">学習成績</h2>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button 
            onClick={() => setGameState('TERM_PERFORMANCE')}
            className="text-[10px] md:text-sm font-bold text-theme-accent hover:text-white hover:bg-theme-accent transition-all duration-300 flex items-center gap-1 bg-theme-accent/10 px-2 py-1 md:px-4 md:py-2 rounded-full border border-theme-accent/20"
          >
            <BarChart size={14} className="md:w-4 md:h-4" /> 詳細データ
          </button>
          <button 
            onClick={takeScreenshot}
            className="text-[10px] md:text-sm font-bold text-theme-accent hover:text-white hover:bg-theme-accent transition-all duration-300 flex items-center gap-2 bg-theme-accent/10 px-3 py-1.5 md:px-6 md:py-3 rounded-full border border-theme-accent/20 hover:shadow-lg"
          >
            <Camera size={14} className="md:w-4 md:h-4" /> 提出
          </button>
        </div>
      </div>

      {/* User Profile Summary */}
      <div className="bg-theme-accent/5 border border-theme-accent/20 rounded-3xl p-6 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-theme-accent text-white rounded-2xl flex items-center justify-center shadow-lg shadow-theme-accent/20">
            <UserCheck size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold text-theme-accent bg-theme-accent/10 px-2 py-0.5 rounded-full uppercase tracking-wider">User Profile</span>
              <span className="text-lg md:text-xl font-bold text-theme-accent bg-theme-accent/10 px-3 py-0.5 rounded-full shadow-sm">Lv.{userLevel}</span>
            </div>
            <h3 className="text-2xl font-bold">{userName}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-4 md:gap-12">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">学年</p>
            <p className="text-xl font-bold">{userProfile?.grade}年</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">クラス</p>
            <p className="text-xl font-bold">{userProfile?.classNum}組</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">出席番号</p>
            <p className="text-xl font-bold">{userProfile?.attendanceNum}番</p>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {/* Comprehensive Summary */}
        <StatsSummary
          highScore={allStats.highScore}
          attempts={allStats.attempts}
          totalScore={allStats.totalScore}
        />

        {/* Speed Star Stats */}
        <SpeedStarStats
          maxCorrect={speedStarMaxCorrect}
          maxCombo={speedStarMaxCombo}
          challenges={speedStarChallenges}
        />

        {/* Category Breakdown */}
        {quizCategories.map(category => (
          <CategoryStats
            key={category.id}
            category={category}
            getStatsFor={getStatsFor}
          />
        ))}

        {/* Weak Points Section */}
        <WeakPointsStats
          weakPoints={weakPoints}
          setGameState={setGameState}
        />
      </div>
    </motion.div>
  );
};
