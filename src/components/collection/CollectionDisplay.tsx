import React from 'react';
import { CardItem } from './CardItem';
import { WordRow } from './WordRow';

interface CollectionDisplayProps {
  collectionMode: 'card' | 'word';
  filteredTerms: any[];
  isCollectionSearchingAll: boolean;
  searchTerm: string;
  quizCategories: any[];
  activeCollectionTab: string;
  activeSubcollectionTab: string | null;
  getCategoryColor: (id: string) => any;
  allTermsMap: Record<string, any>;
  ownedCards: Record<string, number>;
  targetCardId: string | null;
  pickedCard: { term: string; descriptionIndex: number } | null;
  getRarityStyles: (rarity: string) => any;
  handleCardClick: (term: string) => void;
  cardRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  wordModeIndexes: Record<string, number>;
  onWordRowClick: (term: string) => void;
}

export const CollectionDisplay: React.FC<CollectionDisplayProps> = ({
  collectionMode,
  filteredTerms,
  isCollectionSearchingAll,
  searchTerm,
  quizCategories,
  activeCollectionTab,
  activeSubcollectionTab,
  getCategoryColor,
  allTermsMap,
  ownedCards,
  targetCardId,
  pickedCard,
  getRarityStyles,
  handleCardClick,
  cardRefs,
  wordModeIndexes,
  onWordRowClick
}) => {
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
              onRowClick={() => onWordRowClick(term)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
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

      {filteredTerms.length === 0 && (
        <div className="text-center py-24">
          <p className="text-theme-text-muted text-xl font-theme-heading">該当するカードが見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
};
