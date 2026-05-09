import React from 'react';
import { Sparkles } from 'lucide-react';

interface GachaBonusSectionProps {
  speedStarCorrectCount: number;
  selectedSubcategory: any;
  getGachaPullCount: () => number;
  isDailyChallenge: boolean;
  questions: any[];
  correctCount: number;
  gachaResults: any[];
  pullGacha: () => void;
  isGachaRolling: boolean;
}

export const GachaBonusSection: React.FC<GachaBonusSectionProps> = ({
  speedStarCorrectCount,
  selectedSubcategory,
  getGachaPullCount,
  isDailyChallenge,
  questions,
  correctCount,
  gachaResults,
  pullGacha,
  isGachaRolling
}) => {
  const isCategoryQuiz = selectedSubcategory && 
    !selectedSubcategory.id.includes('-') && 
    ['1','2','3','4','5','6','7','8','9'].includes(selectedSubcategory.id);

  const canPullGacha = getGachaPullCount() > 0 && (
    isDailyChallenge || 
    (speedStarCorrectCount > 0 && !selectedSubcategory) || 
    (questions.length > 0 && (correctCount / questions.length) >= 0.5)
  );

  return (
    <div className="mb-8 md:mb-12">
      <div className="bg-theme-bg p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm text-center">
        <h3 className="text-xl md:text-2xl font-theme-heading font-black mb-3 md:mb-4 uppercase tracking-tighter">
          {speedStarCorrectCount > 0 && !selectedSubcategory ? 'SPEED STAR BONUS' : 'STUDY REWARD'}
        </h3>
        
        {canPullGacha ? (
          <div className="space-y-4 md:space-y-6">
            <p className="text-sm md:text-base text-theme-text-muted font-medium">
              {speedStarCorrectCount > 0 && !selectedSubcategory 
                ? 'SPEED STAR ACHIEVED! YOU CAN GET CARDS BASED ON YOUR RESULT.' 
                : isDailyChallenge 
                  ? 'DAILY CHALLENGE COMPLETE! SPECIAL BONUS APPLIED.'
                  : '正解率50%以上達成！カードガチャを引くことができます。'}
            </p>
            
            {isDailyChallenge && (
              <div className="flex items-center justify-center gap-2 text-indigo-500 font-bold bg-indigo-50 py-2 px-4 rounded-full mb-2 animate-pulse border border-indigo-100">
                <Sparkles size={16} />
                <span className="text-xs md:text-sm uppercase font-black">DAILY BONUS: +1 CARD!</span>
              </div>
            )}

            <p className="text-xs md:text-sm text-theme-accent font-black uppercase tracking-wider">
              {speedStarCorrectCount > 0 && !selectedSubcategory ? `SPEED STAR BONUS: ${getGachaPullCount()} CARDS!` :
               questions.length === 15 ? `TOTAL EXERCISE BONUS: ${getGachaPullCount()} CARDS! ${correctCount === 15 ? ' (PERFECT!)' : ''}` : 
               isCategoryQuiz ? `UNIT EXERCISE BONUS: ${getGachaPullCount()} CARDS! ${correctCount === 5 ? ' (PERFECT!)' : ''}` : 
               isDailyChallenge ? `SPECIAL BONUS: ${getGachaPullCount()} CARDS!` :
               `${correctCount === questions.length ? 'PERFECT! ' : ''}REWARD: ${getGachaPullCount()} CARD!`}
            </p>
            
            {(gachaResults.length === 0 || gachaResults.length > 0) && (
              <button 
                onClick={pullGacha}
                disabled={isGachaRolling || gachaResults.length > 0}
                className={`w-full md:w-auto px-8 py-4 md:px-12 md:py-6 rounded-full text-lg md:text-xl font-black shadow-xl transition-all uppercase tracking-widest ${
                  isGachaRolling || gachaResults.length > 0
                    ? 'bg-theme-border-strong text-theme-text-muted cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:scale-105 active:scale-95'
                }`}
              >
                {isGachaRolling ? 'ROLLING...' : gachaResults.length > 0 ? 'COMPLETE' : 'GET CARD!'}
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 md:p-6 bg-theme-card rounded-2xl text-theme-text-muted font-bold">
            <p className="text-sm md:text-base uppercase">ACCURACY {'<'} 50%. NO CARDS REWARDED.</p>
            <p className="text-xs md:text-sm font-normal mt-2">TRY AGAIN FOR BETTER RESULTS!</p>
          </div>
        )}
      </div>
    </div>
  );
};
