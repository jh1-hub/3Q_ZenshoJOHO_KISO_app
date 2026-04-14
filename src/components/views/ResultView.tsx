import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Zap, LayoutGrid, RotateCcw, ArrowRight } from 'lucide-react';
import { SpeedLines } from '../effects/SpeedLines';
import { HaloEffect } from '../effects/HaloEffect';
import { Burst } from '../effects/Burst';
import { GachaRollingOverlay } from '../gacha/GachaRollingOverlay';

interface ResultViewProps {
  speedStarCorrectCount: number;
  selectedSubcategory: any;
  getGachaPullCount: () => number;
  isDailyChallenge: boolean;
  questions: any[];
  correctCount: number;
  gachaResults: any[];
  pullGacha: () => void;
  isGachaRolling: boolean;
  score: number;
  maxCombo: number;
  hasBonusTicket: boolean;
  startSpeedStar: () => void;
  resetQuizState: () => void;
  setGameState: (state: any) => void;
  startComprehensiveQuiz: () => void;
  startQuiz: (category: any) => void;
  currentGachaCard: any;
  getRarityStyles: (rarity: string) => any;
  allTermsMap: Record<string, any>;
  getTermIcon: (term: string, size: number) => React.ReactNode;
  quizCategories: any[];
  gachaHistory: any[];
  gachaQueue: number;
  handleRedraw: () => void;
  handleKeepCard: (action: 'next' | 'close' | 'collection') => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  speedStarCorrectCount,
  selectedSubcategory,
  getGachaPullCount,
  isDailyChallenge,
  questions,
  correctCount,
  gachaResults,
  pullGacha,
  isGachaRolling,
  score,
  maxCombo,
  hasBonusTicket,
  startSpeedStar,
  resetQuizState,
  setGameState,
  startComprehensiveQuiz,
  startQuiz,
  currentGachaCard,
  getRarityStyles,
  allTermsMap,
  getTermIcon,
  quizCategories,
  gachaHistory,
  gachaQueue,
  handleRedraw,
  handleKeepCard
}) => {
  return (
    <motion.div 
      key="result"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-2xl mx-auto p-4 md:p-6 py-8 md:py-12 text-center overflow-x-hidden"
    >
      <div className="bg-theme-card p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-theme-border mb-8">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="inline-block p-4 md:p-6 bg-theme-bg rounded-full mb-4 md:mb-6"
        >
          <Trophy size={48} className="text-theme-secondary md:w-16 md:h-16" />
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-theme-heading font-bold mb-2">
          {speedStarCorrectCount > 0 && !selectedSubcategory ? 'Speed Star Result!' : 'Quiz Complete!'}
        </h2>
        <p className="text-sm md:text-base text-theme-text-muted mb-6 md:mb-8">
          {speedStarCorrectCount > 0 && !selectedSubcategory ? `Correct Answers: ${speedStarCorrectCount}` : selectedSubcategory?.title}
        </p>
        
        {/* Gacha Section */}
        <div className="mb-8 md:mb-12">
          <div className="bg-theme-bg p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm text-center">
            <h3 className="text-xl md:text-2xl font-theme-heading font-bold mb-3 md:mb-4">
              {speedStarCorrectCount > 0 && !selectedSubcategory ? 'Speed Star Bonus' : '学習完了ボーナス'}
            </h3>
            
            {getGachaPullCount() > 0 && (isDailyChallenge || (speedStarCorrectCount > 0 && !selectedSubcategory) || (questions.length > 0 && (correctCount / questions.length) >= 0.5)) ? (
              <div className="space-y-4 md:space-y-6">
                <p className="text-sm md:text-base text-theme-text-muted">
                  {speedStarCorrectCount > 0 && !selectedSubcategory 
                    ? 'スピードスター達成！結果に応じてガチャを引けます。' 
                    : isDailyChallenge 
                      ? 'デイリーチャレンジ完了！特別ボーナスが適用されます。'
                      : '正解率50%以上達成！カードガチャを引くことができます。'}
                </p>
                
                {isDailyChallenge && (
                  <div className="flex items-center justify-center gap-2 text-indigo-500 font-bold bg-indigo-50 py-2 px-4 rounded-full mb-2 animate-pulse border border-indigo-100">
                    <Sparkles size={16} />
                    <span className="text-xs md:text-sm">デイリーボーナス：+1枚引けます！</span>
                  </div>
                )}

                <p className="text-xs md:text-sm text-theme-accent font-bold">
                  {speedStarCorrectCount > 0 && !selectedSubcategory ? `スピードスターボーナス：${getGachaPullCount()}枚引けます！` :
                   questions.length === 20 ? '総合演習ボーナス：5枚引けます！' : 
                   questions.length === 10 ? '単元演習ボーナス：2枚引けます！' : 
                   isDailyChallenge ? ((correctCount / questions.length) >= 0.5 ? '1枚 + ボーナス1枚引けます！' : 'デイリーボーナス：1枚引けます！') :
                   '1枚引けます！'}
                </p>
                
                {gachaResults.length === 0 && (
                  <button 
                    onClick={pullGacha}
                    disabled={isGachaRolling}
                    className={`w-full md:w-auto px-8 py-4 md:px-12 md:py-6 rounded-full text-lg md:text-xl font-bold shadow-xl transition-all ${
                      isGachaRolling 
                        ? 'bg-theme-border-strong text-theme-text-muted cursor-not-allowed' 
                        : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isGachaRolling ? 'ガチャを回しています...' : 'ガチャを引く！'}
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 md:p-6 bg-theme-card rounded-2xl text-theme-text-muted font-bold">
                <p className="text-sm md:text-base">正解率が50%未満のため、ガチャは引けません。</p>
                <p className="text-xs md:text-sm font-normal mt-2">次はもっと頑張りましょう！</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="p-4 md:p-6 bg-theme-bg rounded-2xl md:rounded-3xl">
            <p className="text-[10px] md:text-xs text-theme-text-muted uppercase font-bold mb-1">Total Score</p>
            <p className="text-2xl md:text-3xl font-mono font-bold">{score.toLocaleString()}</p>
          </div>
          <div className="p-4 md:p-6 bg-theme-bg rounded-2xl md:rounded-3xl">
            <p className="text-[10px] md:text-xs text-theme-text-muted uppercase font-bold mb-1">Max Combo</p>
            <p className="text-2xl md:text-3xl font-mono font-bold">{maxCombo}</p>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          {hasBonusTicket && (
            <button 
              onClick={startSpeedStar}
              className="w-full py-4 md:py-5 bg-black text-amber-400 border-2 border-amber-400 rounded-2xl text-lg md:text-xl font-bold flex items-center justify-center gap-3 hover:bg-amber-400/10 transition-colors"
            >
              <Zap size={24} className="animate-pulse" /> SPEED STAR に挑戦
            </button>
          )}
          <button 
            onClick={() => {
              resetQuizState();
              setGameState('CATEGORY_SELECT');
            }}
            className="w-full py-4 md:py-5 bg-theme-text text-theme-bg text-white rounded-2xl text-lg md:text-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-colors"
          >
            <LayoutGrid size={24} /> 他の単元を選ぶ
          </button>
          <button 
            onClick={() => {
              if (selectedSubcategory?.id === 'all') {
                startComprehensiveQuiz();
              } else if (selectedSubcategory) {
                startQuiz(selectedSubcategory as any);
              }
            }}
            className="w-full py-4 md:py-5 bg-theme-card border-2 border-theme-border-strong text-theme-text rounded-2xl text-lg md:text-xl font-bold flex items-center justify-center gap-3 hover:bg-theme-muted transition-colors"
          >
            <RotateCcw size={24} /> もう一度挑戦
          </button>
        </div>

        {/* Gacha Rolling Overlay */}
        <AnimatePresence>
          {isGachaRolling && <GachaRollingOverlay />}
        </AnimatePresence>

        {/* Full Screen Gacha Animation Overlay */}
        <AnimatePresence>
          {currentGachaCard && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 overflow-y-auto"
            >
              <SpeedLines />
              
              {/* Reveal Flash */}
              <motion.div
                key={`flash-${currentGachaCard.term}-${currentGachaCard.redrawsUsed}`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className={`absolute inset-0 z-[250] pointer-events-none ${getRarityStyles(allTermsMap[currentGachaCard.term]?.rarity || 'C').flash}`}
              />

              <HaloEffect rarity={allTermsMap[currentGachaCard.term]?.rarity || 'C'} />
              
              {/* Burst Effect */}
              <Burst 
                color={getRarityStyles(allTermsMap[currentGachaCard.term]?.rarity || 'C').flash} 
                count={getRarityStyles(allTermsMap[currentGachaCard.term]?.rarity || 'C').particles} 
              />

              <motion.div
                key={`${currentGachaCard.term}-${currentGachaCard.redrawsUsed}`}
                initial={{ scale: 0.2, opacity: 0, rotateY: 180, rotate: -15 }}
                animate={{ 
                  scale: 1,
                  opacity: 1, 
                  rotateY: 0, 
                  rotate: 0,
                  x: [0, -10, 10, -5, 5, 0]
                }}
                transition={{ 
                  scale: { type: "spring", damping: 12, stiffness: 100, delay: 0.1 },
                  x: { duration: 0.4, delay: 0.2 }
                }}
                className="relative w-full max-w-[280px] md:max-w-sm aspect-[2/3] md:aspect-[3/4] z-10"
              >
                {/* Card Display */}
                <div className={`relative w-full h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden group ${getRarityStyles(allTermsMap[currentGachaCard.term]?.rarity || 'C').border} ${getRarityStyles(allTermsMap[currentGachaCard.term]?.rarity || 'C').glow} transition-all duration-300 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4`}>
                  {/* Card Backgrounds */}
                  <div className="absolute inset-0 bg-theme-card" />
                  <div className={`absolute inset-0 ${getRarityStyles(allTermsMap[currentGachaCard.term]?.rarity || 'C').bg} opacity-10`} />
                  
                  {/* Pulse Effect (Behind Content) */}
                  {getRarityStyles(allTermsMap[currentGachaCard.term]?.rarity || 'C').pulse && (
                    <div className={`absolute inset-0 ${getRarityStyles(allTermsMap[currentGachaCard.term]?.rarity || 'C').bg} opacity-15 ${getRarityStyles(allTermsMap[currentGachaCard.term]?.rarity || 'C').pulse} z-0`} />
                  )}

                  {/* Sparkles for High Rarity (Behind Content) */}
                  {['SR', 'UR'].includes(allTermsMap[currentGachaCard.term]?.rarity || 'C') && (
                    <div className="absolute inset-0 pointer-events-none z-0">
                      <motion.div 
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/15 to-white/0"
                      />
                    </div>
                  )}

                  <div className="h-full flex flex-col bg-transparent relative z-10">
                    {/* Card Header */}
                    <div className={`px-3 py-2 md:px-4 md:py-3 flex justify-between items-center relative z-10 ${allTermsMap[currentGachaCard.term]?.rarity !== 'C' ? getRarityStyles(allTermsMap[currentGachaCard.term]?.rarity || 'C').bg : 'bg-theme-muted'} ${allTermsMap[currentGachaCard.term]?.rarity !== 'C' ? 'text-white' : 'text-theme-text-muted'}`}>
                      <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase drop-shadow-sm">{getRarityStyles(allTermsMap[currentGachaCard.term]?.rarity || 'C').label}</span>
                      <span className="text-[8px] md:text-[10px] font-bold bg-theme-card/20 px-2 py-0.5 rounded-full">NEW!</span>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center text-center space-y-3 md:space-y-4 relative z-10">
                      <div className={`w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl flex items-center justify-center ${getRarityStyles(allTermsMap[currentGachaCard.term]?.rarity || 'C').bg} ${allTermsMap[currentGachaCard.term]?.rarity === 'C' || !allTermsMap[currentGachaCard.term] ? 'text-theme-text' : 'text-white'} shadow-inner`}>
                        <div className="hidden md:block">{getTermIcon(currentGachaCard.term, 48)}</div>
                        <div className="block md:hidden">{getTermIcon(currentGachaCard.term, 32)}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-xl md:text-2xl font-bold leading-tight text-theme-text drop-shadow-sm">{currentGachaCard.term}</h3>
                        <p className="text-[9px] md:text-xs text-theme-text-muted font-bold uppercase tracking-widest">
                          {quizCategories.find(c => c.subcategories.some((s: any) => s.terms.some((t: any) => t.name === currentGachaCard.term)))?.title || 'Unknown Category'}
                        </p>
                      </div>

                      <div className="pt-3 md:pt-4 border-t border-theme-border w-full">
                        <p className="text-sm md:text-lg text-theme-text leading-relaxed font-bold mb-2 drop-shadow-sm">
                          "{(allTermsMap[currentGachaCard.term]?.descriptions || ["説明がありません。"])[0]}"
                        </p>
                        {allTermsMap[currentGachaCard.term]?.flavorTexts && (
                          <p className="text-[10px] md:text-sm text-theme-text-muted leading-relaxed italic">
                            {Array.isArray(allTermsMap[currentGachaCard.term]?.flavorTexts) 
                              ? (allTermsMap[currentGachaCard.term]?.flavorTexts as string[])[0] 
                              : allTermsMap[currentGachaCard.term]?.flavorTexts}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="mt-6 md:mt-12 flex flex-col items-center gap-4 md:gap-6 w-full max-w-[280px] md:max-w-sm">
                <p className="text-white/60 font-bold tracking-widest text-sm md:text-base">
                  {gachaHistory.length + 1} / {gachaHistory.length + gachaQueue + 1}
                </p>
                
                {currentGachaCard.isDuplicate && currentGachaCard.redrawsUsed < currentGachaCard.maxRedraws && (
                  <div className="text-amber-400 font-bold text-sm mb-2">
                    ダブり発生！再抽選可能です（残り {currentGachaCard.maxRedraws - currentGachaCard.redrawsUsed} 回）
                  </div>
                )}

                <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4 w-full">
                  {currentGachaCard.isDuplicate && currentGachaCard.redrawsUsed < currentGachaCard.maxRedraws ? (
                    <>
                      <button 
                        onClick={handleRedraw}
                        className="w-full md:w-auto px-4 py-3 md:px-8 md:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl md:rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/40 text-sm md:text-base whitespace-nowrap"
                      >
                        再抽選する
                      </button>
                      <button 
                        onClick={() => handleKeepCard('next')}
                        className="w-full md:w-auto px-4 py-3 md:px-8 md:py-4 bg-theme-card/20 text-white rounded-xl md:rounded-2xl font-bold hover:bg-theme-card/30 transition-all text-sm md:text-base whitespace-nowrap"
                      >
                        このまま獲得
                      </button>
                    </>
                  ) : gachaQueue > 0 ? (
                    <>
                      <button 
                        onClick={() => handleKeepCard('next')}
                        className="w-full md:w-auto px-4 py-3 md:px-12 md:py-4 bg-theme-accent text-white rounded-xl md:rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-theme-accent/40 text-sm md:text-base whitespace-nowrap order-first md:order-last"
                      >
                        続けて引く
                      </button>
                      <button 
                        disabled
                        className="w-full md:w-auto px-4 py-3 md:px-8 md:py-4 bg-white/5 text-white/20 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/10 text-sm md:text-base whitespace-nowrap cursor-not-allowed"
                      >
                        コレクションで見る <ArrowRight size={16} className="md:w-[18px] md:h-[18px] shrink-0" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleKeepCard('close')}
                        className="w-full md:w-auto px-4 py-3 md:px-12 md:py-4 bg-theme-card text-black rounded-xl md:rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl text-sm md:text-base whitespace-nowrap"
                      >
                        結果を閉じる
                      </button>
                      <button 
                        onClick={() => handleKeepCard('collection')}
                        className="w-full md:w-auto px-4 py-3 md:px-8 md:py-4 bg-theme-card/10 hover:bg-theme-card/20 text-white rounded-xl md:rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-white/20 text-sm md:text-base whitespace-nowrap"
                      >
                        コレクションで見る <ArrowRight size={16} className="md:w-[18px] md:h-[18px] shrink-0" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
