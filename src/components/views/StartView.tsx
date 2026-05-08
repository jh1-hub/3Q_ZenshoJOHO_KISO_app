import React from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, Zap, ChevronRight, LayoutGrid, 
  BarChart, BookOpen, Sparkles
} from 'lucide-react';
import { Rarity } from '../../types';
import { CollectionProgress } from '../start/CollectionProgress';
import { StartStats } from '../start/StartStats';

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
  quizCategories: any[];
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
  getCategoryColor,
  quizCategories
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
      <CollectionProgress
        rarityOwned={rarityOwned}
        rarityTotals={rarityTotals}
        rarityTotalCopies={rarityTotalCopies}
        rarityOwnedCopies={rarityOwnedCopies}
        hasAnyDuplicate={hasAnyDuplicate}
        getRarityStyles={getRarityStyles}
        setGameState={setGameState}
      />

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
      <StartStats
        takeScreenshot={takeScreenshot}
        userLevel={userLevel}
        userName={userName}
        userProfile={userProfile}
        getStatsFor={getStatsFor}
        quizCategories={quizCategories}
        getCategoryColor={getCategoryColor}
      />
    </motion.div>
  );
};
