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
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  option,
  idx,
  isCorrect,
  isSelected,
  feedback,
  isDailyChallenge,
  penaltyActive,
  handleAnswer
}) => {
  let buttonClass = isDailyChallenge 
    ? 'bg-white/5 border-white/10 hover:border-amber-400 hover:bg-white/10 text-white' 
    : 'bg-theme-card border-theme-border hover:border-theme-accent hover:bg-theme-bg';
  
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
        relative p-4 md:p-5 rounded-2xl text-left transition-all border-2
        ${isLongOption ? 'text-sm md:text-base font-medium' : 'text-base md:text-lg font-bold'}
        ${buttonClass}
      `}
    >
      <span className="mr-4 text-theme-text-muted">{idx + 1}.</span>
      {option}
      {feedback === 'CORRECT' && isCorrect && (
        <CheckCircle2 className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500" />
      )}
      {feedback === 'WRONG' && isSelected && (
        <XCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-red-500" />
      )}
    </motion.button>
  );
};
