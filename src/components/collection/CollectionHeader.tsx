import React from 'react';
import { ChevronLeft, LayoutGrid, List } from 'lucide-react';

interface CollectionHeaderProps {
  setGameState: (state: any) => void;
  allTermsCount: number;
  collectionMode: 'card' | 'word';
  setCollectionMode: (mode: 'card' | 'word') => void;
}

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  setGameState,
  allTermsCount,
  collectionMode,
  setCollectionMode
}) => {
  return (
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
          <p className="text-theme-text-muted">知識をカードとして集めよう。{allTermsCount}枚のカードを収録。</p>
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
  );
};
