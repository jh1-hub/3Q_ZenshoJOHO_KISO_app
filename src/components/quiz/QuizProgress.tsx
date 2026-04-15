import React from 'react';
import { motion } from 'framer-motion';

interface QuizProgressProps {
  timeLeft: number;
  isDailyChallenge: boolean;
  currentQuestionIndex: number;
  questionsCount: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  timeLeft,
  isDailyChallenge,
  currentQuestionIndex,
  questionsCount
}) => {
  return (
    <>
      {/* Visual Timer Bar */}
      <div className={`w-full h-2 rounded-full mb-4 overflow-hidden ${isDailyChallenge ? 'bg-white/10' : 'bg-theme-border-strong'}`}>
        <motion.div 
          className={`h-full ${timeLeft < 5 ? 'bg-red-500' : (isDailyChallenge ? 'bg-indigo-400' : 'bg-theme-secondary')}`}
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / 60) * 100}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      {/* Progress Bar */}
      <div className={`w-full h-1 rounded-full mb-12 overflow-hidden ${isDailyChallenge ? 'bg-white/5' : 'bg-theme-border'}`}>
        <motion.div 
          className={`h-full ${isDailyChallenge ? 'bg-amber-400' : 'bg-theme-accent'}`}
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIndex) / questionsCount) * 100}%` }}
        />
      </div>
    </>
  );
};
