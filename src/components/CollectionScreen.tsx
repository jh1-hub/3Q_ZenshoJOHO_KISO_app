import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lock, ArrowLeft, ArrowRight, XCircle } from 'lucide-react';
import { Category, Subcategory, allTermsMap } from '../data/quizData';
import { getCategoryColor, getRarityStyles } from '../lib/gameUtils';

interface PickedCard {
  term: string;
  rarity: 'UR' | 'SR' | 'R' | 'C';
  description: string;
  flavorText: string;
}

interface CollectionScreenProps {
  ownedCards: Record<string, number>;
  quizCategories: Category[];
  activeCollectionTab: string;
  setActiveCollectionTab: (id: string) => void;
  activeSubcollectionTab: string | null;
  setActiveSubcollectionTab: (id: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isCollectionSearchingAll: boolean;
  setIsCollectionSearchingAll: (isAll: boolean) => void;
  collectionMode: 'card' | 'word';
  setCollectionMode: (mode: 'card' | 'word') => void;
  wordModeIndexes: Record<string, number>;
  setWordModeIndexes: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  pickedCard: PickedCard | null;
  setPickedCard: (card: PickedCard | null) => void;
  targetCardId: string | null;
  setTargetCardId: (id: string | null) => void;
  cardRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  getTermIcon: (term: string, size?: number) => React.ReactNode;
}

export const CollectionScreen: React.FC<CollectionScreenProps> = ({
  ownedCards,
  quizCategories,
  activeCollectionTab,
  setActiveCollectionTab,
  activeSubcollectionTab,
  setActiveSubcollectionTab,
  searchTerm,
  setSearchTerm,
  isCollectionSearchingAll,
  setIsCollectionSearchingAll,
  collectionMode,
  setCollectionMode,
  wordModeIndexes,
  setWordModeIndexes,
  pickedCard,
  setPickedCard,
  targetCardId,
  setTargetCardId,
  cardRefs,
  getTermIcon
}) => {
  const filteredTerms = useMemo(() => {
    if (isCollectionSearchingAll || searchTerm) {
      let allTermsResults: { term: string; category: string; subcategoryId: string }[] = [];
      quizCategories.forEach(cat => {
        cat.subcategories.forEach(sub => {
          sub.terms.forEach(term => {
            if (!searchTerm || term.name.includes(searchTerm)) {
              allTermsResults.push({ term: term.name, category: cat.title, subcategoryId: sub.id });
            }
          });
        });
      });
      return allTermsResults;
    }

    let terms: { term: string; category: string; subcategoryId: string }[] = [];
    quizCategories.forEach(cat => {
      if (activeCollectionTab === cat.id) {
        cat.subcategories.forEach(sub => {
          if (!activeSubcollectionTab || activeSubcollectionTab === sub.id) {
            sub.terms.forEach(term => {
              terms.push({ term: term.name, category: cat.title, subcategoryId: sub.id });
            });
          }
        });
      }
    });
    return terms;
  }, [searchTerm, isCollectionSearchingAll, activeCollectionTab, activeSubcollectionTab, quizCategories]);

  const handleCardClick = (term: string) => {
    const rarity = allTermsMap[term]?.rarity || 'C';
    const descriptions = allTermsMap[term]?.descriptions || ["説明がありません。"];
    const flavorTexts = allTermsMap[term]?.flavorTexts || "フレーバーテキストがありません。";
    
    const count = ownedCards[term] || 0;
    const unlockedCount = Math.min(count, descriptions.length);
    const currentIndex = wordModeIndexes[term] || 0;
    
    setPickedCard({
      term,
      rarity,
      description: descriptions[currentIndex % unlockedCount],
      flavorText: Array.isArray(flavorTexts) ? flavorTexts[currentIndex % flavorTexts.length] : flavorTexts
    });
  };

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const term = e.currentTarget.getAttribute('data-term');
    if (!term) return;
    const count = ownedCards[term] || 0;
    if (count > 1) {
      const descriptions = allTermsMap[term]?.descriptions || ["説明がありません。"];
      const unlockedCount = Math.min(count, descriptions.length);
      if (unlockedCount > 1) {
        const currentIndex = wordModeIndexes[term] || 0;
        setWordModeIndexes(prev => ({
          ...prev,
          [term]: (currentIndex + 1) % unlockedCount
        }));
      }
    }
  };

  const formatTerm = (t: string) => {
    if (!t) return '';
    const chunks = [];
    for (let i = 0; i < t.length; i += 6) {
      chunks.push(t.substring(i, i + 6));
    }
    return chunks.join('\n');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-theme-heading font-black tracking-tight mb-2">Card Collection</h2>
          <p className="text-theme-text-muted font-bold">集めたIT用語カードを確認しよう</p>
        </div>
        <div className="flex gap-2 bg-theme-muted p-1.5 rounded-2xl border border-theme-border w-fit">
          <button
            onClick={() => setCollectionMode('card')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${collectionMode === 'card' ? 'bg-theme-card text-theme-accent shadow-sm' : 'text-theme-text-muted hover:text-theme-text'}`}
          >
            カード
          </button>
          <button
            onClick={() => setCollectionMode('word')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${collectionMode === 'word' ? 'bg-theme-card text-theme-accent shadow-sm' : 'text-theme-text-muted hover:text-theme-text'}`}
          >
            単語帳
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
            {quizCategories.find(c => c.id === activeCollectionTab)?.subcategories.map(sub => (
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

      {/* Collection Grid / List */}
      <div className="space-y-16">
        {isCollectionSearchingAll ? (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-xl md:text-2xl font-bold text-theme-accent">
                {searchTerm ? `検索結果: ${searchTerm}` : 'すべてのデータ'}
              </h3>
              <div className="flex-1 h-px bg-theme-border" />
            </div>
            {collectionMode === 'card' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                {filteredTerms.map(({ term }, index) => {
                  const rarity = allTermsMap[term]?.rarity || 'C';
                  const styles = getRarityStyles(rarity);
                  const isOwned = !!ownedCards[term];
                  const count = ownedCards[term] || 0;
                  
                  return (
                    <div key={term} className="relative h-full" style={{ isolation: 'isolate' }}>
                      {isOwned && count > 1 && (
                        <div className={`absolute inset-0 rounded-2xl border-2 ${styles.border} bg-theme-card translate-x-1.5 -translate-y-1.5 rotate-2 -z-10 opacity-60`} />
                      )}
                      {isOwned && count > 2 && (
                        <div className={`absolute inset-0 rounded-2xl border-2 ${styles.border} bg-theme-card translate-x-3 -translate-y-3 rotate-6 -z-20 opacity-30`} />
                      )}
                      
                      <motion.div 
                        ref={el => { cardRefs.current[term] = el; }}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={isOwned ? { scale: 1.05 } : {}}
                        onClick={() => handleCardClick(term)}
                        className={`relative h-full flex flex-col rounded-2xl overflow-hidden ${isOwned ? 'cursor-pointer' : 'cursor-not-allowed grayscale opacity-50'} group ${isOwned ? styles.border : 'border-2 border-dashed border-theme-border-strong'} ${isOwned ? styles.glow : ''} bg-theme-card`}
                      >
                        <div className={`absolute inset-0 ${isOwned ? styles.bg : 'bg-theme-border'} opacity-10 group-hover:opacity-20 transition-opacity`} />
                        {isOwned && styles.pulse && (
                          <div className={`absolute inset-0 ${styles.bg} opacity-20 ${styles.pulse}`} />
                        )}
                        <div className="p-4 md:p-6 flex-1 flex flex-col items-center justify-center text-center relative z-10 min-h-[140px] md:min-h-[180px]">
                          <div className={`mb-3 md:mb-4 p-3 md:p-4 rounded-xl md:rounded-2xl ${isOwned ? 'bg-theme-bg/80 backdrop-blur-sm' : 'bg-theme-muted'} shadow-sm`}>
                            {isOwned ? getTermIcon(term, 32) : <Lock size={32} className="text-theme-text-muted" />}
                          </div>
                          <h4 className={`font-bold text-sm md:text-lg leading-tight ${isOwned ? styles.textColor : 'text-theme-text-muted'}`}>
                            {isOwned ? term : '???'}
                          </h4>
                          {isOwned && count > 1 && (
                            <div className="absolute top-2 right-2 bg-theme-bg/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-theme-border shadow-sm">
                              <span className={`text-[10px] md:text-xs font-black ${styles.textColor}`}>x{count}</span>
                            </div>
                          )}
                        </div>
                        <div className={`py-1.5 md:py-2 text-center border-t ${isOwned ? 'border-theme-border/50' : 'border-theme-border-strong'} relative z-10 ${isOwned ? 'bg-theme-bg/50 backdrop-blur-sm' : 'bg-theme-muted'}`}>
                          <span className={`text-[10px] font-black tracking-widest uppercase ${isOwned ? styles.textColor : 'text-theme-text-muted'}`}>
                            {isOwned ? styles.label : 'LOCKED'}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-theme-card rounded-[2rem] border border-theme-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs md:text-sm min-w-[600px]">
                    <thead className="bg-theme-muted text-theme-text-muted border-b border-theme-border">
                      <tr>
                        <th className="p-4 font-bold w-1/4">用語</th>
                        <th className="p-4 font-bold w-2/4">説明文</th>
                        <th className="p-4 font-bold w-1/4">フレーバーテキスト</th>
                        <th className="p-4 font-bold w-24 text-center">レアリティ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-theme-border">
                      {filteredTerms.map(({ term }) => {
                        const rarity = allTermsMap[term]?.rarity || 'C';
                        const styles = getRarityStyles(rarity);
                        const isOwned = !!ownedCards[term];
                        const count = ownedCards[term] || 0;
                        const currentIndex = wordModeIndexes[term] || 0;

                        return (
                          <tr 
                            key={term} 
                            data-term={term}
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
                                  {count > 1 && (allTermsMap[term]?.descriptions?.length || 0) > 1 && (
                                    <span className="text-[10px] text-theme-accent font-bold">
                                      タップして他の説明を表示 ({currentIndex + 1}/{Math.min(count, allTermsMap[term]?.descriptions?.length || 1)})
                                    </span>
                                  )}
                                </div>
                              ) : '???'}
                            </td>
                            <td className="p-4 text-theme-text-muted italic text-xs md:text-sm">
                              {isOwned ? (Array.isArray(allTermsMap[term]?.flavorTexts) ? allTermsMap[term]?.flavorTexts[currentIndex % allTermsMap[term]?.flavorTexts.length] : allTermsMap[term]?.flavorTexts) : '???'}
                            </td>
                            <td className="p-4 text-center">
                              {isOwned ? (
                                <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${styles.bg} ${rarity === 'C' ? 'text-theme-text' : 'text-white'}`}>
                                  {styles.label}
                                </span>
                              ) : <Lock size={16} className="mx-auto" />}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          quizCategories.filter(c => c.id === activeCollectionTab).map(category => {
            const categoryTerms = filteredTerms.filter(t => t.category === category.title);
            if (categoryTerms.length === 0 && !searchTerm) return null;

            return (
              <div key={category.id} className="space-y-8">
                {collectionMode === 'card' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                    {categoryTerms.map(({ term }, index) => {
                      const rarity = allTermsMap[term]?.rarity || 'C';
                      const styles = getRarityStyles(rarity);
                      const isOwned = !!ownedCards[term];
                      const count = ownedCards[term] || 0;
                      
                      return (
                        <div key={term} className="relative h-full" style={{ isolation: 'isolate' }}>
                          {isOwned && count > 1 && (
                            <div className={`absolute inset-0 rounded-2xl border-2 ${styles.border} bg-theme-card translate-x-1.5 -translate-y-1.5 rotate-2 -z-10 opacity-60`} />
                          )}
                          {isOwned && count > 2 && (
                            <div className={`absolute inset-0 rounded-2xl border-2 ${styles.border} bg-theme-card translate-x-3 -translate-y-3 rotate-6 -z-20 opacity-30`} />
                          )}
                          
                          <motion.div 
                            ref={el => { cardRefs.current[term] = el; }}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={isOwned ? { scale: 1.05 } : {}}
                            onClick={() => handleCardClick(term)}
                            className={`relative h-full flex flex-col rounded-2xl overflow-hidden ${isOwned ? 'cursor-pointer' : 'cursor-not-allowed grayscale opacity-50'} group ${isOwned ? styles.border : 'border-2 border-dashed border-theme-border-strong'} ${isOwned ? styles.glow : ''} bg-theme-card`}
                          >
                            <div className={`absolute inset-0 ${isOwned ? styles.bg : 'bg-theme-border'} opacity-10 group-hover:opacity-20 transition-opacity`} />
                            {isOwned && styles.pulse && (
                              <div className={`absolute inset-0 ${styles.bg} opacity-20 ${styles.pulse}`} />
                            )}
                            <div className="p-4 md:p-6 flex-1 flex flex-col items-center justify-center text-center relative z-10 min-h-[140px] md:min-h-[180px]">
                              <div className={`mb-3 md:mb-4 p-3 md:p-4 rounded-xl md:rounded-2xl ${isOwned ? 'bg-theme-bg/80 backdrop-blur-sm' : 'bg-theme-muted'} shadow-sm`}>
                                {isOwned ? getTermIcon(term, 32) : <Lock size={32} className="text-theme-text-muted" />}
                              </div>
                              <h4 className={`font-bold text-sm md:text-lg leading-tight ${isOwned ? styles.textColor : 'text-theme-text-muted'}`}>
                                {isOwned ? term : '???'}
                              </h4>
                              {isOwned && count > 1 && (
                                <div className="absolute top-2 right-2 bg-theme-bg/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-theme-border shadow-sm">
                                  <span className={`text-[10px] md:text-xs font-black ${styles.textColor}`}>x{count}</span>
                                </div>
                              )}
                            </div>
                            <div className={`py-1.5 md:py-2 text-center border-t ${isOwned ? 'border-theme-border/50' : 'border-theme-border-strong'} relative z-10 ${isOwned ? 'bg-theme-bg/50 backdrop-blur-sm' : 'bg-theme-muted'}`}>
                              <span className={`text-[10px] font-black tracking-widest uppercase ${isOwned ? styles.textColor : 'text-theme-text-muted'}`}>
                                {isOwned ? styles.label : 'LOCKED'}
                              </span>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-theme-card rounded-[2rem] border border-theme-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs md:text-sm min-w-[600px]">
                        <thead className="bg-theme-muted text-theme-text-muted border-b border-theme-border">
                          <tr>
                            <th className="p-4 font-bold w-1/4">用語</th>
                            <th className="p-4 font-bold w-2/4">説明文</th>
                            <th className="p-4 font-bold w-1/4">フレーバーテキスト</th>
                            <th className="p-4 font-bold w-24 text-center">レアリティ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-theme-border">
                          {categoryTerms.map(({ term }) => {
                            const rarity = allTermsMap[term]?.rarity || 'C';
                            const styles = getRarityStyles(rarity);
                            const isOwned = !!ownedCards[term];
                            const count = ownedCards[term] || 0;
                            const currentIndex = wordModeIndexes[term] || 0;

                            return (
                              <tr 
                                key={term} 
                                data-term={term}
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
                                      {count > 1 && (allTermsMap[term]?.descriptions?.length || 0) > 1 && (
                                        <span className="text-[10px] text-theme-accent font-bold">
                                          タップして他の説明を表示 ({currentIndex + 1}/{Math.min(count, allTermsMap[term]?.descriptions?.length || 1)})
                                        </span>
                                      )}
                                    </div>
                                  ) : '???'}
                                </td>
                                <td className="p-4 text-theme-text-muted italic text-xs md:text-sm">
                                  {isOwned ? (Array.isArray(allTermsMap[term]?.flavorTexts) ? allTermsMap[term]?.flavorTexts[currentIndex % allTermsMap[term]?.flavorTexts.length] : allTermsMap[term]?.flavorTexts) : '???'}
                                </td>
                                <td className="p-4 text-center">
                                  {isOwned ? (
                                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${styles.bg} ${rarity === 'C' ? 'text-theme-text' : 'text-white'}`}>
                                      {styles.label}
                                    </span>
                                  ) : <Lock size={16} className="mx-auto" />}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {pickedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setPickedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative w-full max-w-md bg-theme-card rounded-[2rem] border-4 ${getRarityStyles(pickedCard.rarity).border} overflow-hidden shadow-2xl`}
              onClick={e => e.stopPropagation()}
            >
              <div className={`absolute inset-0 ${getRarityStyles(pickedCard.rarity).bg} opacity-10`} />
              
              <div className="p-8 relative z-10 flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-3xl ${getRarityStyles(pickedCard.rarity).bg} flex items-center justify-center mb-6 shadow-lg text-white`}>
                  {getTermIcon(pickedCard.term, 48)}
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-bold mb-4 ${getRarityStyles(pickedCard.rarity).bg} text-white`}>
                  {getRarityStyles(pickedCard.rarity).label}
                </div>
                
                <h3 className={`text-3xl font-bold mb-6 ${getRarityStyles(pickedCard.rarity).textColor}`}>
                  {pickedCard.term}
                </h3>
                
                <div className="bg-theme-bg/50 backdrop-blur-sm rounded-2xl p-6 w-full border border-theme-border mb-6">
                  <p className="text-theme-text font-medium leading-relaxed">
                    {pickedCard.description}
                  </p>
                </div>
                
                <div className="w-full">
                  <p className="text-theme-text-muted italic text-sm">
                    "{pickedCard.flavorText}"
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setPickedCard(null)}
                className="absolute top-4 right-4 text-theme-text-muted hover:text-theme-text transition-colors"
              >
                <XCircle size={32} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
