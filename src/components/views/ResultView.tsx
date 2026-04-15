import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GachaRollingOverlay } from '../gacha/GachaRollingOverlay';
import { GachaResultOverlay } from '../gacha/GachaResultOverlay';
import { ResultHeader } from '../result/ResultHeader';
import { GachaBonusSection } from '../result/GachaBonusSection';
import { ResultStats } from '../result/ResultStats';
import { ResultActions } from '../result/ResultActions';

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
        <ResultHeader
          speedStarCorrectCount={speedStarCorrectCount}
          selectedSubcategory={selectedSubcategory}
        />
        
        <GachaBonusSection
          speedStarCorrectCount={speedStarCorrectCount}
          selectedSubcategory={selectedSubcategory}
          getGachaPullCount={getGachaPullCount}
          isDailyChallenge={isDailyChallenge}
          questions={questions}
          correctCount={correctCount}
          gachaResults={gachaResults}
          pullGacha={pullGacha}
          isGachaRolling={isGachaRolling}
        />

        <ResultStats
          score={score}
          maxCombo={maxCombo}
        />

        <ResultActions
          hasBonusTicket={hasBonusTicket}
          startSpeedStar={startSpeedStar}
          resetQuizState={resetQuizState}
          setGameState={setGameState}
          selectedSubcategory={selectedSubcategory}
          startComprehensiveQuiz={startComprehensiveQuiz}
          startQuiz={startQuiz}
        />

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
