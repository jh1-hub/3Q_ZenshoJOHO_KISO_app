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
  const canPullGacha = getGachaPullCount() > 0 && (
    isDailyChallenge || 
    (speedStarCorrectCount > 0 && !selectedSubcategory) || 
    (questions.length > 0 && (correctCount / questions.length) >= 0.5)
  );

  return (
    <div className="mb-8 md:mb-12">
      <div className="bg-theme-bg p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm text-center">
        <h3 className="text-xl md:text-2xl font-theme-heading font-bold mb-3 md:mb-4">
          {speedStarCorrectCount > 0 && !selectedSubcategory ? 'Speed Star Bonus' : '学習完了ボーナス'}
        </h3>
        
        {canPullGacha ? (
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
            
            {(gachaResults.length === 0 || gachaResults.length > 0) && (
              <button 
                onClick={pullGacha}
                disabled={isGachaRolling || gachaResults.length > 0}
                className={`w-full md:w-auto px-8 py-4 md:px-12 md:py-6 rounded-full text-lg md:text-xl font-bold shadow-xl transition-all ${
                  isGachaRolling || gachaResults.length > 0
                    ? 'bg-theme-border-strong text-theme-text-muted cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:scale-105 active:scale-95'
                }`}
              >
                {isGachaRolling ? 'loading...' : gachaResults.length > 0 ? 'Complete' : 'Get Card!'}
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
  );
};
