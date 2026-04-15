import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Zap, LayoutGrid, RotateCcw } from 'lucide-react';
import { GachaRollingOverlay } from '../gacha/GachaRollingOverlay';
import { GachaResultOverlay } from '../gacha/GachaResultOverlay';

interface ResultViewProps {
  speedStarCorrectCount: number;
  selectedSubcategory: any;
  getGachaPullCount: () => number;
  isDailyChallenge: boolean;
  questions: any[];
  correctCount: number;
  gachaResults: any[];
  pullGacha: () => void;
  isGachaRolling: boolean;
  score: number;
  maxCombo: number;
  hasBonusTicket: boolean;
  startSpeedStar: () => void;
  resetQuizState: () => void;
  setGameState: (state: any) => void;
  startComprehensiveQuiz: () => void;
  startQuiz: (category: any) => void;
  currentGachaCard: any;
  getRarityStyles: (rarity: string) => any;
  allTermsMap: Record<string, any>;
  getTermIcon: (term: string, size: number) => React.ReactNode;
  quizCategories: any[];
  gachaHistory: any[];
  gachaQueue: number;
  handleRedraw: () => void;
  handleKeepCard: (action: 'next' | 'close' | 'collection') => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  speedStarCorrectCount,
  selectedSubcategory,
  getGachaPullCount,
  isDailyChallenge,
  questions,
  correctCount,
  gachaResults,
  pullGacha,
  isGachaRolling,
  score,
  maxCombo,
  hasBonusTicket,
  startSpeedStar,
  resetQuizState,
  setGameState,
  startComprehensiveQuiz,
  startQuiz,
  currentGachaCard,
  getRarityStyles,
  allTermsMap,
  getTermIcon,
  quizCategories,
  gachaHistory,
  gachaQueue,
  handleRedraw,
  handleKeepCard
}) => {
  return (
    <motion.div 
      key="result"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-2xl mx-auto p-4 md:p-6 py-8 md:py-12 text-center overflow-x-hidden"
    >
      <div className="bg-theme-card p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-theme-border mb-8">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="inline-block p-4 md:p-6 bg-theme-bg rounded-full mb-4 md:mb-6"
        >
          <Trophy size={48} className="text-theme-secondary md:w-16 md:h-16" />
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-theme-heading font-bold mb-2">
          {speedStarCorrectCount > 0 && !selectedSubcategory ? 'Speed Star Result!' : 'Quiz Complete!'}
        </h2>
        <p className="text-sm md:text-base text-theme-text-muted mb-6 md:mb-8">
          {speedStarCorrectCount > 0 && !selectedSubcategory ? `Correct Answers: ${speedStarCorrectCount}` : selectedSubcategory?.title}
        </p>
        
        {/* Gacha Section */}
        <div className="mb-8 md:mb-12">
          <div className="bg-theme-bg p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm text-center">
            <h3 className="text-xl md:text-2xl font-theme-heading font-bold mb-3 md:mb-4">
              {speedStarCorrectCount > 0 && !selectedSubcategory ? 'Speed Star Bonus' : '学習完了ボーナス'}
            </h3>
            
            {getGachaPullCount() > 0 && (isDailyChallenge || (speedStarCorrectCount > 0 && !selectedSubcategory) || (questions.length > 0 && (correctCount / questions.length) >= 0.5)) ? (
              <div className="space-y-4 md:space-y-6">
                <p className="text-sm md:text-base text-theme-text-muted">
                  {speedStarCorrectCount > 0 && !selectedSubcategory 
                    ? 'スピードスター達成！結果に応じてガチャを引けます。' 
                    : isDailyChallenge 
                      ? 'デイリーチャレンジ完了！特別ボーナスが適用されます。'
                      : '正解率50%以上達成！カードガチャを引くことができます。'}
                </p>
                
                {isDailyChallenge && (
                  <div className="flex items-center justify-center gap-2 text-indigo-500 font-bold bg-indigo-50 py-2 px-4 rounded-full mb-2 animate-pulse border border-indigo-100">
                    <Sparkles size={16} />
                    <span className="text-xs md:text-sm">デイリーボーナス：+1枚引けます！</span>
                  </div>
                )}

                <p className="text-xs md:text-sm text-theme-accent font-bold">
                  {speedStarCorrectCount > 0 && !selectedSubcategory ? `スピードスターボーナス：${getGachaPullCount()}枚引けます！` :
                   questions.length === 20 ? '総合演習ボーナス：5枚引けます！' : 
                   questions.length === 10 ? '単元演習ボーナス：2枚引けます！' : 
                   isDailyChallenge ? ((correctCount / questions.length) >= 0.5 ? '1枚 + ボーナス1枚引けます！' : 'デイリーボーナス：1枚引けます！') :
                   '1枚引けます！'}
                </p>
                
                {gachaResults.length === 0 && (
                  <button 
                    onClick={pullGacha}
                    disabled={isGachaRolling}
                    className={`w-full md:w-auto px-8 py-4 md:px-12 md:py-6 rounded-full text-lg md:text-xl font-bold shadow-xl transition-all ${
                      isGachaRolling 
                        ? 'bg-theme-border-strong text-theme-text-muted cursor-not-allowed' 
                        : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isGachaRolling ? 'ガチャを回しています...' : 'ガチャを引く！'}
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 md:p-6 bg-theme-card rounded-2xl text-theme-text-muted font-bold">
                <p className="text-sm md:text-base">正解率が50%未満のため、ガチャは引けません。</p>
                <p className="text-xs md:text-sm font-normal mt-2">次はもっと頑張りましょう！</p>
              </div>
            )}
          </div>
        </div>

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

        <div className="space-y-3 md:space-y-4">
          {hasBonusTicket && (
            <button 
              onClick={startSpeedStar}
              className="w-full py-4 md:py-5 bg-black text-amber-400 border-2 border-amber-400 rounded-2xl text-lg md:text-xl font-bold flex items-center justify-center gap-3 hover:bg-amber-400/10 transition-colors"
            >
              <Zap size={24} className="animate-pulse" /> SPEED STAR に挑戦
            </button>
          )}
          <button 
            onClick={() => {
              resetQuizState();
              setGameState('CATEGORY_SELECT');
            }}
            className="w-full py-4 md:py-5 bg-theme-text text-theme-bg text-white rounded-2xl text-lg md:text-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-colors"
          >
            <LayoutGrid size={24} /> 他の単元を選ぶ
          </button>
          <button 
            onClick={() => {
              if (selectedSubcategory?.id === 'all') {
                startComprehensiveQuiz();
              } else if (selectedSubcategory) {
                startQuiz(selectedSubcategory as any);
              }
            }}
            className="w-full py-4 md:py-5 bg-theme-card border-2 border-theme-border-strong text-theme-text rounded-2xl text-lg md:text-xl font-bold flex items-center justify-center gap-3 hover:bg-theme-muted transition-colors"
          >
            <RotateCcw size={24} /> もう一度挑戦
          </button>
        </div>

        {/* Gacha Rolling Overlay */}
        <AnimatePresence>
          {isGachaRolling && <GachaRollingOverlay />}
        </AnimatePresence>

        {/* Full Screen Gacha Animation Overlay */}
        <AnimatePresence>
          {currentGachaCard && (
            <GachaResultOverlay
              currentGachaCard={currentGachaCard}
              getRarityStyles={getRarityStyles}
              allTermsMap={allTermsMap}
              getTermIcon={getTermIcon}
              quizCategories={quizCategories}
              gachaHistory={gachaHistory}
              gachaQueue={gachaQueue}
              handleRedraw={handleRedraw}
              handleKeepCard={handleKeepCard}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
