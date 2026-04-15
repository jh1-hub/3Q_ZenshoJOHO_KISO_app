import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, LayoutGrid, List, Search } from 'lucide-react';
import { CardItem } from '../collection/CardItem';
import { WordRow } from '../collection/WordRow';

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

  const renderCardList = (terms: { term: string; subId: string }[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {terms.map(({ term, subId }) => (
        <CardItem
          key={`${term}-${subId}`}
          term={term}
          subId={subId}
          rarity={allTermsMap[term]?.rarity || 'C'}
          styles={getRarityStyles(allTermsMap[term]?.rarity || 'C')}
          isOwned={!!ownedCards[term]}
          count={ownedCards[term] || 0}
          isTarget={targetCardId === term}
          pickedCard={pickedCard}
          allTermsMap={allTermsMap}
          handleCardClick={handleCardClick}
          cardRefs={cardRefs}
        />
      ))}
    </div>
  );

  const renderWordTable = (terms: { term: string; subId: string }[]) => (
    <div className="bg-theme-card rounded-2xl border border-theme-border overflow-x-auto">
      <table className="w-full text-left text-sm md:text-base min-w-[600px]">
        <thead className="bg-theme-muted text-theme-text-muted">
          <tr>
            <th className="p-4 font-bold w-24 md:w-48">Term</th>
            <th className="p-4 font-bold">Description</th>
            <th className="p-4 font-bold">Flavor Text</th>
            <th className="p-4 font-bold w-16 text-center">Rarity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-theme-border">
          {terms.map(({ term, subId }) => (
            <WordRow
              key={`${term}-${subId}`}
              term={term}
              subId={subId}
              rarity={allTermsMap[term]?.rarity || 'C'}
              styles={getRarityStyles(allTermsMap[term]?.rarity || 'C')}
              isOwned={!!ownedCards[term]}
              count={ownedCards[term] || 0}
              currentIndex={wordModeIndexes[term] || 0}
              allTermsMap={allTermsMap}
              onRowClick={() => handleWordRowClick(term)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <motion.div 
      key="collection"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-6 py-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setGameState('START')}
            className="p-3 bg-theme-card rounded-2xl border border-theme-border hover:bg-theme-muted transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-4xl font-theme-heading font-bold mb-2">IT Card Collection</h2>
            <p className="text-theme-text-muted">知識をカードとして集めよう。{allTerms.length}枚のカードを収録。</p>
          </div>
        </div>
        <div className="flex bg-theme-bg p-1 rounded-xl w-fit">
          <button
            onClick={() => setCollectionMode('card')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${collectionMode === 'card' ? 'bg-theme-card text-theme-text shadow-sm' : 'text-theme-text-muted hover:text-theme-text'}`}
          >
            <LayoutGrid size={16} /> カード表示
          </button>
          <button
            onClick={() => setCollectionMode('word')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${collectionMode === 'word' ? 'bg-theme-card text-theme-text shadow-sm' : 'text-theme-text-muted hover:text-theme-text'}`}
          >
            <List size={16} /> 単語表示
          </button>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="bg-theme-card p-6 rounded-[2rem] shadow-sm border border-theme-border mb-12">
        <div className="relative mb-8">
          <button 
            onClick={() => {
              if (!searchTerm) {
                setIsCollectionSearchingAll(true);
              }
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-accent transition-colors"
          >
            <Search size={20} />
          </button>
          <input 
            type="text" 
            placeholder="カードの名前で検索..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value) {
                setIsCollectionSearchingAll(true);
              } else {
                setIsCollectionSearchingAll(false);
              }
            }}
            className="w-full pl-12 pr-4 py-4 bg-theme-bg rounded-2xl border-none focus:ring-2 focus:ring-theme-accent transition-all text-lg"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
          <button
            onClick={() => {
              setIsCollectionSearchingAll(true);
              setSearchTerm('');
            }}
            className={`px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-bold transition-all ${
              isCollectionSearchingAll && !searchTerm
                ? 'bg-theme-accent text-white shadow-lg scale-105'
                : 'bg-theme-border text-theme-text-muted hover:bg-theme-border-strong'
            }`}
          >
            すべてのデータ
          </button>
          {quizCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCollectionTab(cat.id);
                setActiveSubcollectionTab(null);
                setIsCollectionSearchingAll(false);
                setSearchTerm('');
              }}
              className={`px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-bold transition-all ${
                !isCollectionSearchingAll && activeCollectionTab === cat.id 
                  ? `${getCategoryColor(cat.id).accent} text-white shadow-lg scale-105` 
                  : 'bg-theme-border text-theme-text-muted hover:bg-theme-border-strong'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Subcategory Tabs */}
        {!isCollectionSearchingAll && quizCategories.find(c => c.id === activeCollectionTab)?.subcategories.length! > 0 && (
          <div className="flex flex-wrap gap-1.5 md:gap-2 pt-4 md:pt-6 border-t border-theme-border">
            {quizCategories.find(c => c.id === activeCollectionTab)?.subcategories.map((sub: any) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcollectionTab(sub.id)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md md:rounded-lg text-[10px] md:text-sm font-bold transition-all ${
                  activeSubcollectionTab === sub.id 
                    ? `${getCategoryColor(activeCollectionTab).accent} text-white shadow-md` 
                    : 'bg-theme-muted text-theme-text-muted hover:bg-theme-border'
                }`}
              >
                {sub.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-16">
      {isCollectionSearchingAll ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-theme-accent">
              {searchTerm ? `検索結果: ${searchTerm}` : 'すべてのカード'}
            </h3>
            <div className="flex-1 h-px bg-theme-border" />
          </div>

          {collectionMode === 'card' ? renderCardList(filteredTerms) : renderWordTable(filteredTerms)}
        </div>
      ) : (
        quizCategories.filter(c => c.id === activeCollectionTab).map(category => {
          const categoryTerms = category.subcategories
            .filter((sub: any) => !activeSubcollectionTab || sub.id === activeSubcollectionTab)
            .flatMap((sub: any) => sub.terms.map((t: any) => ({ term: t.name, subId: sub.id })));
          
          if (categoryTerms.length === 0) return null;

          return (
            <div key={category.id} className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className={`text-2xl font-bold ${getCategoryColor(category.id).text}`}>{category.title}</h3>
                <div className="flex-1 h-px bg-theme-border" />
              </div>

              {collectionMode === 'card' ? renderCardList(categoryTerms) : renderWordTable(categoryTerms)}
            </div>
          );
        })
      )}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-24">
          <p className="text-theme-text-muted text-xl font-theme-heading">該当するカードが見つかりませんでした。</p>
        </div>
      )}
    </motion.div>
  );
};
