import React from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, Zap, ChevronRight, LayoutGrid, 
  BarChart, BookOpen, Trophy, RotateCcw, Database,
  UserCheck, Camera, Sparkles
} from 'lucide-react';
import { Rarity, quizCategories } from '../../data/quizData';

interface StartViewProps {
  isDailyChallengeCompleted: boolean;
  startDailyChallenge: () => void;
  dailyStreak: number;
  hasBonusTicket: boolean;
  startSpeedStar: () => void;
  setGameState: (state: any) => void;
  rarityOwned: Record<Rarity, number>;
  rarityTotals: Record<Rarity, number>;
  rarityTotalCopies: Record<Rarity, number>;
  rarityOwnedCopies: Record<Rarity, number>;
  hasAnyDuplicate: boolean;
  getRarityStyles: (rarity: Rarity) => any;
  takeScreenshot: () => void;
  userLevel: number;
  userName: string | null;
  userProfile: { grade: string; classNum: string; attendanceNum: string } | null;
  getStatsFor: (id: string) => { highScore: number; attempts: number; totalScore: number };
  getCategoryColor: (id: string) => any;
}

export const StartView: React.FC<StartViewProps> = ({
  isDailyChallengeCompleted,
  startDailyChallenge,
  dailyStreak,
  hasBonusTicket,
  startSpeedStar,
  setGameState,
  rarityOwned,
  rarityTotals,
  rarityTotalCopies,
  rarityOwnedCopies,
  hasAnyDuplicate,
  getRarityStyles,
  takeScreenshot,
  userLevel,
  userName,
  userProfile,
  getStatsFor,
  getCategoryColor
}) => {
  return (
    <motion.div 
      key="start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center relative"
    >
      <div className="mb-8 relative mt-12 md:mt-0">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="bg-theme-accent p-6 rounded-3xl shadow-xl"
        >
          <BrainCircuit size={80} className="text-white" />
        </motion.div>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-4 -right-4 bg-theme-secondary text-white p-3 rounded-full shadow-lg"
        >
          <Zap size={24} />
        </motion.div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-theme-heading font-bold mb-4 tracking-tight">
        IT Quiz <span className="italic text-theme-accent">Master</span>
        <span className="block text-2xl md:text-3xl mt-2 font-sans font-medium text-theme-text-muted">【情報基礎】の知識を極めよう</span>
      </h1>
      
      <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 w-full max-w-6xl px-4">
        {!isDailyChallengeCompleted && (
          <button 
            onClick={startDailyChallenge}
            className="group relative px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full text-lg md:text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(124,58,237,0.5)] flex-1 min-w-[200px] max-w-xs border-2 border-white/20"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Sparkles size={24} className="text-amber-300 animate-pulse" /> Daily Challenge <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            {dailyStreak > 0 && (
              <div className="absolute -top-1 -right-1 bg-amber-400 text-black text-[10px] px-2 py-0.5 rounded-full font-black shadow-sm">
                {dailyStreak} DAY STREAK!
              </div>
            )}
          </button>
        )}

        {hasBonusTicket && (
          <button 
            onClick={startSpeedStar}
            className="group relative px-8 md:px-10 py-4 md:py-5 bg-black text-amber-400 border-2 border-amber-400 rounded-full text-lg md:text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl flex-1 min-w-[200px] max-w-xs"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Zap size={24} className="animate-pulse" /> SPEED STAR <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-amber-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        )}

        <button 
          onClick={() => setGameState('CATEGORY_SELECT')}
          className="group relative px-8 md:px-10 py-4 md:py-5 bg-theme-text text-theme-bg text-white rounded-full text-lg md:text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl flex-1 min-w-[200px] max-w-xs"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            Start Challenge <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-theme-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>

        <button 
          onClick={() => setGameState('COLLECTION')}
          className="group relative px-8 md:px-10 py-4 md:py-5 bg-theme-card text-[#141414] border-2 border-theme-border-strong rounded-full text-lg md:text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg flex-1 min-w-[200px] max-w-xs"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            Card Collection <LayoutGrid size={24} />
          </span>
        </button>

        <button 
          onClick={() => setGameState('STATS')}
          className="md:hidden group relative px-8 md:px-10 py-4 md:py-5 bg-theme-card text-theme-accent border-2 border-theme-accent/20 rounded-full text-lg md:text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg flex-1 min-w-[200px] max-w-xs"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            学習成績 <BarChart size={24} />
          </span>
        </button>

        <button 
          onClick={() => setGameState('STORY')}
          className="group relative px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white border-2 border-slate-700 rounded-full text-lg md:text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg flex-1 min-w-[200px] max-w-xs"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            STORY <BookOpen size={24} className="text-amber-400" />
          </span>
          <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>

      {/* Collection Progress Section */}
      <button 
        onClick={() => setGameState('COLLECTION')}
        className="mt-12 w-full max-w-3xl bg-theme-card p-6 md:p-8 rounded-3xl shadow-sm border border-theme-border text-left hover:border-theme-accent transition-all group"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-bold text-theme-text flex items-center gap-2">
            <LayoutGrid className="text-theme-accent group-hover:rotate-12 transition-transform" size={20} />
            Card collection status
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-bold text-theme-text-muted bg-theme-border px-3 py-1 rounded-full">
              {Object.values(rarityOwned).reduce((a, b) => (a as number) + (b as number), 0)} / {Object.values(rarityTotals).reduce((a, b) => (a as number) + (b as number), 0)}
            </span>
            <ChevronRight size={16} className="text-theme-text-muted group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {(['UR', 'SR', 'R', 'C'] as const).map(r => {
            const styles = getRarityStyles(r);
            const total = rarityTotals[r];
            const owned = rarityOwned[r];
            const totalCopies = rarityTotalCopies[r];
            const ownedCopies = rarityOwnedCopies[r];
            const percentage = total > 0 ? Math.round((owned / total) * 100) : 0;
            const copiesPercentage = totalCopies > 0 ? Math.round((ownedCopies / totalCopies) * 100) : 0;
            return (
              <div key={r} className="flex flex-col p-3 md:p-4 rounded-2xl bg-theme-muted border border-theme-border relative overflow-hidden">
                <div className={`absolute -right-4 -bottom-4 opacity-5 ${styles.textColor}`}>
                  <Trophy size={64} />
                </div>
                <div className="flex justify-between items-end mb-3 relative z-10">
                  <span className={`text-lg md:text-xl font-black tracking-wider ${styles.textColor} drop-shadow-sm`}>{r}</span>
                </div>
                <div className="space-y-3 relative z-10">
                  {hasAnyDuplicate ? (
                    <>
                      <div>
                        <div className="flex justify-between text-[10px] md:text-xs mb-1">
                          <span className="text-theme-text-muted font-bold">種類</span>
                          <span><span className="font-bold text-theme-text">{owned}</span> <span className="text-theme-text-muted">/ {total}</span></span>
                        </div>
                        <div className="w-full bg-theme-border-strong rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full rounded-full ${styles.bg}`} 
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] md:text-xs mb-1">
                          <span className="text-theme-text-muted font-bold">枚数(最大3)</span>
                          <span><span className="font-bold text-theme-text">{ownedCopies}</span> <span className="text-theme-text-muted">/ {totalCopies}</span></span>
                        </div>
                        <div className="w-full bg-theme-border-strong rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${copiesPercentage}%` }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className={`h-full rounded-full ${styles.bg} opacity-50`} 
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="flex justify-between text-[10px] md:text-xs mb-1">
                        <span className="text-theme-text-muted font-bold">収集率</span>
                        <span><span className="font-bold text-theme-text">{owned}</span> <span className="text-theme-text-muted">/ {total}</span></span>
                      </div>
                      <div className="w-full bg-theme-border-strong rounded-full h-1.5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full rounded-full ${styles.bg}`} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </button>

      {/* Desktop Stats Button */}
      <div className="hidden md:block w-full max-w-3xl mt-6">
        <button 
          onClick={() => setGameState('STATS')}
          className="w-full group relative p-6 bg-theme-card border-2 border-theme-accent/20 rounded-[2rem] text-xl font-bold overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-theme-accent/10 rounded-2xl text-theme-accent group-hover:scale-110 transition-transform">
              <BarChart size={32} />
            </div>
            <div className="text-left">
              <span className="block text-2xl font-bold text-theme-accent">学習成績を確認</span>
              <span className="block text-sm text-theme-text-muted font-medium mt-1">詳細なスコアや進捗をチェック</span>
            </div>
          </div>
          <ChevronRight size={32} className="text-theme-accent group-hover:translate-x-2 transition-transform" />
          <div className="absolute inset-0 bg-theme-accent/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
        </button>
      </div>

      {/* Statistics Section */}
      <div className="mt-20 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-theme-heading font-bold flex items-center gap-3">
            <BarChart className="text-theme-accent" /> 学習状況
          </h2>
          <button 
            onClick={takeScreenshot}
            className="text-[10px] md:text-sm font-bold text-theme-accent hover:text-white hover:bg-theme-accent transition-all duration-300 flex items-center gap-2 bg-theme-accent/10 px-3 py-1.5 md:px-6 md:py-3 rounded-full border border-theme-accent/20 hover:shadow-lg"
          >
            <Camera size={14} className="md:w-4 md:h-4" /> 提出
          </button>
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

        <div className="space-y-6 mb-12">
          {/* Comprehensive Stats */}
          <div className="bg-theme-card p-8 rounded-[2.5rem] shadow-sm border border-theme-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Trophy size={120} />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-center md:justify-between gap-8 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-xs font-bold text-theme-text-muted uppercase tracking-widest mb-2">総合演習（全単元）</p>
                <h3 className="text-3xl font-theme-heading font-bold">現在の成績</h3>
              </div>

              <div className="flex flex-wrap justify-center md:justify-end gap-8 md:gap-16">
                <div className="space-y-1 text-center md:text-left">
                  <p className="text-sm text-theme-text-muted flex items-center justify-center md:justify-start gap-2">
                    <Trophy size={14} className="text-amber-500" /> ハイスコア
                  </p>
                  <p className="text-3xl font-mono font-bold tracking-tight">{getStatsFor('all').highScore.toLocaleString()}</p>
                </div>
                <div className="space-y-1 text-center md:text-left">
                  <p className="text-sm text-theme-text-muted flex items-center justify-center md:justify-start gap-2">
                    <RotateCcw size={14} className="text-theme-accent" /> 演習回数
                  </p>
                  <p className="text-3xl font-mono font-bold tracking-tight">{getStatsFor('all').attempts}<span className="text-sm ml-1 font-sans">回</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizCategories.map(cat => (
              <div key={cat.id} className="bg-theme-card p-6 rounded-3xl shadow-sm border border-theme-border relative overflow-hidden group">
                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform ${getCategoryColor(cat.id).text}`}>
                  <Database size={48} />
                </div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${getCategoryColor(cat.id).text}`}>{cat.title}</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-theme-text-muted">ハイスコア</span>
                    <span className="text-xl font-mono font-bold">{getStatsFor(cat.id).highScore.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-theme-text-muted">演習回数</span>
                    <span className="text-xl font-mono font-bold">{getStatsFor(cat.id).attempts}回</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
