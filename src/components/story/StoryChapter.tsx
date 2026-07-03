import React from 'react';
import { StoryCard } from '../../data/storyData';
import { StoryItem } from './StoryItem';

interface StoryChapterProps {
  chapter: string;
  chapterCards: StoryCard[];
  userLevel: number;
  setShowStoryCard: (card: StoryCard | null) => void;
}

export const StoryChapter: React.FC<StoryChapterProps> = ({
  chapter,
  chapterCards,
  userLevel,
  setShowStoryCard
}) => {
  const unlockedInChapter = chapterCards.filter(c => c.id < userLevel || (c.id === 99 && userLevel >= 99));
  
  if (unlockedInChapter.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h3 className="text-2xl font-bold text-theme-accent">{chapter}</h3>
        <div className="flex-1 h-px bg-theme-border" />
        <span className="text-xs font-bold text-theme-text-muted uppercase tracking-widest">
          {unlockedInChapter.length} / {chapterCards.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapterCards.map(card => {
          const isUnlocked = card.id < userLevel || (card.id === 99 && userLevel >= 99);
          return (
            <StoryItem
              key={card.id}
              card={card}
              isUnlocked={isUnlocked}
              onClick={() => isUnlocked && setShowStoryCard(card)}
            />
          );
        })}
      </div>
    </div>
  );
};
