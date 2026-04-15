import React from 'react';
import { motion } from 'framer-motion';
import { CollectionHeader } from '../collection/CollectionHeader';
import { CollectionFilters } from '../collection/CollectionFilters';
import { CollectionDisplay } from '../collection/CollectionDisplay';

interface CollectionViewProps {
  setGameState: (state: any) => void;
  allTerms: any[];
  collectionMode: 'card' | 'word';
  setCollectionMode: (mode: 'card' | 'word') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isCollectionSearchingAll: boolean;
  setIsCollectionSearchingAll: (isAll: boolean) => void;
  activeCollectionTab: string;
  setActiveCollectionTab: (tab: string) => void;
  activeSubcollectionTab: string | null;
  setActiveSubcollectionTab: (tab: string | null) => void;
  quizCategories: any[];
  getCategoryColor: (id: string) => any;
  filteredTerms: any[];
  cardRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  targetCardId: string | null;
  ownedCards: Record<string, number>;
  allTermsMap: Record<string, any>;
  getRarityStyles: (rarity: string) => any;
  handleCardClick: (term: string) => void;
  pickedCard: { term: string; descriptionIndex: number } | null;
  wordModeIndexes: Record<string, number>;
  setWordModeIndexes: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  setGameState,
  allTerms,
  collectionMode,
  setCollectionMode,
  searchTerm,
  setSearchTerm,
  isCollectionSearchingAll,
  setIsCollectionSearchingAll,
  activeCollectionTab,
  setActiveCollectionTab,
  activeSubcollectionTab,
  setActiveSubcollectionTab,
  quizCategories,
  getCategoryColor,
  filteredTerms,
  cardRefs,
  targetCardId,
  ownedCards,
  allTermsMap,
  getRarityStyles,
  handleCardClick,
  pickedCard,
  wordModeIndexes,
  setWordModeIndexes
}) => {
  const handleWordRowClick = (term: string) => {
    const isOwned = !!ownedCards[term];
    const count = ownedCards[term] || 0;
    const currentIndex = wordModeIndexes[term] || 0;
    const maxDescriptions = Math.min(allTermsMap[term]?.descriptions?.length || 1, 3);
    
    if (isOwned && count > 1 && maxDescriptions > 1) {
      setWordModeIndexes(prev => ({
        ...prev,
        [term]: (currentIndex + 1) % Math.min(count, maxDescriptions)
      }));
    }
  };

  return (
    <motion.div 
      key="collection"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-6 py-12"
    >
      <CollectionHeader
        setGameState={setGameState}
        allTermsCount={allTerms.length}
        collectionMode={collectionMode}
        setCollectionMode={setCollectionMode}
      />

      <CollectionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isCollectionSearchingAll={isCollectionSearchingAll}
        setIsCollectionSearchingAll={setIsCollectionSearchingAll}
        activeCollectionTab={activeCollectionTab}
        setActiveCollectionTab={setActiveCollectionTab}
        activeSubcollectionTab={activeSubcollectionTab}
        setActiveSubcollectionTab={setActiveSubcollectionTab}
        quizCategories={quizCategories}
        getCategoryColor={getCategoryColor}
      />

      <CollectionDisplay
        collectionMode={collectionMode}
        filteredTerms={filteredTerms}
        isCollectionSearchingAll={isCollectionSearchingAll}
        searchTerm={searchTerm}
        quizCategories={quizCategories}
        activeCollectionTab={activeCollectionTab}
        activeSubcollectionTab={activeSubcollectionTab}
        getCategoryColor={getCategoryColor}
        allTermsMap={allTermsMap}
        ownedCards={ownedCards}
        targetCardId={targetCardId}
        pickedCard={pickedCard}
        getRarityStyles={getRarityStyles}
        handleCardClick={handleCardClick}
        cardRefs={cardRefs}
        wordModeIndexes={wordModeIndexes}
        onWordRowClick={handleWordRowClick}
      />
    </motion.div>
  );
};
