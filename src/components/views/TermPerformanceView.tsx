import React from 'react';
import { motion } from 'framer-motion';
import { PerformanceHeader } from '../performance/PerformanceHeader';
import { PerformanceFilters } from '../performance/PerformanceFilters';
import { PerformanceTable } from '../performance/PerformanceTable';

interface TermPerformanceViewProps {
  setGameState: (state: any) => void;
  termPerformanceRef: React.RefObject<HTMLDivElement>;
  termSortOrder: 'asc' | 'desc' | null;
  setTermSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc' | null>>;
  termPerformanceSearchTerm: string;
  setTermPerformanceSearchTerm: (term: string) => void;
  isTermPerformanceSearchingAll: boolean;
  setIsTermPerformanceSearchingAll: (isAll: boolean) => void;
  activeCollectionTab: string;
  setActiveCollectionTab: (tab: string) => void;
  activeSubcollectionTab: string | null;
  setActiveSubcollectionTab: (tab: string | null) => void;
  quizCategories: any[];
  getCategoryColor: (id: string) => any;
  termStats: Record<string, { correct: number; total: number }>;
  ownedCards: Record<string, number>;
  allTermsMap: Record<string, any>;
  termPerformanceDescIndexes: Record<string, number>;
  setTermPerformanceDescIndexes: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const TermPerformanceView: React.FC<TermPerformanceViewProps> = ({
  setGameState,
  termPerformanceRef,
  termSortOrder,
  setTermSortOrder,
  termPerformanceSearchTerm,
  setTermPerformanceSearchTerm,
  isTermPerformanceSearchingAll,
  setIsTermPerformanceSearchingAll,
  activeCollectionTab,
  setActiveCollectionTab,
  activeSubcollectionTab,
  setActiveSubcollectionTab,
  quizCategories,
  getCategoryColor,
  termStats,
  ownedCards,
  allTermsMap,
  termPerformanceDescIndexes,
  setTermPerformanceDescIndexes
}) => {
  const handleRowClick = (termName: string, ownedCount: number, descriptions: string[]) => {
    const currentIndex = termPerformanceDescIndexes[termName] || 0;
    const isOwned = ownedCount > 0;
    
    if (isOwned && ownedCount > 1) {
      const unlockedCount = Math.min(ownedCount, descriptions.length);
      if (unlockedCount > 1) {
        setTermPerformanceDescIndexes(prev => ({
          ...prev,
          [termName]: (currentIndex + 1) % unlockedCount
        }));
      }
    }
  };

  return (
    <motion.div 
      key="term-performance"
      ref={termPerformanceRef}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 py-8 md:py-12"
    >
      <PerformanceHeader
        setGameState={setGameState}
        termSortOrder={termSortOrder}
        setTermSortOrder={setTermSortOrder}
      />

      <PerformanceFilters
        termPerformanceSearchTerm={termPerformanceSearchTerm}
        setTermPerformanceSearchTerm={setTermPerformanceSearchTerm}
        isTermPerformanceSearchingAll={isTermPerformanceSearchingAll}
        setIsTermPerformanceSearchingAll={setIsTermPerformanceSearchingAll}
        activeCollectionTab={activeCollectionTab}
        setActiveCollectionTab={setActiveCollectionTab}
        activeSubcollectionTab={activeSubcollectionTab}
        setActiveSubcollectionTab={setActiveSubcollectionTab}
        quizCategories={quizCategories}
        getCategoryColor={getCategoryColor}
      />

      <PerformanceTable
        isTermPerformanceSearchingAll={isTermPerformanceSearchingAll}
        termPerformanceSearchTerm={termPerformanceSearchTerm}
        quizCategories={quizCategories}
        termStats={termStats}
        ownedCards={ownedCards}
        termSortOrder={termSortOrder}
        activeCollectionTab={activeCollectionTab}
        activeSubcollectionTab={activeSubcollectionTab}
        getCategoryColor={getCategoryColor}
        allTermsMap={allTermsMap}
        termPerformanceDescIndexes={termPerformanceDescIndexes}
        onRowClick={handleRowClick}
      />
    </motion.div>
  );
};
