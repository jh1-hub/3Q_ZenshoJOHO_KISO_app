import React from 'react';
import { PerformanceRow } from './PerformanceRow';

interface PerformanceTableProps {
  isTermPerformanceSearchingAll: boolean;
  termPerformanceSearchTerm: string;
  quizCategories: any[];
  termStats: Record<string, { correct: number; total: number }>;
  ownedCards: Record<string, number>;
  termSortOrder: 'asc' | 'desc' | null;
  activeCollectionTab: string;
  activeSubcollectionTab: string | null;
  getCategoryColor: (id: string) => any;
  allTermsMap: Record<string, any>;
  termPerformanceDescIndexes: Record<string, number>;
  onRowClick: (termName: string, ownedCount: number, descriptions: string[]) => void;
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({
  isTermPerformanceSearchingAll,
  termPerformanceSearchTerm,
  quizCategories,
  termStats,
  ownedCards,
  termSortOrder,
  activeCollectionTab,
  activeSubcollectionTab,
  getCategoryColor,
  allTermsMap,
  termPerformanceDescIndexes,
  onRowClick
}) => {
  const renderTable = (terms: any[]) => (
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
            {terms.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-theme-text-muted">
                  一致する用語が見つかりませんでした。
                </td>
              </tr>
            ) : (
              terms.map(({ term, stat, rate, ownedCount }) => {
                const descriptions = allTermsMap[term.name]?.descriptions || ["説明がありません。"];
                return (
                  <PerformanceRow
                    key={term.name}
                    termName={term.name}
                    stat={stat}
                    rate={rate}
                    ownedCount={ownedCount}
                    descriptions={descriptions}
                    currentIndex={termPerformanceDescIndexes[term.name] || 0}
                    onRowClick={() => onRowClick(term.name, ownedCount, descriptions)}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {isTermPerformanceSearchingAll ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl md:text-2xl font-bold text-theme-accent">
              {termPerformanceSearchTerm ? `検索結果: ${termPerformanceSearchTerm}` : 'すべてのデータ'}
            </h3>
            <div className="flex-1 h-px bg-theme-border" />
          </div>

          {renderTable(
            (() => {
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
              return allMatches;
            })()
          )}
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

              {renderTable(displayTerms)}
            </div>
          );
        })
      )}
    </div>
  );
};
