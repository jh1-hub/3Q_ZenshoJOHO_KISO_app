import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Timer, Zap } from 'lucide-react';
import { QuizOption } from '../quiz/QuizOption';

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
        {/* Header */}
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
            <span>Q {currentQuestionIndex + 1} / {questions.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xl font-mono font-bold">
          <Timer size={24} className={timeLeft < 3 ? 'text-red-500 animate-pulse' : (isDailyChallenge ? 'text-indigo-300' : '')} />
          <span className={timeLeft < 3 ? 'text-red-500' : ''}>{Math.ceil(timeLeft)}s</span>
        </div>
      </div>

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
          animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-grow relative z-10">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 md:p-12 rounded-[2rem] shadow-xl border mb-6 md:mb-8 relative overflow-hidden ${
            isDailyChallenge ? 'bg-white/5 border-white/10' : 'bg-theme-card border-theme-border'
          }`}
        >
          <div className={`absolute top-0 left-0 w-2 h-full ${isDailyChallenge ? 'bg-amber-400' : 'bg-theme-accent'}`} />
          <h3 className="text-xl md:text-3xl font-theme-heading leading-relaxed mb-0">
            {questions[currentQuestionIndex].description}
          </h3>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {questions[currentQuestionIndex].options.map((option: string, idx: number) => (
            <QuizOption
              key={`${currentQuestionIndex}-${idx}`}
              option={option}
              idx={idx}
              isCorrect={option === questions[currentQuestionIndex].correctAnswer}
              isSelected={option === userAnswer}
              feedback={feedback}
              isDailyChallenge={isDailyChallenge}
              penaltyActive={penaltyActive}
              handleAnswer={handleAnswer}
            />
          ))}
        </div>
      </div>

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
