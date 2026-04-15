import React from 'react';
import { ArrowLeft, Sparkles, Timer } from 'lucide-react';

interface QuizHeaderProps {
  quitQuiz: () => void;
  isDailyChallenge: boolean;
  userLevel: number;
  currentQuestionIndex: number;
  questionsCount: number;
  timeLeft: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  quitQuiz,
  isDailyChallenge,
  userLevel,
  currentQuestionIndex,
  questionsCount,
  timeLeft
}) => {
  return (
    <div className="flex items-center justify-between mb-8 relative z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={quitQuiz}
          className={`p-2 rounded-full transition-colors ${
            isDailyChallenge ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-theme-card text-theme-text-muted hover:text-black'
          }`}
          title="クイズを中断して戻る"
        >
          <ArrowLeft size={24} />
        </button>
        <div className={`px-4 py-2 rounded-full shadow-sm border font-bold flex items-center gap-3 ${
          isDailyChallenge ? 'bg-white/10 border-white/20' : 'bg-theme-card border-theme-border'
        }`}>
          {isDailyChallenge ? (
            <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles size={12} /> DAILY
            </span>
          ) : (
            <span className="text-xs text-theme-accent bg-theme-accent/10 px-2 py-0.5 rounded-full">Lv.{userLevel}</span>
          )}
          <span>Q {currentQuestionIndex + 1} / {questionsCount}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xl font-mono font-bold">
        <Timer size={24} className={timeLeft < 3 ? 'text-red-500 animate-pulse' : (isDailyChallenge ? 'text-indigo-300' : '')} />
        <span className={timeLeft < 3 ? 'text-red-500' : ''}>{Math.ceil(timeLeft)}s</span>
      </div>
    </div>
  );
};
