import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizOptionProps {
  option: string;
  idx: number;
  isCorrect: boolean;
  isSelected: boolean;
  feedback: 'CORRECT' | 'WRONG' | null;
  isDailyChallenge: boolean;
  penaltyActive: boolean;
  handleAnswer: (answer: string) => void;
  showCheckbox?: boolean;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  option,
  idx,
  isCorrect,
  isSelected,
  feedback,
  isDailyChallenge,
  penaltyActive,
  handleAnswer,
  showCheckbox = false
}) => {
  let buttonClass = isDailyChallenge 
    ? 'bg-white/5 border-white/10 hover:border-amber-400 hover:bg-white/10 text-white' 
    : 'bg-theme-card border-theme-border hover:border-theme-accent hover:bg-theme-bg';
  
  if (isSelected && !feedback) {
    buttonClass = isDailyChallenge
      ? 'bg-amber-400/20 border-amber-400 text-white ring-2 ring-amber-400/20'
      : 'bg-theme-accent/20 border-theme-accent text-theme-text ring-2 ring-theme-accent/20';
  }

  if (feedback === 'CORRECT' && isCorrect) {
    buttonClass = 'bg-green-500/20 border-green-500 text-green-400';
  } else if (feedback === 'WRONG') {
    if (isCorrect) {
      buttonClass = 'bg-green-500/20 border-green-500 text-green-400';
    } else if (isSelected) {
      buttonClass = 'bg-red-500/20 border-red-500 text-red-400 ring-2 ring-red-500/20';
    } else {
      buttonClass = isDailyChallenge ? 'bg-white/5 border-white/10 opacity-30' : 'bg-theme-card border-theme-border opacity-50';
    }
  }

  if (penaltyActive && !feedback) {
    buttonClass = 'bg-theme-muted border-theme-border-strong text-theme-text-muted cursor-not-allowed opacity-50';
  }

  const isLongOption = option.length > 40;

  return (
    <motion.button
      whileHover={!feedback && !penaltyActive ? { scale: 1.02 } : {}}
      whileTap={!feedback && !penaltyActive ? { scale: 0.98 } : {}}
      onClick={() => !feedback && !penaltyActive && handleAnswer(option)}
      disabled={!!feedback || penaltyActive}
      className={`
        relative p-4 md:p-5 rounded-2xl text-left transition-all border-2 flex items-center
        ${isLongOption ? 'text-sm md:text-base font-medium' : 'text-base md:text-lg font-bold'}
        ${buttonClass}
      `}
    >
      <div className="flex items-center flex-grow">
        {showCheckbox ? (
          <div className={`
            w-6 h-6 rounded-md border-2 mr-4 flex items-center justify-center transition-colors
            ${isSelected ? 'bg-theme-accent border-theme-accent' : 'border-theme-border-strong'}
          `}>
            {isSelected && <CheckCircle2 size={16} className="text-white" />}
          </div>
        ) : (
          <span className="mr-4 text-theme-text-muted">{idx + 1}.</span>
        )}
        <span className="flex-grow">{option}</span>
      </div>
      {feedback === 'CORRECT' && isCorrect && (
        <CheckCircle2 className="ml-4 text-green-500 shrink-0" />
      )}
      {feedback === 'WRONG' && isSelected && (
        <XCircle className="ml-4 text-red-500 shrink-0" />
      )}
    </motion.button>
  );
};
