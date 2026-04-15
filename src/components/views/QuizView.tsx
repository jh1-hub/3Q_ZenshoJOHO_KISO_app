import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { QuizHeader } from '../quiz/QuizHeader';
import { QuizProgress } from '../quiz/QuizProgress';
import { QuizQuestion } from '../quiz/QuizQuestion';

interface QuizViewProps {
  questions: any[];
  currentQuestionIndex: number;
  timeLeft: number;
  score: number;
  combo: number;
  userAnswer: string | null;
  feedback: 'CORRECT' | 'WRONG' | null;
  isDailyChallenge: boolean;
  userLevel: number;
  penaltyActive: boolean;
  handleAnswer: (answer: string) => void;
  quitQuiz: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  currentQuestionIndex,
  timeLeft,
  score,
  combo,
  userAnswer,
  feedback,
  isDailyChallenge,
  userLevel,
  penaltyActive,
  handleAnswer,
  quitQuiz
}) => {
  return (
    <motion.div 
      key="quiz"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex flex-col transition-colors duration-1000 overflow-y-auto ${
        isDailyChallenge ? 'bg-indigo-950 text-white' : 'bg-theme-bg'
      }`}
    >
      {isDailyChallenge && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2),transparent_70%)]" />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-600/10 blur-[120px] rounded-full"
          />
        </div>
      )}
      
      <div className="max-w-3xl mx-auto w-full p-6 py-12 flex flex-col flex-grow relative z-10">
        <QuizHeader
          quitQuiz={quitQuiz}
          isDailyChallenge={isDailyChallenge}
          userLevel={userLevel}
          currentQuestionIndex={currentQuestionIndex}
          questionsCount={questions.length}
          timeLeft={timeLeft}
        />

        <QuizProgress
          timeLeft={timeLeft}
          isDailyChallenge={isDailyChallenge}
          currentQuestionIndex={currentQuestionIndex}
          questionsCount={questions.length}
        />

        <QuizQuestion
          currentQuestionIndex={currentQuestionIndex}
          question={questions[currentQuestionIndex]}
          isDailyChallenge={isDailyChallenge}
          userAnswer={userAnswer}
          feedback={feedback}
          penaltyActive={penaltyActive}
          handleAnswer={handleAnswer}
        />

        {/* Score Display */}
        <div className="mt-8 flex flex-col items-center gap-2 relative z-10">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-widest font-bold ${isDailyChallenge ? 'text-white/40' : 'text-theme-text-muted'}`}>Current Score</p>
              <p className="text-4xl font-mono font-bold">{score.toLocaleString()}</p>
            </div>
            {combo > 1 && (
              <motion.div 
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                className={`${isDailyChallenge ? 'bg-amber-500 text-black' : 'bg-theme-secondary text-white'} px-4 py-2 rounded-2xl shadow-lg flex flex-col items-center justify-center min-w-[100px]`}
              >
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">Combo</span>
                <div className="flex items-center gap-1">
                  <Zap size={16} fill="currentColor" />
                  <span className="text-2xl font-mono font-bold">{combo}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
