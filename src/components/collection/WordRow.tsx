import React from 'react';
import { Lock } from 'lucide-react';

interface WordRowProps {
  term: string;
  subId: string;
  rarity: string;
  styles: any;
  isOwned: boolean;
  count: number;
  currentIndex: number;
  allTermsMap: Record<string, any>;
  onRowClick: () => void;
}

export const WordRow: React.FC<WordRowProps> = ({
  term,
  subId,
  rarity,
  styles,
  isOwned,
  count,
  currentIndex,
  allTermsMap,
  onRowClick
}) => {
  // Helper to wrap term every 6 characters for mobile
  const formatTerm = (t: string) => {
    if (!t) return '';
    const chunks = [];
    for (let i = 0; i < t.length; i += 6) {
      chunks.push(t.substring(i, i + 6));
    }
    return chunks.join('\n');
  };

  const descriptions = allTermsMap[term]?.descriptions || ["説明がありません。"];
  const flavorTexts = allTermsMap[term]?.flavorTexts;
  const maxDescriptions = Math.min(descriptions.length, 3);

  return (
    <tr 
      onClick={onRowClick}
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
            <span>{descriptions[currentIndex]}</span>
            {Math.min(count, maxDescriptions) > 1 && (
              <div className="flex gap-1 mt-1">
                {[...Array(Math.min(count, maxDescriptions))].map((_, i) => (
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
            if (Array.isArray(flavorTexts)) {
              return flavorTexts[currentIndex % flavorTexts.length];
            }
            return flavorTexts;
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
};
