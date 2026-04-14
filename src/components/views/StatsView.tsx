import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, BarChart, Camera, UserCheck, 
  Trophy, RotateCcw, Zap, Database, AlertCircle, ChevronRight
} from 'lucide-react';

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
  getCategoryColor,
  weakPoints
}) => {
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
        <section className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 text-theme-accent">
            <Trophy size={24} /> 総合演習
          </h3>
          <div className="bg-theme-card p-8 rounded-[2rem] shadow-sm border border-theme-border grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <p className="text-sm text-theme-text-muted font-bold uppercase tracking-wider">ハイスコア</p>
              <p className="text-3xl font-mono font-bold">{getStatsFor('all').highScore.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-theme-text-muted font-bold uppercase tracking-wider">演習回数</p>
              <p className="text-3xl font-mono font-bold">{getStatsFor('all').attempts}回</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-theme-text-muted font-bold uppercase tracking-wider">平均スコア</p>
              <p className="text-3xl font-mono font-bold">
                {getStatsFor('all').attempts > 0 
                  ? Math.floor(getStatsFor('all').totalScore / getStatsFor('all').attempts).toLocaleString() 
                  : 0}
              </p>
            </div>
          </div>
        </section>

        {/* Speed Star Stats */}
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
              <p className="text-3xl font-mono font-bold text-amber-400">{speedStarMaxCorrect}回</p>
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-sm text-amber-400/60 font-bold uppercase tracking-wider">最大コンボ</p>
              <p className="text-3xl font-mono font-bold text-amber-400">{speedStarMaxCombo} COMBO</p>
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-sm text-amber-400/60 font-bold uppercase tracking-wider">挑戦回数</p>
              <p className="text-3xl font-mono font-bold text-amber-400">{speedStarChallenges}回</p>
            </div>
          </div>
        </section>

        {/* Category Breakdown */}
        {quizCategories.map(category => (
          <section key={category.id} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-theme-border-strong pb-2 gap-2">
              <h3 className="text-xl font-bold text-theme-accent">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <span className="text-theme-text-muted">単元ハイスコア: <span className="text-black font-mono font-bold">{getStatsFor(category.id).highScore.toLocaleString()}</span></span>
                <span className="text-theme-text-muted">演習回数: <span className="text-black font-mono font-bold">{getStatsFor(category.id).attempts}回</span></span>
                <span className="text-theme-text-muted">平均スコア: <span className="text-black font-mono font-bold">
                  {getStatsFor(category.id).attempts > 0 
                    ? Math.floor(getStatsFor(category.id).totalScore / getStatsFor(category.id).attempts).toLocaleString() 
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
        ))}

        {/* Weak Points Section */}
        {weakPoints.length > 0 && (
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
        )}
      </div>
    </motion.div>
  );
};
