import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface ResultHeaderProps {
  speedStarCorrectCount: number;
  selectedSubcategory: any;
}

export const ResultHeader: React.FC<ResultHeaderProps> = ({
  speedStarCorrectCount,
  selectedSubcategory
}) => {
  return (
    <>
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="inline-block p-4 md:p-6 bg-theme-bg rounded-full mb-4 md:mb-6"
      >
        <Trophy size={48} className="text-theme-secondary md:w-16 md:h-16" />
      </motion.div>
      
      <h2 className="text-3xl md:text-4xl font-theme-heading font-bold mb-2">
        {speedStarCorrectCount > 0 && !selectedSubcategory ? 'Speed Star Result!' : 'Quiz Complete!'}
      </h2>
      <p className="text-sm md:text-base text-theme-text-muted mb-6 md:mb-8">
        {speedStarCorrectCount > 0 && !selectedSubcategory ? `Correct Answers: ${speedStarCorrectCount}` : selectedSubcategory?.title}
      </p>
    </>
  );
};
