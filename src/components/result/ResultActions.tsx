import React from 'react';
import { Zap, LayoutGrid, RotateCcw } from 'lucide-react';

interface ResultActionsProps {
  hasBonusTicket: boolean;
  startSpeedStar: () => void;
  resetQuizState: () => void;
  setGameState: (state: any) => void;
  selectedSubcategory: any;
  startComprehensiveQuiz: () => void;
  startQuiz: (category: any) => void;
  disabled?: boolean;
}

export const ResultActions: React.FC<ResultActionsProps> = ({
  hasBonusTicket,
  startSpeedStar,
  resetQuizState,
  setGameState,
  selectedSubcategory,
  startComprehensiveQuiz,
  startQuiz,
  disabled = false
}) => {
  return (
    <div className="space-y-3 md:space-y-4">
      {hasBonusTicket && (
        <button 
          onClick={startSpeedStar}
          disabled={disabled}
          className={`w-full py-4 md:py-5 bg-black text-amber-400 border-2 border-amber-400 rounded-2xl text-lg md:text-xl font-bold flex items-center justify-center gap-3 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-400/10'}`}
        >
          <Zap size={24} className={disabled ? '' : 'animate-pulse'} /> SPEED STAR に挑戦
        </button>
      )}
      <button 
        onClick={() => {
          resetQuizState();
          setGameState('CATEGORY_SELECT');
        }}
        disabled={disabled}
        className={`w-full py-4 md:py-5 bg-theme-text text-theme-bg text-white rounded-2xl text-lg md:text-xl font-bold flex items-center justify-center gap-3 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'}`}
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
        disabled={disabled}
        className={`w-full py-4 md:py-5 bg-theme-card border-2 border-theme-border-strong text-theme-text rounded-2xl text-lg md:text-xl font-bold flex items-center justify-center gap-3 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-theme-muted'}`}
      >
        <RotateCcw size={24} /> もう一度挑戦
      </button>
    </div>
  );
};
