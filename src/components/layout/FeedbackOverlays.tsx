import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface FeedbackOverlaysProps {
  isLoading: boolean;
  feedback: 'CORRECT' | 'WRONG' | null;
}

export const FeedbackOverlays: React.FC<FeedbackOverlaysProps> = ({
  isLoading,
  feedback
}) => {
  return (
    <>
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-theme-card/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-theme-accent border-t-transparent rounded-full mb-4"
            />
            <p className="text-lg font-bold text-theme-accent animate-pulse">問題を準備中...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
          >
            {feedback === 'CORRECT' ? (
              <div className="bg-green-500 text-white p-8 rounded-full shadow-2xl">
                <CheckCircle2 size={120} />
              </div>
            ) : (
              <div className="bg-red-500 text-white p-8 rounded-full shadow-2xl">
                <XCircle size={120} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
