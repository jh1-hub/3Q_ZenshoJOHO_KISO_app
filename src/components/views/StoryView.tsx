import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock } from 'lucide-react';
import { storyCards, StoryCard } from '../../data/storyData';
import { StoryChapter } from '../story/StoryChapter';

interface StoryViewProps {
  setGameState: (state: any) => void;
  userLevel: number;
  setShowStoryCard: (card: StoryCard | null) => void;
}

export const StoryView: React.FC<StoryViewProps> = ({
  setGameState,
  userLevel,
  setShowStoryCard
}) => {
  const chapters = ["プロローグ", "第一章：企業活動と情報処理", "第二章：コンピュータシステムと情報通信ネットワーク", "第三章：情報セキュリティの確保と法規", "第四章：情報の集計と分析", "最終章：統合判断", "アフターエピソード：それから"];

  return (
    <motion.div 
      key="story"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-6 py-12"
    >
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => setGameState('START')}
          className="p-3 bg-theme-card rounded-2xl border border-theme-border hover:bg-theme-muted transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-4xl font-theme-heading font-bold mb-2">Story Archive</h2>
          <p className="text-theme-text-muted">解放されたストーリーを振り返ることができます。</p>
        </div>
        <div className="ml-auto text-right hidden md:block">
          <p className="text-xs font-bold text-theme-text-muted uppercase tracking-widest mb-1">Total Progress</p>
          <div className="flex items-center gap-3">
            <div className="w-48 h-2 bg-theme-border rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(Math.max(0, userLevel - 1) / 98) * 100}%` }}
                className="h-full bg-amber-500"
              />
            </div>
            <span className="text-xl font-mono font-bold text-amber-500">{Math.max(0, userLevel - 1)} / 98</span>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {chapters.map(chapter => (
          <StoryChapter
            key={chapter}
            chapter={chapter}
            chapterCards={storyCards.filter(c => c.chapter === chapter)}
            userLevel={userLevel}
            setShowStoryCard={setShowStoryCard}
          />
        ))}
        
        {userLevel < 2 && (
          <div className="text-center py-20 bg-theme-card rounded-[3rem] border-2 border-dashed border-theme-border">
            <div className="w-20 h-20 bg-theme-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={40} className="text-theme-text-muted" />
            </div>
            <h3 className="text-xl font-bold mb-2">ストーリーはまだありません</h3>
            <p className="text-theme-text-muted">レベル2になると最初のストーリーが解放されます。</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
