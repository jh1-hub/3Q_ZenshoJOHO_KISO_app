import React, { useState, useEffect, useCallback, useMemo, useRef, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import domtoimage from 'dom-to-image-more';
import { 
  Trophy, 
  Timer, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw, 
  Award,
  BrainCircuit,
  LayoutGrid,
  ArrowLeft,
  Search,
  Info,
  Database,
  Cpu,
  Globe,
  Shield,
  BarChart,
  Code,
  Smartphone,
  Cloud,
  Brain,
  Users,
  Mail,
  FileText,
  HardDrive,
  Wifi,
  Lock,
  Settings,
  Target,
  Lightbulb,
  MousePointer2,
  Monitor,
  Layers,
  Fingerprint,
  Scale,
  Clock,
  PieChart,
  Activity,
  MessageSquare,
  Sparkles,
  Camera,
  Zap,
  Link,
  Eye,
  Key,
  AlertTriangle,
  AlertCircle,
  Home,
  ArrowRight,
  Trash2,
  Download,
  Upload,
  Archive,
  Box,
  Compass,
  MapPin,
  CreditCard,
  ShoppingCart,
  Truck,
  BookOpen,
  PenTool,
  CheckCircle2,
  XCircle,
  UserCheck,
  Gavel,
  Copyright,
  CreativeCommons,
  Radio,
  HardDriveDownload,
  HardDriveUpload,
  RefreshCw,
  SearchCode,
  Binary,
  Calculator,
  Table,
  LineChart,
  Network,
  Server,
  Terminal,
  MousePointerClick,
  List,
  Loader2
} from 'lucide-react';
import { storage } from './lib/storage';
import { quizCategories, Category, Subcategory, allTermsMap, allTerms, Rarity, GameStats, TermStat, TermStats, UnitStats } from './data/quizData';
import { storyCards, StoryCard } from './data/storyData';
import { generateQuestion, Question, QuestionType } from './services/geminiService';

import { getTermIcon } from './lib/termIcon';
import { HaloEffect } from './components/effects/HaloEffect';
import { ErrorBoundary } from './components/ErrorBoundary';
import { takeScreenshot } from './lib/screenshot';
import { termToId, getCategoryColor, getRarityStyles } from './lib/utils';
import { MigrationModal } from './components/modals/MigrationModal';
import { ResetConfirmationModal } from './components/modals/ResetConfirmationModal';
import { MigrationData } from './lib/migration';
import { Burst } from './components/effects/Burst';
import { SpeedLines } from './components/effects/SpeedLines';
import { GachaRollingOverlay } from './components/gacha/GachaRollingOverlay';
import { StoryCardOverlay } from './components/story/StoryCardOverlay';
import { StartView } from './components/views/StartView';
import { StatsView } from './components/views/StatsView';
import { TermPerformanceView } from './components/views/TermPerformanceView';
import { StoryView } from './components/views/StoryView';
import { CollectionView } from './components/views/CollectionView';
import { CategorySelectView } from './components/views/CategorySelectView';
import { SpeedStarView } from './components/views/SpeedStarView';
import { QuizView } from './components/views/QuizView';
import { ResultView } from './components/views/ResultView';

import { useGameData } from './hooks/useGameData';
import { useGacha } from './hooks/useGacha';
import { useQuiz } from './hooks/useQuiz';

import { GlobalHeader } from './components/layout/GlobalHeader';
import { FeedbackOverlays } from './components/layout/FeedbackOverlays';
import { Toast, ToastType } from './components/ui/Toast';
import { ProfileSetupView } from './components/views/ProfileSetupView';
import { CardPickupModal } from './components/modals/CardPickupModal';
import { LevelUpOverlay } from './components/modals/LevelUpOverlay';
import { InstallPromptModal } from './components/modals/InstallPromptModal';

const idToNameMap: Record<number, string> = {};
Object.values(allTermsMap).forEach(t => idToNameMap[t.id] = t.name);

type GameState = 'START' | 'CATEGORY_SELECT' | 'QUIZ' | 'RESULT' | 'COLLECTION' | 'STATS' | 'SPEED_STAR' | 'STORY' | 'TERM_PERFORMANCE';

interface PickedCard {
  term: string;
  descriptionIndex: number;
}

export default function App() {
  const statsRef = useRef<HTMLDivElement>(null);
  const termPerformanceRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>('START');
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const [showStoryCard, setShowStoryCard] = useState<StoryCard | null>(null);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [migrationMode, setMigrationMode] = useState<'scan' | 'export' | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [termPerformanceSearchTerm, setTermPerformanceSearchTerm] = useState('');
  const [targetCardId, setTargetCardId] = useState<string | null>(null);
  const [resetStep, setResetStep] = useState(0);
  const [resetCooldown, setResetCooldown] = useState(0);

  useEffect(() => {
    if (resetCooldown > 0) {
      const timer = setInterval(() => {
        setResetCooldown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resetCooldown]);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [termSortOrder, setTermSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [termPerformanceDescIndexes, setTermPerformanceDescIndexes] = useState<Record<string, number>>({});
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [isTermPerformanceSearchingAll, setIsTermPerformanceSearchingAll] = useState(false);
  const [isCollectionSearchingAll, setIsCollectionSearchingAll] = useState(false);
  const [activeCollectionTab, setActiveCollectionTab] = useState<string>(quizCategories[0].id);
  const [activeSubcollectionTab, setActiveSubcollectionTab] = useState<string | null>(null);
  const [pickedCard, setPickedCard] = useState<PickedCard | null>(null);
  const [collectionMode, setCollectionMode] = useState<'card' | 'word'>('card');
  const [wordModeIndexes, setWordModeIndexes] = useState<Record<string, number>>({});

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  const {
    userName, setUserName,
    userProfile, setUserProfile,
    stats, setStats,
    ownedCards, setOwnedCards,
    termStats, setTermStats,
    hasBonusTicket, setHasBonusTicket,
    quizCount, setQuizCount,
    speedStarMaxCombo, setSpeedStarMaxCombo,
    speedStarMaxCorrect, setSpeedStarMaxCorrect,
    speedStarChallenges, setSpeedStarChallenges,
    lastDailyChallengeId, setLastDailyChallengeId,
    dailyStreak, setDailyStreak,
    isLoaded,
    userLevel,
    userLevelProgress,
    weakPoints,
    rarityStats,
    saveStats,
    saveUserProfile,
    updateTermStats,
    updateStats,
    saveCollection,
    getStatsFor,
    resetAllData,
    getMigrationData,
    confirmMigration
  } = useGameData(showToast);

  const { rarityOwned, rarityTotals, rarityOwnedCopies, rarityTotalCopies, hasAnyDuplicate } = rarityStats;

  const getDailyId = useCallback(() => {
    const now = new Date();
    if (now.getHours() < 5) {
      now.setDate(now.getDate() - 1);
    }
    return now.toISOString().split('T')[0];
  }, []);

  const isDailyChallengeCompleted = useMemo(() => {
    const dailyId = getDailyId();
    return lastDailyChallengeId === dailyId;
  }, [lastDailyChallengeId, getDailyId]);

  const jumpToCollection = useCallback((termName: string) => {
    setTargetCardId(termName);
    setGameState('COLLECTION');
  }, []);

  const {
    questions, setQuestions,
    currentQuestionIndex, setCurrentQuestionIndex,
    score: quizScore, setScore,
    combo, setCombo,
    maxCombo, setMaxCombo,
    timeLeft, setTimeLeft,
    userAnswer, setUserAnswer,
    feedback, setFeedback,
    correctCount, setCorrectCount,
    isLoading, setIsLoading,
    penaltyActive, setPenaltyActive,
    penaltyTime, setPenaltyTime,
    speedStarCorrectCount,
    startQuiz,
    startComprehensiveQuiz,
    startDailyChallenge,
    startSpeedStar,
    handleAnswer,
    resetQuizState
  } = useQuiz(
    updateTermStats,
    updateStats,
    gameState,
    setGameState,
    selectedSubcategory,
    setSelectedSubcategory,
    isDailyChallenge,
    setIsDailyChallenge,
    getDailyId,
    setLastDailyChallengeId,
    setDailyStreak,
    setHasBonusTicket,
    setQuizCount,
    setSpeedStarMaxCombo,
    setSpeedStarMaxCorrect,
    setSpeedStarChallenges,
    () => clearGachaState()
  );

  const {
    isGachaRolling,
    gachaResults,
    setGachaResults,
    gachaQueue,
    currentGachaCard,
    gachaHistory,
    pullGacha,
    confirmGachaCard,
    redrawGachaCard,
    getGachaPullCount,
    clearGachaState
  } = useGacha(ownedCards, () => quizScore, selectedSubcategory, saveCollection, jumpToCollection);


  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      setShowInstallPrompt(false);
    }
  };

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const scrollStates: GameState[] = ['START', 'CATEGORY_SELECT', 'COLLECTION', 'STATS', 'STORY', 'TERM_PERFORMANCE'];
    if (scrollStates.includes(gameState)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [gameState]);

  const quitQuiz = () => {
    resetQuizState();
    setGameState('CATEGORY_SELECT');
  };

  const handleAnswerWrapper = (answer: string) => {
    handleAnswer(answer, gameState);
  };

  const handleCardClick = (term: string) => {
    if (!ownedCards[term]) return;

    if (pickedCard?.term === term) {
      // If already picked, cycle description (only unlocked ones)
      const descriptions = allTermsMap[term]?.descriptions || ["説明がありません。"];
      const unlockedCount = Math.min(ownedCards[term], descriptions.length);
      setPickedCard({
        term,
        descriptionIndex: (pickedCard.descriptionIndex + 1) % unlockedCount
      });
    } else {
      setPickedCard({ term, descriptionIndex: 0 });
    }
  };

  const handleRedraw = () => {
    redrawGachaCard();
  };

  const handleKeepCard = (action: 'next' | 'close' | 'collection') => {
    confirmGachaCard(action);
    if (action === 'collection' && currentGachaCard) {
      // confirmGachaCard already handles jumpToCollection if action is 'collection'
    } else if (action === 'close') {
      // ResultView will handle closing via state if needed, 
      // but confirmGachaCard already handles queue
    }
  };

  const handleTakeScreenshot = () => {
    takeScreenshot(
      userName,
      userProfile,
      quizCount,
      ownedCards,
      getStatsFor,
      speedStarMaxCorrect,
      speedStarChallenges,
      weakPoints
    );
  };

  const handleReset = () => {
    resetAllData();
    setGameState('START');
    showToast("すべてのデータがリセットされました。", "success");
  };

  const resetAllStats = () => {
    resetAllData();
    alert("すべての統計データがリセットされました。");
  };

  // Filtered terms for collection
  const filteredTerms = useMemo(() => {
    if (isCollectionSearchingAll || searchTerm) {
      // If searching all or searching specific term, ignore category/subcategory tabs and search everywhere
      let allTermsResults: { term: string; category: string; subId: string }[] = [];
      quizCategories.forEach(cat => {
        cat.subcategories.forEach(sub => {
          sub.terms.forEach(term => {
            if (!searchTerm || term.name.includes(searchTerm)) {
              allTermsResults.push({ term: term.name, category: cat.title, subId: sub.id });
            }
          });
        });
      });
      return allTermsResults;
    }

    let terms: { term: string; category: string; subId: string }[] = [];
    quizCategories.forEach(cat => {
      if (activeCollectionTab === cat.id) {
        cat.subcategories.forEach(sub => {
          if (!activeSubcollectionTab || activeSubcollectionTab === sub.id) {
            sub.terms.forEach(term => {
              terms.push({ term: term.name, category: cat.title, subId: sub.id });
            });
          }
        });
      }
    });

    return terms;
  }, [searchTerm, isCollectionSearchingAll, activeCollectionTab, activeSubcollectionTab]);

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-sans selection:bg-theme-accent selection:text-white transition-colors duration-500 overflow-x-hidden">
      {/* Global Header */}
      <GlobalHeader
        userName={userName}
        userLevel={userLevel}
        userLevelProgress={userLevelProgress}
        gameState={gameState}
        setGameState={setGameState}
        resetQuizState={resetQuizState}
        deferredPrompt={deferredPrompt}
        handleInstallClick={handleInstallClick}
        onOpenMigration={(mode) => {
          if (mode) setMigrationMode(mode);
          setShowMigrationModal(true);
        }}
      />

      <AnimatePresence mode="wait">
        {gameState === 'START' && (
          <StartView
            isDailyChallengeCompleted={isDailyChallengeCompleted}
            startDailyChallenge={startDailyChallenge}
            dailyStreak={dailyStreak}
            hasBonusTicket={hasBonusTicket}
            startSpeedStar={startSpeedStar}
            setGameState={setGameState}
            rarityOwned={rarityOwned}
            rarityTotals={rarityTotals}
            rarityTotalCopies={rarityTotalCopies}
            rarityOwnedCopies={rarityOwnedCopies}
            hasAnyDuplicate={hasAnyDuplicate}
            getRarityStyles={getRarityStyles}
            takeScreenshot={handleTakeScreenshot}
            userLevel={userLevel}
            userName={userName}
            userProfile={userProfile}
            getStatsFor={getStatsFor}
            getCategoryColor={getCategoryColor}
            quizCategories={quizCategories}
          />
        )}

        {gameState === 'STATS' && (
          <StatsView
            setGameState={setGameState}
            statsRef={statsRef}
            takeScreenshot={handleTakeScreenshot}
            userLevel={userLevel}
            userName={userName}
            userProfile={userProfile}
            getStatsFor={getStatsFor}
            speedStarMaxCorrect={speedStarMaxCorrect}
            speedStarMaxCombo={speedStarMaxCombo}
            speedStarChallenges={speedStarChallenges}
            quizCategories={quizCategories}
            getCategoryColor={getCategoryColor}
            weakPoints={weakPoints}
          />
        )}

        {gameState === 'TERM_PERFORMANCE' && (
          <TermPerformanceView
            setGameState={setGameState}
            termPerformanceRef={termPerformanceRef}
            termSortOrder={termSortOrder}
            setTermSortOrder={setTermSortOrder}
            termPerformanceSearchTerm={termPerformanceSearchTerm}
            setTermPerformanceSearchTerm={setTermPerformanceSearchTerm}
            isTermPerformanceSearchingAll={isTermPerformanceSearchingAll}
            setIsTermPerformanceSearchingAll={setIsTermPerformanceSearchingAll}
            activeCollectionTab={activeCollectionTab}
            setActiveCollectionTab={setActiveCollectionTab}
            activeSubcollectionTab={activeSubcollectionTab}
            setActiveSubcollectionTab={setActiveSubcollectionTab}
            quizCategories={quizCategories}
            getCategoryColor={getCategoryColor}
            termStats={termStats}
            ownedCards={ownedCards}
            allTermsMap={allTermsMap}
            termPerformanceDescIndexes={termPerformanceDescIndexes}
            setTermPerformanceDescIndexes={setTermPerformanceDescIndexes}
          />
        )}

        {gameState === 'STORY' && (
          <StoryView
            setGameState={setGameState}
            userLevel={userLevel}
            setShowStoryCard={setShowStoryCard}
          />
        )}

        {gameState === 'COLLECTION' && (
          <CollectionView
            setGameState={setGameState}
            allTerms={allTerms}
            collectionMode={collectionMode}
            setCollectionMode={setCollectionMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isCollectionSearchingAll={isCollectionSearchingAll}
            setIsCollectionSearchingAll={setIsCollectionSearchingAll}
            activeCollectionTab={activeCollectionTab}
            setActiveCollectionTab={setActiveCollectionTab}
            activeSubcollectionTab={activeSubcollectionTab}
            setActiveSubcollectionTab={setActiveSubcollectionTab}
            quizCategories={quizCategories}
            getCategoryColor={getCategoryColor}
            filteredTerms={filteredTerms}
            cardRefs={cardRefs}
            targetCardId={targetCardId}
            ownedCards={ownedCards}
            allTermsMap={allTermsMap}
            getRarityStyles={getRarityStyles}
            handleCardClick={handleCardClick}
            pickedCard={pickedCard}
            wordModeIndexes={wordModeIndexes}
            setWordModeIndexes={setWordModeIndexes}
          />
        )}

        {gameState === 'CATEGORY_SELECT' && (
          <CategorySelectView
            setGameState={setGameState}
            hasBonusTicket={hasBonusTicket}
            startSpeedStar={startSpeedStar}
            isLoading={isLoading}
            speedStarMaxCorrect={speedStarMaxCorrect}
            speedStarMaxCombo={speedStarMaxCombo}
            startComprehensiveQuiz={() => startComprehensiveQuiz("総合演習")}
            quizCategories={quizCategories}
            getStatsFor={getStatsFor}
            startQuiz={startQuiz}
          />
        )}

        {gameState === 'SPEED_STAR' && questions.length > 0 && (
          <SpeedStarView
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            timeLeft={timeLeft}
            speedStarCorrectCount={speedStarCorrectCount}
            combo={combo}
            userAnswer={userAnswer}
            feedback={feedback}
            handleAnswer={handleAnswerWrapper}
          />
        )}

        {gameState === 'QUIZ' && questions.length > 0 && (
          <QuizView
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            timeLeft={timeLeft}
            score={quizScore}
            combo={combo}
            userAnswer={userAnswer}
            feedback={feedback}
            isDailyChallenge={isDailyChallenge}
            userLevel={userLevel}
            penaltyActive={penaltyActive}
            handleAnswer={handleAnswerWrapper}
            quitQuiz={quitQuiz}
          />
        )}

        {gameState === 'RESULT' && (
          <ResultView
            speedStarCorrectCount={speedStarCorrectCount}
            selectedSubcategory={selectedSubcategory}
            getGachaPullCount={() => getGachaPullCount(speedStarCorrectCount, questions.length, correctCount, isDailyChallenge)}
            isDailyChallenge={isDailyChallenge}
            questions={questions}
            correctCount={correctCount}
            gachaResults={gachaResults}
            pullGacha={() => pullGacha(speedStarCorrectCount, questions.length, correctCount, isDailyChallenge)}
            isGachaRolling={isGachaRolling}
            score={quizScore}
            maxCombo={maxCombo}
            hasBonusTicket={hasBonusTicket}
            startSpeedStar={startSpeedStar}
            resetQuizState={resetQuizState}
            setGameState={setGameState}
            startComprehensiveQuiz={() => startComprehensiveQuiz("総合演習")}
            startQuiz={startQuiz}
            currentGachaCard={currentGachaCard}
            getRarityStyles={getRarityStyles}
            allTermsMap={allTermsMap}
            getTermIcon={getTermIcon}
            quizCategories={quizCategories}
            gachaHistory={gachaHistory}
            gachaQueue={gachaQueue}
            handleRedraw={handleRedraw}
            handleKeepCard={handleKeepCard}
          />
        )}
    </AnimatePresence>

      <FeedbackOverlays isLoading={isLoading} feedback={feedback} />

      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Card Pickup Modal */}
      <CardPickupModal
        pickedCard={pickedCard}
        setPickedCard={setPickedCard}
        ownedCards={ownedCards}
        handleCardClick={handleCardClick}
      />

      {/* Level Up Overlay */}
      <LevelUpOverlay
        showLevelUp={showLevelUp}
        setShowLevelUp={setShowLevelUp}
        setShowStoryCard={setShowStoryCard}
      />

      {/* Story Card Overlay */}
      <AnimatePresence>
        {showStoryCard && (
          <StoryCardOverlay 
            card={showStoryCard} 
            onClose={() => setShowStoryCard(null)} 
          />
        )}
      </AnimatePresence>

      {/* Username Modal */}
      {!userName && gameState === 'START' && (
        <ProfileSetupView 
          saveUserProfile={saveUserProfile} 
          showToast={showToast}
          onOpenMigration={() => {
            setMigrationMode('scan');
            setShowMigrationModal(true);
          }}
        />
      )}

      {/* Install Prompt Modal (Mobile) */}
      <InstallPromptModal
        showInstallPrompt={showInstallPrompt}
        setShowInstallPrompt={setShowInstallPrompt}
        handleInstallClick={handleInstallClick}
        isMobile={isMobile}
      />

      {/* Migration Modal */}
      <MigrationModal
        isOpen={showMigrationModal}
        onClose={() => {
          setShowMigrationModal(false);
          setMigrationMode(null);
        }}
        onConfirmMigration={confirmMigration}
        currentData={getMigrationData()}
        initialMode={migrationMode}
        onReset={() => {
          setShowMigrationModal(false);
          setMigrationMode(null);
          setResetStep(1);
        }}
      />

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {resetStep > 0 && (
          <ResetConfirmationModal
            resetStep={resetStep}
            resetCooldown={resetCooldown}
            onNextStep={() => {
              if (resetStep < 7) {
                setResetStep(prev => prev + 1);
                setResetCooldown(3);
              }
            }}
            onCancel={() => setResetStep(0)}
            onConfirm={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
