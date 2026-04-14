import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, BarChart, RotateCcw, Search } from 'lucide-react';

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
  return (
    <motion.div 
      key="term-performance"
      ref={termPerformanceRef}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 py-8 md:py-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setGameState('STATS')}
            className="p-3 bg-theme-card rounded-2xl border border-theme-border hover:bg-theme-muted transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl md:text-4xl font-theme-heading font-bold mb-1 md:mb-2">用語別分析</h2>
            <p className="text-xs md:text-sm text-theme-text-muted">すべての用語の正答率と学習状況を確認できます。</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <button 
            onClick={() => {
              setTermSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
            }}
            className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full border text-xs md:text-sm font-bold transition-all ${
              termSortOrder 
                ? 'bg-theme-accent text-white border-theme-accent shadow-lg' 
                : 'bg-theme-card text-theme-text border-theme-border hover:bg-theme-muted'
            }`}
          >
            <BarChart size={16} className="md:w-[18px] md:h-[18px]" />
            正答率でソート {termSortOrder === 'asc' ? '（昇順）' : termSortOrder === 'desc' ? '（降順）' : ''}
          </button>
          {termSortOrder && (
            <button 
              onClick={() => {
                setTermSortOrder(null);
              }}
              className="p-2 md:p-3 bg-theme-muted rounded-full text-theme-text-muted hover:text-theme-text transition-colors"
              title="ソートを解除"
            >
              <RotateCcw size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          )}
        </div>
      </div>

      {/* Search & Category Tabs (Reusing collection logic) */}
      <div className="bg-theme-card p-4 md:p-6 rounded-[2rem] shadow-sm border border-theme-border mb-8 md:mb-12">
        <div className="relative mb-6">
          <button 
            onClick={() => {
              if (!termPerformanceSearchTerm) {
                setIsTermPerformanceSearchingAll(true);
              }
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-accent transition-colors"
          >
            <Search size={20} />
          </button>
          <input 
            type="text" 
            placeholder="用語の名前で検索..."
            value={termPerformanceSearchTerm}
            onChange={(e) => {
              setTermPerformanceSearchTerm(e.target.value);
              if (e.target.value) {
                setIsTermPerformanceSearchingAll(true);
              } else {
                setIsTermPerformanceSearchingAll(false);
              }
            }}
            className="w-full pl-12 pr-4 py-4 bg-theme-bg rounded-2xl border-none focus:ring-2 focus:ring-theme-accent transition-all text-lg"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-6">
          <button
            onClick={() => {
              setIsTermPerformanceSearchingAll(true);
              setTermPerformanceSearchTerm('');
            }}
            className={`px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-base font-bold transition-all ${
              isTermPerformanceSearchingAll && !termPerformanceSearchTerm
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
                setIsTermPerformanceSearchingAll(false);
                setTermPerformanceSearchTerm('');
              }}
              className={`px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-base font-bold transition-all ${
                !isTermPerformanceSearchingAll && activeCollectionTab === cat.id 
                  ? `${getCategoryColor(cat.id).accent} text-white shadow-lg scale-105` 
                  : 'bg-theme-border text-theme-text-muted hover:bg-theme-border-strong'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Subcategory Tabs */}
        {!isTermPerformanceSearchingAll && quizCategories.find(c => c.id === activeCollectionTab)?.subcategories.length! > 0 && (
          <div className="flex flex-wrap gap-1.5 md:gap-2 pt-6 border-t border-theme-border">
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

      <div className="space-y-12">
        {isTermPerformanceSearchingAll ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xl md:text-2xl font-bold text-theme-accent">
                {termPerformanceSearchTerm ? `検索結果: ${termPerformanceSearchTerm}` : 'すべてのデータ'}
              </h3>
              <div className="flex-1 h-px bg-theme-border" />
            </div>

            <div className="bg-theme-card rounded-[2rem] border border-theme-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm min-w-[700px]">
                  <thead className="bg-theme-muted text-theme-text-muted border-b border-theme-border">
                    <tr>
                      <th className="p-4 md:p-6 font-bold w-24 md:w-32 text-center">正答率</th>
                      <th className="p-4 md:p-6 font-bold w-32 md:w-48">用語</th>
                      <th className="p-4 md:p-6 font-bold">説明文</th>
                      <th className="p-4 md:p-6 font-bold w-24 md:w-32 text-center">正解 / 出題</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-border">
                    {(() => {
                      const allMatches = quizCategories.flatMap(category => 
                        category.subcategories.flatMap((sub: any) => 
                          sub.terms.filter((t: any) => !termPerformanceSearchTerm || t.name.includes(termPerformanceSearchTerm))
                            .map((term: any) => {
                              const stat = termStats[term.name] || { correct: 0, total: 0 };
                              const rate = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
                              const ownedCount = ownedCards[term.name] || 0;
                              return { term, stat, rate, ownedCount };
                            })
                        )
                      );

                      if (termSortOrder) {
                        allMatches.sort((a, b) => {
                          if (a.rate !== b.rate) {
                            return termSortOrder === 'asc' ? a.rate - b.rate : b.rate - a.rate;
                          }
                          const aSec = a.stat.correct - a.stat.total;
                          const bSec = b.stat.correct - b.stat.total;
                          return termSortOrder === 'asc' ? aSec - bSec : bSec - aSec;
                        });
                      }

                      if (allMatches.length === 0) {
                        return (
                          <tr>
                            <td colSpan={4} className="p-12 text-center text-theme-text-muted">
                              一致する用語が見つかりませんでした。
                            </td>
                          </tr>
                        );
                      }

                      return allMatches.map(({ term, stat, rate, ownedCount }) => {
                        const descriptions = allTermsMap[term.name]?.descriptions || ["説明がありません。"];
                        const currentIndex = termPerformanceDescIndexes[term.name] || 0;
                        const isOwned = ownedCount > 0;
                        
                        return (
                          <tr 
                            key={term.name} 
                            className={`transition-colors ${isOwned && ownedCount > 1 ? 'hover:bg-theme-muted/50 cursor-pointer' : 'hover:bg-theme-muted/30'}`}
                            onClick={() => {
                              if (isOwned && ownedCount > 1) {
                                const unlockedCount = Math.min(ownedCount, descriptions.length);
                                if (unlockedCount > 1) {
                                  setTermPerformanceDescIndexes(prev => ({
                                    ...prev,
                                    [term.name]: (currentIndex + 1) % unlockedCount
                                  }));
                                }
                              }
                            }}
                          >
                            <td className="p-4 md:p-6 text-center align-middle">
                              <div className={`inline-flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${
                                stat.total === 0 ? 'bg-theme-muted text-theme-text-muted' :
                                rate < 40 ? 'bg-red-50 text-red-600 border border-red-100' :
                                rate < 70 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              }`}>
                                <span className="text-sm md:text-lg font-mono font-bold leading-none">{rate.toFixed(1)}</span>
                                <span className="text-[8px] font-bold uppercase mt-1">%</span>
                              </div>
                            </td>
                            <td className="p-4 md:p-6 align-top">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm md:text-base">
                                    {term.name}
                                  </span>
                                </div>
                                <div className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase w-fit ${
                                  isOwned ? 'bg-theme-accent/10 text-theme-accent' : 'bg-theme-muted text-theme-text-muted'
                                }`}>
                                  {isOwned ? `x${ownedCount}` : '未所持'}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 md:p-6 align-top">
                              <div className="space-y-3">
                                <p className="text-xs md:text-sm text-theme-text leading-relaxed">
                                  {descriptions[currentIndex]}
                                </p>
                              </div>
                            </td>
                            <td className="p-4 md:p-6 text-center align-middle">
                              <div className="space-y-1">
                                <p className="text-xs md:text-sm font-mono font-bold">{stat.correct} / {stat.total}</p>
                                <p className="text-[8px] md:text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">Correct / Total</p>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          quizCategories.filter(c => c.id === activeCollectionTab).map(category => {
            const categoryTerms = category.subcategories
              .filter((sub: any) => !activeSubcollectionTab || sub.id === activeSubcollectionTab)
              .flatMap((sub: any) => sub.terms.map((t: any) => ({ ...t, subId: sub.id })));
            
            const displayTerms = categoryTerms
              .filter((term: any) => !termPerformanceSearchTerm || term.name.includes(termPerformanceSearchTerm))
              .map((term: any) => {
                const stat = termStats[term.name] || { correct: 0, total: 0 };
                const rate = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
                const ownedCount = ownedCards[term.name] || 0;
                return { term, stat, rate, ownedCount };
              });

            if (termSortOrder) {
              displayTerms.sort((a: any, b: any) => {
                if (a.rate !== b.rate) {
                  return termSortOrder === 'asc' ? a.rate - b.rate : b.rate - a.rate;
                }
                const aSec = a.stat.correct - a.stat.total;
                const bSec = b.stat.correct - b.stat.total;
                return termSortOrder === 'asc' ? aSec - bSec : bSec - aSec;
              });
            }

            if (displayTerms.length === 0) return null;

            return (
              <div key={category.id} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className={`text-xl md:text-2xl font-bold ${getCategoryColor(category.id).text}`}>{category.title}</h3>
                  <div className="flex-1 h-px bg-theme-border" />
                </div>

                <div className="bg-theme-card rounded-[2rem] border border-theme-border overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs md:text-sm min-w-[700px]">
                      <thead className="bg-theme-muted text-theme-text-muted border-b border-theme-border">
                        <tr>
                          <th className="p-4 md:p-6 font-bold w-24 md:w-32 text-center">正答率</th>
                          <th className="p-4 md:p-6 font-bold w-32 md:w-48">用語</th>
                          <th className="p-4 md:p-6 font-bold">説明文</th>
                          <th className="p-4 md:p-6 font-bold w-24 md:w-32 text-center">正解 / 出題</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-border">
                        {displayTerms.map(({ term, stat, rate, ownedCount }: any) => {
                          const descriptions = allTermsMap[term.name]?.descriptions || ["説明がありません。"];
                          const currentIndex = termPerformanceDescIndexes[term.name] || 0;
                          const isOwned = ownedCount > 0;
                          
                          return (
                            <tr 
                              key={term.name} 
                              className={`transition-colors ${isOwned && ownedCount > 1 ? 'hover:bg-theme-muted/50 cursor-pointer' : 'hover:bg-theme-muted/30'}`}
                              onClick={() => {
                                if (isOwned && ownedCount > 1) {
                                  const unlockedCount = Math.min(ownedCount, descriptions.length);
                                  if (unlockedCount > 1) {
                                    setTermPerformanceDescIndexes(prev => ({
                                      ...prev,
                                      [term.name]: (currentIndex + 1) % unlockedCount
                                    }));
                                  }
                                }
                              }}
                            >
                              <td className="p-4 md:p-6 text-center align-middle">
                                <div className={`inline-flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${
                                  stat.total === 0 ? 'bg-theme-muted text-theme-text-muted' :
                                  rate < 40 ? 'bg-red-50 text-red-600 border border-red-100' :
                                  rate < 70 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                  'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                }`}>
                                  <span className="text-sm md:text-lg font-mono font-bold leading-none">{rate.toFixed(1)}</span>
                                  <span className="text-[8px] font-bold uppercase mt-1">%</span>
                                </div>
                              </td>
                              <td className="p-4 md:p-6 align-top">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm md:text-base">
                                      {term.name}
                                    </span>
                                  </div>
                                  <div className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase w-fit ${
                                    isOwned ? 'bg-theme-accent/10 text-theme-accent' : 'bg-theme-muted text-theme-text-muted'
                                  }`}>
                                    {isOwned ? `x${ownedCount}` : '未所持'}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 md:p-6 align-top">
                                <div className="space-y-3">
                                  <p className="text-xs md:text-sm text-theme-text leading-relaxed">
                                    {descriptions[currentIndex]}
                                  </p>
                                </div>
                              </td>
                              <td className="p-4 md:p-6 text-center align-middle">
                                <div className="space-y-1">
                                  <p className="text-xs md:text-sm font-mono font-bold">{stat.correct} / {stat.total}</p>
                                  <p className="text-[8px] md:text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">Correct / Total</p>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};
