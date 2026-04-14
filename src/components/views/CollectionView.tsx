import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, LayoutGrid, List, Search, Lock } from 'lucide-react';
import { getTermIcon } from '../../lib/termIcon';

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

          {collectionMode === 'card' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {filteredTerms.map(({ term, subId }) => {
                const rarity = allTermsMap[term]?.rarity || 'C';
                const styles = getRarityStyles(rarity);
                const isOwned = !!ownedCards[term];
                const count = ownedCards[term] || 0;
                
                return (
                  <div 
                    key={term} 
                    ref={el => {
                      if (cardRefs.current) {
                        cardRefs.current[term] = el;
                      }
                    }}
                    className={`aspect-[3/4] relative ${targetCardId === term ? 'ring-4 ring-amber-400 ring-offset-4 ring-offset-theme-bg rounded-2xl z-10 scale-105 transition-all' : ''}`}
                  >
                    <motion.div
                      whileHover={isOwned ? { scale: 1.05, y: -5 } : {}}
                      onClick={() => handleCardClick(term)}
                      className={`relative h-full flex flex-col rounded-2xl overflow-hidden ${isOwned ? 'cursor-pointer' : 'cursor-not-allowed grayscale opacity-50'} group ${isOwned ? styles.border : 'border-2 border-dashed border-theme-border-strong'} ${isOwned ? styles.glow : ''} bg-theme-card`}
                    >
                      {/* Card Backgrounds */}
                      <div className={`absolute inset-0 ${isOwned ? styles.bg : 'bg-theme-border'} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    
                    {/* Pulse Effect (Behind Content) */}
                    {isOwned && styles.pulse && (
                      <div className={`absolute inset-0 ${styles.bg} opacity-15 ${styles.pulse} z-0`} />
                    )}

                    <div className="flex-1 flex flex-col bg-transparent relative z-10" style={{ perspective: 1000 }}>
                      {/* Card Header */}
                      <div className={`px-2 py-1.5 md:px-3 md:py-2 flex justify-between items-center shrink-0 ${isOwned && rarity !== 'C' ? styles.bg : 'bg-theme-muted'} ${isOwned && rarity !== 'C' ? 'text-white' : 'text-theme-text-muted'}`}>
                        <span className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase drop-shadow-sm">{isOwned ? styles.label : 'LOCKED'}</span>
                        {isOwned && count > 1 && (
                          <span className="text-[8px] md:text-[10px] font-bold bg-theme-card/20 px-1.5 py-0.5 rounded-full">x{count}</span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="flex-1 p-3 md:p-4 flex flex-col items-center justify-start text-center space-y-2 md:space-y-3">
                        <div className={`hidden md:flex w-12 h-12 shrink-0 rounded-xl items-center justify-center ${isOwned ? styles.bg : 'bg-theme-border'} ${isOwned ? (rarity === 'C' ? 'text-theme-text' : 'text-white') : 'text-theme-text-muted'} shadow-inner`}>
                          {isOwned ? getTermIcon(term, 20) : <Lock size={20} />}
                        </div>
                        
                        <div className="space-y-0.5 w-full shrink-0">
                          <h3 className={`text-sm md:text-base font-bold leading-tight ${isOwned ? 'text-theme-text' : 'text-theme-text-muted'} break-words drop-shadow-sm`}>{isOwned ? term : '???'}</h3>
                        </div>

                        {isOwned && (
                            <motion.div 
                              key={pickedCard?.term === term ? pickedCard.descriptionIndex : 0}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              className="pt-2 md:pt-3 border-t border-theme-border w-full flex-1 flex flex-col justify-between"
                            >
                            <p className="text-[10px] md:text-xs text-theme-text leading-relaxed text-left mb-1 drop-shadow-sm font-bold">
                              {(allTermsMap[term]?.descriptions || ["説明がありません。"])[pickedCard?.term === term ? pickedCard.descriptionIndex : 0]}
                            </p>
                            {allTermsMap[term]?.flavorTexts && (
                              <p className="text-[8px] md:text-[10px] text-theme-text-muted leading-relaxed text-left mb-2 italic">
                                {(() => {
                                  const flavor = allTermsMap[term]?.flavorTexts;
                                  const idx = pickedCard?.term === term ? pickedCard.descriptionIndex : 0;
                                  if (Array.isArray(flavor)) {
                                    return flavor[idx % flavor.length];
                                  }
                                  return flavor;
                                })()}
                              </p>
                            )}
                            <div className="flex justify-center gap-1 mt-auto pb-1">
                              {[...Array(Math.min(allTermsMap[term]?.descriptions?.length || 1, 3))].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                                    (pickedCard?.term === term ? i === pickedCard.descriptionIndex : i === 0)
                                      ? (isOwned ? styles.bg : 'bg-theme-text-muted') 
                                      : (i < count ? 'bg-theme-border-strong' : 'bg-theme-border')
                                  }`} 
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
                );
              })}
            </div>
          ) : (
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
                  {filteredTerms.map(({ term }, index) => {
                    const rarity = allTermsMap[term]?.rarity || 'C';
                    const styles = getRarityStyles(rarity);
                    const isOwned = !!ownedCards[term];
                    const count = ownedCards[term] || 0;
                    const currentIndex = wordModeIndexes[term] || 0;
                    
                    const handleRowClick = () => {
                      const maxDescriptions = Math.min(allTermsMap[term]?.descriptions?.length || 1, 3);
                      if (isOwned && count > 1 && maxDescriptions > 1) {
                        setWordModeIndexes(prev => ({
                          ...prev,
                          [term]: (currentIndex + 1) % Math.min(count, maxDescriptions)
                        }));
                      }
                    };

                    // Helper to wrap term every 6 characters for mobile
                    const formatTerm = (t: string) => {
                      if (!t) return '';
                      const chunks = [];
                      for (let i = 0; i < t.length; i += 6) {
                        chunks.push(t.substring(i, i + 6));
                      }
                      return chunks.join('\n');
                    };

                    return (
                      <tr 
                        key={term} 
                        onClick={handleRowClick}
                        className={`${isOwned ? 'hover:bg-theme-muted/50 cursor-pointer' : 'opacity-50'} transition-colors`}
                      >
                        <td className="p-4 font-bold align-top">
                          {isOwned ? (
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                              <span className="hidden md:inline">{term}</span>
                              <span className="md:hidden whitespace-pre-wrap leading-tight">{formatTerm(term)}</span>
                              {count > 1 && (
                                <span className="text-[10px] bg-theme-border px-1.5 py-0.5 rounded-full text-theme-text-muted w-fit">x{count}</span>
                              )}
                            </div>
                          ) : '???'}
                        </td>
                        <td className="p-4">
                          {isOwned ? (
                            <div className="flex flex-col gap-1">
                              <span>{(allTermsMap[term]?.descriptions || ["説明がありません。"])[currentIndex]}</span>
                              {Math.min(count, allTermsMap[term]?.descriptions?.length || 1, 3) > 1 && (
                                <div className="flex gap-1 mt-1">
                                  {[...Array(Math.min(count, allTermsMap[term]?.descriptions?.length || 1, 3))].map((_, i) => (
                                    <div 
                                      key={i} 
                                      className={`w-1.5 h-1.5 rounded-full ${i === currentIndex ? styles.bg : 'bg-theme-border-strong'}`} 
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : '???'}
                        </td>
                        <td className="p-4 text-theme-text-muted italic text-xs md:text-sm">
                          {isOwned ? (
                            (() => {
                              const flavor = allTermsMap[term]?.flavorTexts;
                              if (Array.isArray(flavor)) {
                                return flavor[currentIndex % flavor.length];
                              }
                              return flavor;
                            })()
                          ) : '???'}
                        </td>
                        <td className="p-4 text-center">
                          {isOwned ? (
                            <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${styles.bg} ${rarity === 'C' ? 'text-theme-text' : 'text-white'}`}>
                              {styles.label}
                            </span>
                          ) : (
                            <span className="text-theme-text-muted"><Lock size={16} className="mx-auto" /></span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        quizCategories.filter(c => c.id === activeCollectionTab).map(category => {
          const categoryTerms = category.subcategories
            .filter((sub: any) => !activeSubcollectionTab || sub.id === activeSubcollectionTab)
            .flatMap((sub: any) => sub.terms.map((t: any) => ({ ...t, subId: sub.id })));
          
          if (categoryTerms.length === 0) return null;

          return (
            <div key={category.id} className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className={`text-2xl font-bold ${getCategoryColor(category.id).text}`}>{category.title}</h3>
                <div className="flex-1 h-px bg-theme-border" />
              </div>

              {collectionMode === 'card' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                  {categoryTerms.map(({ term, subId }: any) => {
                    const rarity = allTermsMap[term]?.rarity || 'C';
                    const styles = getRarityStyles(rarity);
                    const isOwned = !!ownedCards[term];
                    const count = ownedCards[term] || 0;
                    
                    return (
                      <div 
                        key={term} 
                        ref={el => {
                          if (cardRefs.current) {
                            cardRefs.current[term] = el;
                          }
                        }}
                        className={`aspect-[3/4] relative ${targetCardId === term ? 'ring-4 ring-amber-400 ring-offset-4 ring-offset-theme-bg rounded-2xl z-10 scale-105 transition-all' : ''}`}
                      >
                        <motion.div
                          whileHover={isOwned ? { scale: 1.05, y: -5 } : {}}
                          onClick={() => handleCardClick(term)}
                          className={`relative h-full flex flex-col rounded-2xl overflow-hidden ${isOwned ? 'cursor-pointer' : 'cursor-not-allowed grayscale opacity-50'} group ${isOwned ? styles.border : 'border-2 border-dashed border-theme-border-strong'} ${isOwned ? styles.glow : ''} bg-theme-card`}
                        >
                          {/* Card Backgrounds */}
                          <div className={`absolute inset-0 ${isOwned ? styles.bg : 'bg-theme-border'} opacity-10 group-hover:opacity-20 transition-opacity`} />
                        
                        {/* Pulse Effect (Behind Content) */}
                        {isOwned && styles.pulse && (
                          <div className={`absolute inset-0 ${styles.bg} opacity-15 ${styles.pulse} z-0`} />
                        )}

                        <div className="flex-1 flex flex-col bg-transparent relative z-10" style={{ perspective: 1000 }}>
                          {/* Card Header */}
                          <div className={`px-2 py-1.5 md:px-3 md:py-2 flex justify-between items-center shrink-0 ${isOwned && rarity !== 'C' ? styles.bg : 'bg-theme-muted'} ${isOwned && rarity !== 'C' ? 'text-white' : 'text-theme-text-muted'}`}>
                            <span className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase drop-shadow-sm">{isOwned ? styles.label : 'LOCKED'}</span>
                            {isOwned && count > 1 && (
                              <span className="text-[8px] md:text-[10px] font-bold bg-theme-card/20 px-1.5 py-0.5 rounded-full">x{count}</span>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="flex-1 p-3 md:p-4 flex flex-col items-center justify-start text-center space-y-2 md:space-y-3">
                            <div className={`hidden md:flex w-12 h-12 shrink-0 rounded-xl items-center justify-center ${isOwned ? styles.bg : 'bg-theme-border'} ${isOwned ? (rarity === 'C' ? 'text-theme-text' : 'text-white') : 'text-theme-text-muted'} shadow-inner`}>
                              {isOwned ? getTermIcon(term, 20) : <Lock size={20} />}
                            </div>
                            
                            <div className="space-y-0.5 w-full shrink-0">
                              <h3 className={`text-sm md:text-base font-bold leading-tight ${isOwned ? 'text-theme-text' : 'text-theme-text-muted'} break-words drop-shadow-sm`}>{isOwned ? term : '???'}</h3>
                            </div>

                            {isOwned && (
                                <motion.div 
                                  key={pickedCard?.term === term ? pickedCard.descriptionIndex : 0}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ duration: 0.5, ease: "easeInOut" }}
                                  className="pt-2 md:pt-3 border-t border-theme-border w-full flex-1 flex flex-col justify-between"
                                >
                                <p className="text-[10px] md:text-xs text-theme-text leading-relaxed text-left mb-1 drop-shadow-sm font-bold">
                                  {(allTermsMap[term]?.descriptions || ["説明がありません。"])[pickedCard?.term === term ? pickedCard.descriptionIndex : 0]}
                                </p>
                                {allTermsMap[term]?.flavorTexts && (
                                  <p className="text-[8px] md:text-[10px] text-theme-text-muted leading-relaxed text-left mb-2 italic">
                                    {(() => {
                                      const flavor = allTermsMap[term]?.flavorTexts;
                                      const idx = pickedCard?.term === term ? pickedCard.descriptionIndex : 0;
                                      if (Array.isArray(flavor)) {
                                        return flavor[idx % flavor.length];
                                      }
                                      return flavor;
                                    })()}
                                  </p>
                                )}
                                <div className="flex justify-center gap-1 mt-auto pb-1">
                                  {[...Array(Math.min(allTermsMap[term]?.descriptions?.length || 1, 3))].map((_, i) => (
                                    <div 
                                      key={i} 
                                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                                        (pickedCard?.term === term ? i === pickedCard.descriptionIndex : i === 0)
                                          ? (isOwned ? styles.bg : 'bg-theme-text-muted') 
                                          : (i < count ? 'bg-theme-border-strong' : 'bg-theme-border')
                                      }`} 
                                    />
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    );
                  })}
                </div>
              ) : (
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
                      {categoryTerms.map(({ term }: any, index: number) => {
                        const rarity = allTermsMap[term]?.rarity || 'C';
                        const styles = getRarityStyles(rarity);
                        const isOwned = !!ownedCards[term];
                        const count = ownedCards[term] || 0;
                        const currentIndex = wordModeIndexes[term] || 0;
                        
                        const handleRowClick = () => {
                          const maxDescriptions = Math.min(allTermsMap[term]?.descriptions?.length || 1, 3);
                          if (isOwned && count > 1 && maxDescriptions > 1) {
                            setWordModeIndexes(prev => ({
                              ...prev,
                              [term]: (currentIndex + 1) % Math.min(count, maxDescriptions)
                            }));
                          }
                        };

                        // Helper to wrap term every 6 characters for mobile
                        const formatTerm = (t: string) => {
                          if (!t) return '';
                          const chunks = [];
                          for (let i = 0; i < t.length; i += 6) {
                            chunks.push(t.substring(i, i + 6));
                          }
                          return chunks.join('\n');
                        };

                        return (
                          <tr 
                            key={term} 
                            onClick={handleRowClick}
                            className={`${isOwned ? 'hover:bg-theme-muted/50 cursor-pointer' : 'opacity-50'} transition-colors`}
                          >
                            <td className="p-4 font-bold align-top">
                              {isOwned ? (
                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                  <span className="hidden md:inline">{term}</span>
                                  <span className="md:hidden whitespace-pre-wrap leading-tight">{formatTerm(term)}</span>
                                  {count > 1 && (
                                    <span className="text-[10px] bg-theme-border px-1.5 py-0.5 rounded-full text-theme-text-muted w-fit">x{count}</span>
                                  )}
                                </div>
                              ) : '???'}
                            </td>
                            <td className="p-4">
                              {isOwned ? (
                                <div className="flex flex-col gap-1">
                                  <span>{(allTermsMap[term]?.descriptions || ["説明がありません。"])[currentIndex]}</span>
                                  {Math.min(count, allTermsMap[term]?.descriptions?.length || 1, 3) > 1 && (
                                    <div className="flex gap-1 mt-1">
                                      {[...Array(Math.min(count, allTermsMap[term]?.descriptions?.length || 1, 3))].map((_, i) => (
                                        <div 
                                          key={i} 
                                          className={`w-1.5 h-1.5 rounded-full ${i === currentIndex ? styles.bg : 'bg-theme-border-strong'}`} 
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : '???'}
                            </td>
                            <td className="p-4 text-theme-text-muted italic text-xs md:text-sm">
                              {isOwned ? (
                                (() => {
                                  const flavor = allTermsMap[term]?.flavorTexts;
                                  if (Array.isArray(flavor)) {
                                    return flavor[currentIndex % flavor.length];
                                  }
                                  return flavor;
                                })()
                              ) : '???'}
                            </td>
                            <td className="p-4 text-center">
                              {isOwned ? (
                                <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${styles.bg} ${rarity === 'C' ? 'text-theme-text' : 'text-white'}`}>
                                  {styles.label}
                                </span>
                              ) : (
                                <span className="text-theme-text-muted"><Lock size={16} className="mx-auto" /></span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
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
