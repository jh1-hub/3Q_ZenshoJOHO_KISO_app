import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Zap, Trophy, ChevronRight, BookOpen } from 'lucide-react';

interface CategorySelectViewProps {
  setGameState: (state: any) => void;
  hasBonusTicket: boolean;
  startSpeedStar: () => void;
  isLoading: boolean;
  speedStarMaxCorrect: number;
  speedStarMaxCombo: number;
  startComprehensiveQuiz: () => void;
  quizCategories: any[];
  getStatsFor: (id: string) => { highScore: number; attempts: number };
  startQuiz: (category: any) => void;
}

export const CategorySelectView: React.FC<CategorySelectViewProps> = ({
  setGameState,
  hasBonusTicket,
  startSpeedStar,
  isLoading,
  speedStarMaxCorrect,
  speedStarMaxCombo,
  startComprehensiveQuiz,
  quizCategories,
  getStatsFor,
  startQuiz
}) => {
  return (
    <motion.div 
      key="categories"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto p-6 py-12"
    >
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => setGameState('START')}
          className="p-3 bg-theme-card rounded-2xl border border-theme-border hover:bg-theme-muted transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-3xl font-theme-heading font-bold">単元を選択</h2>
      </div>

      {/* Speed Star Mode Button */}
      {hasBonusTicket && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startSpeedStar}
          disabled={isLoading}
          className="w-full mb-6 p-6 md:p-8 bg-black text-amber-400 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 group overflow-hidden relative border-2 border-amber-400"
        >
          <div className="relative z-10 flex items-center gap-4 md:gap-6">
            <div className="p-3 md:p-4 bg-amber-400/10 rounded-2xl backdrop-blur-md">
              <Zap size={28} className="text-amber-400 md:w-8 md:h-8 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl md:text-2xl font-bold">SPEED STAR</h3>
                <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded-full font-black uppercase">Bonus Game</span>
              </div>
              <p className="text-sm md:text-base text-amber-400/60">全単元からランダムに出題。スピード勝負！</p>
              <div className="flex gap-4 mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-400/40">
                <span>Best Correct: {speedStarMaxCorrect}</span>
                <span>Max Combo: {speedStarMaxCombo}</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2 font-bold text-base md:text-lg self-end md:self-auto">
            挑戦する <ChevronRight className="group-hover:translate-x-2 transition-transform" />
          </div>
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl"
          />
        </motion.button>
      )}

      {/* Comprehensive Mode Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={startComprehensiveQuiz}
        disabled={isLoading}
        className="w-full mb-8 md:mb-12 p-6 md:p-8 bg-gradient-to-r from-[#141414] to-[#5A5A40] text-white rounded-[2rem] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 group overflow-hidden relative"
      >
        <div className="relative z-10 flex items-center gap-4 md:gap-6">
          <div className="p-3 md:p-4 bg-theme-card/10 rounded-2xl backdrop-blur-md">
            <Trophy size={28} className="text-theme-secondary md:w-8 md:h-8" />
          </div>
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-1">総合演習</h3>
            <p className="text-sm md:text-base text-white/60">全単元からランダムに20問出題されます</p>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2 font-bold text-base md:text-lg self-end md:self-auto">
          挑戦する <ChevronRight className="group-hover:translate-x-2 transition-transform" />
        </div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute -right-10 -bottom-10 w-64 h-64 bg-theme-card rounded-full blur-3xl"
        />
      </motion.button>

      <div className="space-y-12">
        {quizCategories.map((category) => (
          <div key={category.id} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-theme-border-strong pb-3 md:pb-2 gap-3 md:gap-0">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <h3 className="text-lg md:text-xl font-bold text-theme-accent">
                  {category.title}
                </h3>
                <div className="flex gap-3 text-[10px] font-bold text-theme-text-muted uppercase tracking-wider">
                  <span>Best: {getStatsFor(category.id).highScore.toLocaleString()}</span>
                  <span>Cleared: {getStatsFor(category.id).attempts}</span>
                </div>
              </div>
              <button
                onClick={() => startQuiz(category)}
                className="text-xs md:text-sm font-bold bg-theme-accent text-white px-4 py-2 md:py-1 rounded-full hover:bg-black transition-colors self-start md:self-auto"
              >
                単元演習を開始
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.subcategories.map((sub: any) => (
                <button
                  key={sub.id}
                  onClick={() => startQuiz(sub)}
                  disabled={isLoading}
                  className="flex items-center justify-between p-4 md:p-6 bg-theme-card rounded-2xl border border-theme-border shadow-sm hover:shadow-md hover:border-theme-accent transition-all text-left group"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-theme-bg rounded-xl group-hover:bg-theme-accent group-hover:text-white transition-colors">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm md:text-base">{sub.title}</p>
                      <div className="flex gap-3 text-[9px] md:text-[10px] font-bold text-theme-text-muted uppercase tracking-wider mt-1">
                        <span>Best: {getStatsFor(sub.id).highScore.toLocaleString()}</span>
                        <span>Cleared: {getStatsFor(sub.id).attempts}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-theme-text-muted group-hover:text-theme-accent transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
