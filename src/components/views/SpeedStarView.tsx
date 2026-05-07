import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Timer } from 'lucide-react';
import { SpeedLines } from '../effects/SpeedLines';

interface SpeedStarViewProps {
  questions: any[];
  currentQuestionIndex: number;
  timeLeft: number;
  speedStarCorrectCount: number;
  combo: number;
  userAnswer: string | null;
  feedback: 'CORRECT' | 'WRONG' | null;
  handleAnswer: (answer: string) => void;
}

export const SpeedStarView: React.FC<SpeedStarViewProps> = ({
  questions,
  currentQuestionIndex,
  timeLeft,
  speedStarCorrectCount,
  combo,
  userAnswer,
  feedback,
  handleAnswer
}) => {
  return (
    <motion.div 
      key="speed-star"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black text-white flex flex-col"
    >
      <SpeedLines />
      
      {/* Fixed Timer Bar ONLY */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md p-2 border-b border-white/10">
        <div className="max-w-3xl mx-auto w-full h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${timeLeft < 5 ? 'bg-red-500' : 'bg-amber-400'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${Math.min(100, (timeLeft / 30) * 100)}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto p-4 md:p-6 relative z-10">
        <div className="max-w-3xl mx-auto w-full py-2 md:py-8">
          {/* Header Info (Now scrolls with content) */}
          <div className="flex items-center justify-between mb-6 gap-2 overflow-x-hidden">
            <div className="flex items-center gap-1.5 md:gap-4 min-w-0">
              <div className="bg-white/10 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 font-bold flex items-center gap-1.5 md:gap-3 shrink-0">
                <Zap size={14} className="text-amber-400 md:w-5 md:h-5" />
                <span className="text-amber-400 text-[9px] sm:text-[10px] md:text-sm whitespace-nowrap">SPEED STAR</span>
              </div>
              <div className="bg-white/5 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 text-[9px] sm:text-[10px] md:text-sm font-bold whitespace-nowrap shrink-0">
                Correct: {speedStarCorrectCount}
              </div>
              {combo > 1 && (
                <motion.div 
                  initial={{ scale: 0, x: -20 }}
                  animate={{ scale: 1, x: 0 }}
                  className="bg-amber-500 text-black px-2.5 py-1 md:px-4 md:py-1 rounded-full text-[9px] sm:text-[10px] md:text-sm font-black shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center gap-1 shrink-0"
                >
                  <Zap size={10} fill="currentColor" className="md:w-3.5 md:h-3.5" /> {combo}
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 font-mono font-bold shrink-0">
              <Timer size={16} className={`${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-amber-400'} md:w-7 md:h-7`} />
              <span className={`text-base sm:text-lg md:text-3xl ${timeLeft < 5 ? 'text-red-500' : 'text-amber-400'} whitespace-nowrap`}>{Math.ceil(timeLeft)}s</span>
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 p-8 md:p-12 rounded-[2rem] border border-white/10 mb-8 relative overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-400" />
            <h3 className="text-xl md:text-3xl font-sans font-bold leading-relaxed mb-0">
              {questions[currentQuestionIndex].description}
            </h3>
          </motion.div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestionIndex].options.map((option: string, idx: number) => {
              const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
              const isSelected = option === userAnswer;
              
              let buttonClass = 'bg-white/5 border-white/10 hover:border-amber-400 hover:bg-white/10';
              if (feedback === 'CORRECT' && isCorrect) {
                buttonClass = 'bg-green-500/20 border-green-500 text-green-400';
              } else if (feedback === 'WRONG') {
                if (isCorrect) {
                  buttonClass = 'bg-green-500/20 border-green-500 text-green-400';
                } else if (isSelected) {
                  buttonClass = 'bg-red-500/20 border-red-500 text-red-400';
                } else {
                  buttonClass = 'bg-white/5 border-white/10 opacity-30';
                }
              }

              return (
                <motion.button
                  key={`${currentQuestionIndex}-${idx}`}
                  whileHover={!feedback ? { scale: 1.02, x: 10 } : {}}
                  whileTap={!feedback ? { scale: 0.98 } : {}}
                  onClick={() => !feedback && handleAnswer(option)}
                  disabled={!!feedback}
                  className={`
                    relative p-5 rounded-2xl text-left transition-all border-2 text-lg font-bold
                    ${buttonClass}
                  `}
                >
                  <span className="mr-4 text-white/40">{idx + 1}.</span>
                  {option}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
