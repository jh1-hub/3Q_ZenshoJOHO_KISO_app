import React from 'react';
import { Search } from 'lucide-react';

interface CollectionFiltersProps {
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
}

export const CollectionFilters: React.FC<CollectionFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  isCollectionSearchingAll,
  setIsCollectionSearchingAll,
  activeCollectionTab,
  setActiveCollectionTab,
  activeSubcollectionTab,
  setActiveSubcollectionTab,
  quizCategories,
  getCategoryColor
}) => {
  return (
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
  );
};
