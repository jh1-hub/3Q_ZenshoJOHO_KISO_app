import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizOption } from './QuizOption';
import { Check } from 'lucide-react';

interface QuizQuestionProps {
  currentQuestionIndex: number;
  question: any;
  isDailyChallenge: boolean;
  userAnswer: string | null;
  feedback: 'CORRECT' | 'WRONG' | null;
  penaltyActive: boolean;
  handleAnswer: (answer: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  currentQuestionIndex,
  question,
  isDailyChallenge,
  userAnswer,
  feedback,
  penaltyActive,
  handleAnswer
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const isMultiple = question.displayType === 'multiple';

  useEffect(() => {
    setSelectedOptions([]);
  }, [currentQuestionIndex]);

  const onOptionClick = (option: string) => {
    if (feedback || penaltyActive) return;

    if (isMultiple) {
      setSelectedOptions(prev => 
        prev.includes(option) 
          ? prev.filter(o => o !== option)
          : [...prev, option]
      );
    } else {
      handleAnswer(option);
    }
  };

  const onConfirm = () => {
    if (selectedOptions.length === 0) return;
    handleAnswer(selectedOptions.sort().join(','));
  };

  return (
    <div className="flex-grow relative z-10">
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-6 md:p-10 rounded-[2rem] shadow-xl border mb-6 md:mb-8 relative overflow-hidden ${
          isDailyChallenge ? 'bg-white/5 border-white/10' : 'bg-theme-card border-theme-border'
        }`}
      >
        <div className={`absolute top-0 left-0 w-2 h-full ${isDailyChallenge ? 'bg-amber-400' : 'bg-theme-accent'}`} />
        <h3 className="text-xl md:text-2xl font-question font-semibold leading-relaxed mb-4">
          {question.description}
        </h3>

        {question.subDescriptions && question.subDescriptions.length > 0 && (
          <div className={`space-y-2 mt-4 pt-4 border-t ${isDailyChallenge ? 'border-white/10' : 'border-theme-border'}`}>
            {question.subDescriptions.map((desc: string, i: number) => (
              <p key={i} className="text-sm md:text-base opacity-80 leading-relaxed">
                {desc}
              </p>
            ))}
          </div>
        )}
      </motion.div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {question.options.map((option: string, idx: number) => {
          let isSelected = false;
          let isCorrect = false;

          if (isMultiple) {
            isSelected = selectedOptions.includes(option);
            if (Array.isArray(question.correctAnswer)) {
              isCorrect = question.correctAnswer.includes(option);
            }
          } else {
            isSelected = option === userAnswer;
            isCorrect = option === question.correctAnswer;
          }

          // In feedback mode, we show also the user's previously submitted answer
          if (feedback && isMultiple && userAnswer) {
            isSelected = userAnswer.split(',').includes(option);
          }

          return (
            <QuizOption
              key={`${currentQuestionIndex}-${idx}`}
              option={option}
              idx={idx}
              isCorrect={isCorrect}
              isSelected={isSelected}
              feedback={feedback}
              isDailyChallenge={isDailyChallenge}
              penaltyActive={penaltyActive}
              handleAnswer={() => onOptionClick(option)}
              showCheckbox={isMultiple}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {isMultiple && !feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 flex justify-center"
          >
            <button
              onClick={onConfirm}
              disabled={selectedOptions.length === 0 || penaltyActive}
              className={`
                px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg
                ${selectedOptions.length > 0 && !penaltyActive
                  ? 'bg-amber-500 text-black hover:scale-105 active:scale-95' 
                  : 'bg-white/10 text-white/40 cursor-not-allowed'}
              `}
            >
              <Check size={20} />
              回答を確定する
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
