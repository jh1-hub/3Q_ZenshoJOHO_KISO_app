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
  QrCode,
  Scan,
  X,
  List,
  Loader2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import CryptoJS from 'crypto-js';
import LZString from 'lz-string';
import { storage } from './lib/storage';
import { quizCategories, Category, Subcategory, allTermsMap, allTerms, Rarity } from './data/quizData';
import { storyCards, StoryCard } from './data/storyData';
import { generateQuestion, Question, QuestionType } from './services/geminiService';

import { getTermIcon } from './lib/termIcon';
import { HaloEffect } from './components/effects/HaloEffect';
import { Burst } from './components/effects/Burst';
import { SpeedLines } from './components/effects/SpeedLines';
import { GachaRollingOverlay } from './components/gacha/GachaRollingOverlay';
import { StoryCardOverlay } from './components/story/StoryCardOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StartView } from './components/views/StartView';
import { StatsView } from './components/views/StatsView';
import { TermPerformanceView } from './components/views/TermPerformanceView';
import { StoryView } from './components/views/StoryView';
import { CollectionView } from './components/views/CollectionView';
import { CategorySelectView } from './components/views/CategorySelectView';
import { SpeedStarView } from './components/views/SpeedStarView';
import { QuizView } from './components/views/QuizView';
import { ResultView } from './components/views/ResultView';

const idToNameMap: Record<number, string> = {};
Object.values(allTermsMap).forEach(t => idToNameMap[t.id] = t.name);

type GameState = 'START' | 'CATEGORY_SELECT' | 'QUIZ' | 'RESULT' | 'COLLECTION' | 'STATS' | 'SPEED_STAR' | 'STORY' | 'TERM_PERFORMANCE';

interface UnitStats {
  highScore: number;
  attempts: number;
  totalScore: number;
}

interface TermStat {
  correct: number;
  total: number;
}

interface TermStats {
  [termName: string]: TermStat;
}

interface GameStats {
  [key: string]: UnitStats;
}

interface PickedCard {
  term: string;
  descriptionIndex: number;
}


export default function App() {
  const statsRef = useRef<HTMLDivElement>(null);
  const termPerformanceRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>('START');
  const [userName, setUserName] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ grade: string; classNum: string; attendanceNum: string } | null>(null);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);
  const [showStoryCard, setShowStoryCard] = useState<StoryCard | null>(null);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [migrationQR, setMigrationQR] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const [isQRFullscreen, setIsQRFullscreen] = useState(false);
  const [pendingMigrationData, setPendingMigrationData] = useState<any | null>(null);
  const [termStats, setTermStats] = useState<TermStats>(() => {
    const saved = storage.getItem('it_quiz_term_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const nameBasedStats: TermStats = {};
        Object.entries(parsed).forEach(([key, value]) => {
          if (isNaN(Number(key))) {
            nameBasedStats[key] = value as TermStat;
          } else {
            const termId = Number(key);
            const termName = idToNameMap[termId];
            if (termName) nameBasedStats[termName] = value as TermStat;
          }
        });
        return nameBasedStats;
      } catch (e) {
        return {};
      }
    }
    return {};
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [termPerformanceSearchTerm, setTermPerformanceSearchTerm] = useState('');
  const [stats, setStats] = useState<GameStats>({});
  const [ownedCards, setOwnedCards] = useState<Record<string, number>>({});
  const [penaltyActive, setPenaltyActive] = useState(false);
  const [penaltyTime, setPenaltyTime] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isGachaRolling, setIsGachaRolling] = useState(false);
  const [gachaResults, setGachaResults] = useState<string[]>([]);
  const [gachaQueue, setGachaQueue] = useState<number>(0);
  const [currentGachaCard, setCurrentGachaCard] = useState<{
    term: string;
    initialRarity: Rarity;
    redrawsUsed: number;
    maxRedraws: number;
    isDuplicate: boolean;
  } | null>(null);
  const [gachaHistory, setGachaHistory] = useState<string[]>([]);
  const [targetCardId, setTargetCardId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [resetCooldown, setResetCooldown] = useState(0);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [lastDailyChallengeId, setLastDailyChallengeId] = useState<string>(() => {
    return storage.getItem('it_quiz_last_daily_id') || '';
  });
  const [dailyStreak, setDailyStreak] = useState<number>(() => {
    return parseInt(storage.getItem('it_quiz_daily_streak') || '0', 10);
  });

  const getDailyId = () => {
    const now = new Date();
    // Reset at 5 AM
    if (now.getHours() < 5) {
      now.setDate(now.getDate() - 1);
    }
    return now.toISOString().split('T')[0];
  };

  const isDailyChallengeCompleted = useMemo(() => {
    const dailyId = getDailyId();
    return lastDailyChallengeId === dailyId;
  }, [lastDailyChallengeId]);

  useEffect(() => {
    if (resetCooldown > 0) {
      const timer = setTimeout(() => setResetCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resetCooldown]);
  const [hasBonusTicket, setHasBonusTicket] = useState(false);
  const [quizCount, setQuizCount] = useState(0);
  const [speedStarCorrectCount, setSpeedStarCorrectCount] = useState(0);
  const [speedStarRequiredForNext, setSpeedStarRequiredForNext] = useState(3);
  const [speedStarNextIncrement, setSpeedStarNextIncrement] = useState(4);
  const [speedStarMaxCombo, setSpeedStarMaxCombo] = useState(0);
  const [speedStarMaxCorrect, setSpeedStarMaxCorrect] = useState(0);
  const [speedStarChallenges, setSpeedStarChallenges] = useState(0);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

  // Load user data, stats and collection from localStorage
  useEffect(() => {
    const savedName = storage.getItem('it_quiz_username');
    const savedProfile = storage.getItem('it_quiz_user_profile');
    if (savedName) setUserName(savedName);
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }

    const savedStats = storage.getItem('it_quiz_stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Failed to parse stats", e);
      }
    }

    const savedTicket = storage.getItem('it_quiz_bonus_ticket');
    if (savedTicket) setHasBonusTicket(savedTicket === 'true');

    const savedQuizCount = storage.getItem('it_quiz_count');
    if (savedQuizCount) setQuizCount(parseInt(savedQuizCount, 10));

    const savedSpeedStarStats = storage.getItem('it_quiz_speed_star_stats');
    if (savedSpeedStarStats) {
      try {
        const parsed = JSON.parse(savedSpeedStarStats);
        setSpeedStarMaxCombo(parsed.maxCombo || 0);
        setSpeedStarMaxCorrect(parsed.maxCorrect || 0);
        setSpeedStarChallenges(parsed.challenges || 0);
      } catch (e) {
        console.error("Failed to parse speed star stats", e);
      }
    }

    const savedCollection = storage.getItem('it_quiz_collection');
    if (savedCollection) {
      try {
        const parsed = JSON.parse(savedCollection);
        const nameBasedCollection: Record<string, number> = {};
        Object.entries(parsed).forEach(([key, value]) => {
          if (isNaN(Number(key))) {
            nameBasedCollection[key] = value as number;
          } else {
            const termId = Number(key);
            const termName = idToNameMap[termId];
            if (termName) nameBasedCollection[termName] = value as number;
          }
        });
        setOwnedCards(nameBasedCollection);
      } catch (e) {
        console.error("Failed to parse collection", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save collection to localStorage
  const saveCollection = (newCollection: Record<string, number>) => {
    const cappedCollection: Record<string, number> = {};
    Object.entries(newCollection).forEach(([term, count]) => {
      cappedCollection[term] = Math.min(255, count);
    });
    setOwnedCards(cappedCollection);
    
    // Convert to ID-based map for storage
    const idBasedCollection: Record<number, number> = {};
    Object.entries(cappedCollection).forEach(([termName, count]) => {
      const term = allTermsMap[termName];
      if (term) idBasedCollection[term.id] = count;
    });
    storage.setItem('it_quiz_collection', JSON.stringify(idBasedCollection));
  };

  const takeScreenshot = () => {
    const fileName = `${userProfile?.grade || '0'}${userProfile?.classNum || '0'}${userProfile?.attendanceNum || '00'}stats.png`;
    const level = Math.floor(quizCount / 10) + 1;

    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // レベルに応じたカラーパレットの定義
    let color1 = '#1e1b4b'; // デフォルト（Lv 1-5）
    let color2 = '#4c1d95';
    let accentColor = '#fbbf24';

    if (level >= 31) {
      color1 = '#0f172a'; // Legend: Slate 900
      color2 = '#334155'; // Slate 700
      accentColor = '#fcd34d'; // 明るいゴールド
    } else if (level >= 21) {
      color1 = '#4c1d95'; // Grandmaster: Violet
      color2 = '#db2777'; // Pink
      accentColor = '#6ee7b7'; // エメラルド
    } else if (level >= 16) {
      color1 = '#7f1d1d'; // Master: Red
      color2 = '#991b1b';
      accentColor = '#fde047'; // イエロー
    } else if (level >= 11) {
      color1 = '#78350f'; // Expert: Amber
      color2 = '#92400e';
      accentColor = '#38bdf8'; // スカイブルー
    } else if (level >= 6) {
      color1 = '#064e3b'; // Apprentice: Emerald
      color2 = '#065f46';
      accentColor = '#f9a8d4'; // ピンク
    }

    // 背景（レベルに応じたグラデーション）
    const gradient = ctx.createLinearGradient(0, 0, 1920, 1080);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1920, 1080);

    // 透かし
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('IT QUIZ STATS', 960, 540);

    // ヘッダー
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.font = 'bold 56px Arial';
    ctx.fillText('学習成績レポート', 50, 80);

    // ユーザー情報（右側）
    ctx.font = '32px Arial';
    ctx.fillText(`ユーザー: ${userName || '未設定'}`, 1400, 60);
    ctx.fillText(`学年: ${userProfile?.grade || '0'}年 ${userProfile?.classNum || '0'}組 ${userProfile?.attendanceNum || '0'}番`, 1400, 100);
    
    // レベルとカード収集状況
    const collectionRate = allTerms.length > 0 ? Math.floor((Object.keys(ownedCards).length / allTerms.length) * 100) : 0;
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 36px Arial';
    ctx.fillText(`Lv. ${level} | 収集率: ${collectionRate}%`, 1400, 150);

    // 成績データ
    let y = 200;
    const drawStats = (title: string, stats: UnitStats, x: number, y: number) => {
        const avg = stats.attempts > 0 ? Math.floor(stats.totalScore / stats.attempts) : 0;
        ctx.fillText(`${title} | HS: ${stats.highScore.toLocaleString()} | Avg: ${avg} | 回数: ${stats.attempts}`, x, y);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('【総合成績】', 50, y);
    y += 45;
    ctx.font = '28px Arial';
    drawStats('全体', getStatsFor('all'), 80, y);
    y += 40;
    drawStats('SPEED STAR', { highScore: speedStarMaxCorrect, attempts: speedStarChallenges, totalScore: 0 }, 80, y);
    y += 60;

    // 弱点ランキング (Screenshot output)
    if (weakPoints.length > 0) {
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 36px Arial';
      ctx.fillText('【WEAK POINT 10】', 1300, 200);
      let y_wp = 245;
      ctx.font = '24px Arial';
      weakPoints.forEach((wp, idx) => {
        ctx.fillStyle = '#ffcccc';
        ctx.fillText(`#${idx + 1} ${wp.name}`, 1320, y_wp);
        ctx.fillStyle = '#ff4444';
        ctx.textAlign = 'right';
        ctx.fillText(`${wp.rate.toFixed(1)}%`, 1850, y_wp);
        ctx.textAlign = 'left';
        y_wp += 35;
      });
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('【詳細成績】', 50, y);
    y += 45;
    ctx.font = '22px Arial';
    
    quizCategories.forEach((category) => {
      if (y > 1000) return;
      ctx.fillStyle = accentColor;
      ctx.font = 'bold 30px Arial';
      const catStats = getStatsFor(category.id);
      ctx.fillText(`■ ${category.title}`, 80, y);
      y += 35;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '22px Arial';
      const catAvg = catStats.attempts > 0 ? Math.floor(catStats.totalScore / catStats.attempts) : 0;
      ctx.fillText(`  [単元合計] HS: ${catStats.highScore.toLocaleString()} | Avg: ${catAvg} | 回数: ${catStats.attempts}`, 100, y);
      y += 30;
      
      category.subcategories.forEach((subcategory) => {
        if (y > 1000) return;
        const stats = getStatsFor(subcategory.id);
        const subAvg = stats.attempts > 0 ? Math.floor(stats.totalScore / stats.attempts) : 0;
        ctx.fillText(`  ・${subcategory.title}: HS: ${stats.highScore.toLocaleString()} | Avg: ${subAvg} | 回数: ${stats.attempts}`, 120, y);
        y += 28;
      });
      y += 15;
    });

    // ロゴ（右下）
    ctx.textAlign = 'right';
    ctx.fillStyle = accentColor;
    ctx.font = 'italic bold 80px "Times New Roman", serif';
    ctx.fillText('IT QUIZ MASTER', 1870, 1000);
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('Knowledge is Power', 1870, 1035);
    
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Save stats to localStorage
  const saveStats = (newStats: GameStats) => {
    setStats(newStats);
    storage.setItem('it_quiz_stats', JSON.stringify(newStats));
  };

  const saveUserProfile = (profile: { grade: string; classNum: string; attendanceNum: string; userName: string }) => {
    setUserName(profile.userName);
    setUserProfile({ grade: profile.grade, classNum: profile.classNum, attendanceNum: profile.attendanceNum });
    storage.setItem('it_quiz_username', profile.userName);
    storage.setItem('it_quiz_user_profile', JSON.stringify({ grade: profile.grade, classNum: profile.classNum, attendanceNum: profile.attendanceNum }));
    
    if (isMobile && deferredPrompt) {
      setShowInstallPrompt(true);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    const stats = {
      maxCombo: speedStarMaxCombo,
      maxCorrect: speedStarMaxCorrect,
      challenges: speedStarChallenges
    };
    storage.setItem('it_quiz_speed_star_stats', JSON.stringify(stats));
  }, [speedStarMaxCombo, speedStarMaxCorrect, speedStarChallenges, isLoaded]);

  const updateTermStats = (term: string, isCorrect: boolean) => {
    if (!term || term === 'undefined' || term === 'null') return;
    setTermStats(prev => {
      const current = prev[term] || { correct: 0, total: 0 };
      // Cap at 255 (FF in hex)
      const next = {
        correct: Math.min(255, current.correct + (isCorrect ? 1 : 0)),
        total: Math.min(255, current.total + 1)
      };
      const newStats = { ...prev, [term]: next };
      
      // Convert to ID-based map for storage
      const idBasedStats: Record<number, TermStat> = {};
      Object.entries(newStats).forEach(([termName, stat]) => {
        const t = allTermsMap[termName];
        if (t) idBasedStats[t.id] = stat;
      });
      storage.setItem('it_quiz_term_stats', JSON.stringify(idBasedStats));
      
      return newStats;
    });
  };

  const [termSortOrder, setTermSortOrder] = useState<'asc' | 'desc' | null>(null);

  const [termPerformanceDescIndexes, setTermPerformanceDescIndexes] = useState<Record<string, number>>({});

  const weakPoints = useMemo(() => {
    const statsArray = Object.entries(termStats)
      .filter(([name, data]) => name !== 'undefined' && name !== 'null' && (data as TermStat).total > 0)
      .map(([name, data]) => {
        const d = data as TermStat;
        return {
          name,
          rate: (d.correct / d.total) * 100,
          ...d
        };
      });
    
    return statsArray
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 10);
  }, [termStats]);

  const calculateLevel = (collection: Record<string, number>) => {
    const totalPoints = Object.values(collection).reduce((sum: number, count: number) => sum + Math.min(3, count), 0);
    // Max points = 262 * 3 = 786
    // Level = 1 + floor(98 * (points / 786)^0.68)
    // Exponent 0.68 ensures 1 point = Level 2
    if (totalPoints === 0) return 1;
    const level = 1 + Math.floor(98 * Math.pow(totalPoints / 786, 0.68));
    return Math.min(99, level);
  };

  const userLevel = useMemo(() => calculateLevel(ownedCards), [ownedCards]);

  const userLevelProgress = useMemo(() => {
    const values = Object.values(ownedCards) as number[];
    const totalPoints = values.reduce((sum: number, count: number) => sum + Math.min(3, count), 0);
    if (totalPoints === 0) return 0;
    if (userLevel >= 99) return 1;

    const getPointsForLevel = (L: number): number => {
      if (L <= 1) return 0;
      return Math.ceil(786 * Math.pow((L - 1) / 98, 1 / 0.68));
    };

    const currentLevelPoints: number = getPointsForLevel(userLevel);
    const nextLevelPoints: number = getPointsForLevel(userLevel + 1);
    
    const progress = (totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints);
    return Math.max(0, Math.min(1, progress));
  }, [ownedCards, userLevel]);

  const updateStats = (id: string, newScore: number) => {
    const currentStats = { ...stats };
    const unitStats = currentStats[id] || { highScore: 0, attempts: 0, totalScore: 0 };
    
    currentStats[id] = {
      highScore: Math.max(unitStats.highScore, newScore),
      attempts: unitStats.attempts + 1,
      totalScore: unitStats.totalScore + newScore
    };
    
    saveStats(currentStats);

    // Ticket logic
    if (gameState !== 'SPEED_STAR') {
      const newQuizCount = quizCount + 1;
      setQuizCount(newQuizCount);
      storage.setItem('it_quiz_count', newQuizCount.toString());
      
      if (newQuizCount % 3 === 0 && !hasBonusTicket) {
        setHasBonusTicket(true);
        storage.setItem('it_quiz_bonus_ticket', 'true');
      }
    }
  };

  useEffect(() => {
    const scrollStates: GameState[] = ['START', 'CATEGORY_SELECT', 'COLLECTION', 'STATS', 'STORY', 'TERM_PERFORMANCE'];
    if (scrollStates.includes(gameState)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [gameState]);

  const resetAllStats = () => {
    saveStats({});
    saveCollection({});
    setTermStats({});
    storage.removeItem('it_quiz_term_stats');
    setUserName(null);
    setUserProfile(null);
    storage.removeItem('it_quiz_username');
    storage.removeItem('it_quiz_user_profile');
    
    // Speed Star Stats Reset
    storage.removeItem('it_quiz_speed_star_stats');
    setSpeedStarMaxCombo(0);
    setSpeedStarMaxCorrect(0);
    setSpeedStarChallenges(0);
    
    // Daily Challenge Reset
    setLastDailyChallengeId(null);
    setDailyStreak(0);
    storage.removeItem('it_quiz_last_daily_id');
    storage.removeItem('it_quiz_daily_streak');

    // Other Related Data Reset
    storage.removeItem('it_quiz_count');
    setQuizCount(0);
    storage.removeItem('it_quiz_bonus_ticket');
    setHasBonusTicket(false);
    
    // Clear internal session states
    setGachaHistory([]);
    setGachaQueue(0);
    setCurrentGachaCard(null);
    setTargetCardId(null);

    setResetStep(0);
    setGameState('START');
  };

  const exportData = () => {
    try {
      // Filter termStats to only include terms with actual data to reduce size
      const filteredTermStats: TermStats = {};
      Object.entries(termStats).forEach(([term, stat]) => {
        const s = stat as TermStat;
        if (s.correct > 0 || s.total > 0) {
          filteredTermStats[term] = s;
        }
      });

      const catIds = ['all', ...quizCategories.map(c => c.id), ...quizCategories.flatMap(c => c.subcategories.map(s => s.id))];

      // Compression logic (Version 5: Base64 encoding + Category Stats + LZString)
      const compressData = () => {
        let compressed = "";
        
        // Helper to convert number to base64 string
        const toB64 = (num: number, padding: number) => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
          let str = '';
          let n = num;
          do {
            str = chars[n % 64] + str;
            n = Math.floor(n / 64);
          } while (n > 0);
          return str.padStart(padding, 'A');
        };

        // stats: S + catIndex(1 char) + highScore(3 chars) + attempts(3 chars) + totalScore(3 chars) = 10 chars
        Object.entries(stats).forEach(([id, stat]) => {
          const index = catIds.indexOf(id);
          if (index !== -1 && (stat.attempts > 0 || stat.highScore > 0)) {
            compressed += `S${toB64(index, 1)}${toB64(Math.min(262143, stat.highScore), 3)}${toB64(Math.min(262143, stat.attempts), 3)}${toB64(Math.min(262143, stat.totalScore), 3)}`;
          }
        });

        // termStats: T + ID(2 chars) + Correct(3 chars) + Total(3 chars) = 9 chars
        Object.entries(filteredTermStats).forEach(([name, stat]) => {
          const term = allTermsMap[name];
          if (term) {
            const id = toB64(term.id, 2);
            const correct = toB64(Math.min(262143, stat.correct), 3); // 64^3 - 1
            const total = toB64(Math.min(262143, stat.total), 3);
            compressed += `T${id}${correct}${total}`;
          }
        });
        // ownedCards: C + ID(2 chars) + Count(1 char) = 4 chars
        Object.entries(ownedCards).forEach(([name, count]) => {
          const term = allTermsMap[name];
          if (term && count > 0) {
            const id = toB64(term.id, 2);
            const c = toB64(Math.min(63, count), 1);
            compressed += `C${id}${c}`;
          }
        });
        return compressed;
      };

      const data = {
        v: 5, // Version 5: LZString + Compressed Stats
        u: userName,
        p: userProfile,
        d: compressData(),
        bt: hasBonusTicket,
        qc: quizCount,
        ss: {
          c: speedStarMaxCombo,
          m: speedStarMaxCorrect,
          a: speedStarChallenges
        },
        ld: lastDailyChallengeId,
        ds: dailyStreak,
        t: Date.now()
      };
      const jsonString = JSON.stringify(data);
      
      // Use LZString for compression and obfuscation instead of AES
      const encrypted = LZString.compressToEncodedURIComponent(jsonString);
      
      // QR code data limit check (approximate, alphanumeric mode max is ~4200)
      if (encrypted.length > 4200) {
        setMigrationError("データ量が多すぎるため、QRコードを発行できません。テキストコピー機能をご利用ください。");
        return;
      }
      
      setMigrationQR(encrypted);
      setMigrationError(null);
    } catch (err) {
      console.error("Export error:", err);
      setMigrationError("データの書き出し中にエラーが発生しました。");
    }
  };

  const processMigrationData = (encryptedData: string) => {
    try {
      let decryptedData;
      
      // Try Version 5 (LZString) first
      const lzDecoded = LZString.decompressFromEncodedURIComponent(encryptedData);
      if (lzDecoded && lzDecoded.includes('"v":5')) {
        decryptedData = JSON.parse(lzDecoded);
      } else {
        // Fallback to AES (Versions <= 4)
        let bytes;
        try {
          bytes = CryptoJS.AES.decrypt(encryptedData, 'it-quiz-master-v3-key');
        } catch (e) {
          // Try legacy key if v3 fails
          bytes = CryptoJS.AES.decrypt(encryptedData, 'it-quiz-master-secret-key');
        }
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      
      let finalData: any = {};

      if (decryptedData.v >= 2 && decryptedData.v <= 5) {
        // Decompress version 2, 3, 4, or 5
        const idToName: Record<number, string> = {};
        Object.values(allTermsMap).forEach(t => idToName[t.id] = t.name);

        const parsedStats: TermStats = {};
        const parsedCategoryStats: Record<string, UnitStats> = {};
        const owned: Record<string, number> = {};
        const d = decryptedData.d || "";
        const version = decryptedData.v;
        
        const catIds = ['all', ...quizCategories.map(c => c.id), ...quizCategories.flatMap(c => c.subcategories.map(s => s.id))];
        
        // Helper to parse base64 string to number
        const fromB64 = (str: string) => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
          let num = 0;
          for (let i = 0; i < str.length; i++) {
            num = num * 64 + chars.indexOf(str[i]);
          }
          return num;
        };
        
        let i = 0;
        while (i < d.length) {
          const type = d[i];
          if (type === 'S') {
            const index = fromB64(d.substring(i + 1, i + 2));
            const highScore = fromB64(d.substring(i + 2, i + 5));
            const attempts = fromB64(d.substring(i + 5, i + 8));
            const totalScore = fromB64(d.substring(i + 8, i + 11));
            const id = catIds[index];
            if (id) {
              parsedCategoryStats[id] = { highScore, attempts, totalScore };
            }
            i += 11;
          } else if (type === 'T') {
            let id, correct, total, step;
            
            if (version >= 4) {
              id = fromB64(d.substring(i + 1, i + 3));
              correct = fromB64(d.substring(i + 3, i + 6));
              total = fromB64(d.substring(i + 6, i + 9));
              step = 9;
            } else {
              id = parseInt(d.substring(i + 1, i + 4), 16);
              if (version === 3) {
                correct = parseInt(d.substring(i + 4, i + 8), 16);
                total = parseInt(d.substring(i + 8, i + 12), 16);
                step = 12;
              } else {
                correct = parseInt(d.substring(i + 4, i + 6), 16);
                total = parseInt(d.substring(i + 6, i + 8), 16);
                step = 8;
              }
            }
            
            const name = idToName[id];
            if (name) parsedStats[name] = { correct, total };
            i += step;
          } else if (type === 'C') {
            let id, count, step;
            if (version >= 4) {
              id = fromB64(d.substring(i + 1, i + 3));
              count = fromB64(d.substring(i + 3, i + 4));
              step = 4;
            } else {
              id = parseInt(d.substring(i + 1, i + 4), 16);
              count = parseInt(d.substring(i + 4, i + 6), 16);
              step = 6;
            }
            const name = idToName[id];
            if (name) owned[name] = count;
            i += step;
          } else {
            i++;
          }
        }

        finalData = {
          userName: decryptedData.u,
          userProfile: decryptedData.p,
          stats: version >= 5 ? parsedCategoryStats : decryptedData.s,
          ownedCards: owned,
          termStats: parsedStats,
          hasBonusTicket: decryptedData.bt,
          quizCount: decryptedData.qc,
          speedStarStats: {
            maxCombo: decryptedData.ss?.c || 0,
            maxCorrect: decryptedData.ss?.m || 0,
            challenges: decryptedData.ss?.a || 0
          },
          lastDailyChallengeId: decryptedData.ld,
          dailyStreak: decryptedData.ds
        };
      } else {
        // Legacy version 1
        finalData = decryptedData;
      }
      
      if (finalData.userName && finalData.stats && finalData.ownedCards) {
        setPendingMigrationData(finalData);
        setMigrationError(null);
      } else {
        setMigrationError("無効なデータ形式です。");
      }
    } catch (e) {
      setMigrationError("データの復号に失敗しました。正しいQRコードか確認してください。");
    }
  };

  const confirmMigration = () => {
    if (pendingMigrationData) {
      setUserName(pendingMigrationData.userName);
      setUserProfile(pendingMigrationData.userProfile);
      setStats(pendingMigrationData.stats);
      
      setOwnedCards(pendingMigrationData.ownedCards);
      const idBasedCollection: Record<number, number> = {};
      Object.entries(pendingMigrationData.ownedCards).forEach(([termName, count]) => {
        const t = allTermsMap[termName];
        if (t) idBasedCollection[t.id] = count as number;
      });
      storage.setItem('it_quiz_collection', JSON.stringify(idBasedCollection));

      if (pendingMigrationData.termStats) {
        setTermStats(pendingMigrationData.termStats);
        const idBasedStats: Record<number, TermStat> = {};
        Object.entries(pendingMigrationData.termStats).forEach(([termName, stat]) => {
          const t = allTermsMap[termName];
          if (t) idBasedStats[t.id] = stat as TermStat;
        });
        storage.setItem('it_quiz_term_stats', JSON.stringify(idBasedStats));
      }
      
      // New fields
      if (pendingMigrationData.hasBonusTicket !== undefined) {
        setHasBonusTicket(pendingMigrationData.hasBonusTicket);
        storage.setItem('it_quiz_bonus_ticket', pendingMigrationData.hasBonusTicket.toString());
      }
      if (pendingMigrationData.quizCount !== undefined) {
        setQuizCount(pendingMigrationData.quizCount);
        storage.setItem('it_quiz_count', pendingMigrationData.quizCount.toString());
      }
      if (pendingMigrationData.speedStarStats) {
        setSpeedStarMaxCombo(pendingMigrationData.speedStarStats.maxCombo || 0);
        setSpeedStarMaxCorrect(pendingMigrationData.speedStarStats.maxCorrect || 0);
        setSpeedStarChallenges(pendingMigrationData.speedStarStats.challenges || 0);
        storage.setItem('it_quiz_speed_star_stats', JSON.stringify(pendingMigrationData.speedStarStats));
      }
      if (pendingMigrationData.lastDailyChallengeId !== undefined) {
        setLastDailyChallengeId(pendingMigrationData.lastDailyChallengeId);
        storage.setItem('it_quiz_last_daily_id', pendingMigrationData.lastDailyChallengeId);
      }
      if (pendingMigrationData.dailyStreak !== undefined) {
        setDailyStreak(pendingMigrationData.dailyStreak);
        storage.setItem('it_quiz_daily_streak', pendingMigrationData.dailyStreak.toString());
      }
      
      // Save to localStorage
      storage.setItem('it_quiz_username', pendingMigrationData.userName || '');
      storage.setItem('it_quiz_user_profile', JSON.stringify(pendingMigrationData.userProfile));
      storage.setItem('it_quiz_stats', JSON.stringify(pendingMigrationData.stats));
      
      setPendingMigrationData(null);
      setShowMigrationModal(false);
      alert("データの移行が完了しました！");
    }
  };

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;
    
    if (isScanning && showMigrationModal) {
      const startScanner = async () => {
        try {
          // Check for mediaDevices support
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setMigrationError("このブラウザはカメラアクセスをサポートしていないか、安全な接続（HTTPS）ではありません。");
            setIsScanning(false);
            return;
          }

          // Small delay to ensure the element is in the DOM
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const element = document.getElementById("qr-reader");
          if (!element) {
            setMigrationError("スキャナーの準備ができていません。");
            return;
          }

          html5QrCode = new Html5Qrcode("qr-reader");
          const config = { fps: 10, qrbox: { width: 250, height: 250 } };

          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              processMigrationData(decodedText);
              setIsScanning(false);
              if (html5QrCode) {
                html5QrCode.stop().catch(err => console.error("Stop error", err));
              }
            },
            (errorMessage) => {
              // Ignore constant scanning errors
            }
          );
        } catch (err: any) {
          console.error("Camera start error:", err);
          let message = "カメラの起動に失敗しました。";
          if (err.name === 'NotAllowedError') {
            message = "カメラの使用が許可されていません。設定を確認してください。";
          } else if (err.name === 'NotFoundError') {
            message = "カメラが見つかりません。";
          }
          setMigrationError(message);
          setIsScanning(false);
        }
      };

      startScanner();
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Cleanup stop error", err));
      }
    };
  }, [isScanning, showMigrationModal]);

  const getStatsFor = (id: string) => {
    return stats[id] || { highScore: 0, attempts: 0, totalScore: 0 };
  };

  // Mapping of terms to unique IDs
  const termToId = useMemo(() => {
    const map: Record<string, string> = {};
    let count = 1;
    quizCategories.forEach(cat => {
      cat.subcategories.forEach(sub => {
        sub.terms.forEach(term => {
          if (!map[term.name]) {
            map[term.name] = count.toString().padStart(3, '0');
            count++;
          }
        });
      });
    });
    return map;
  }, []);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [isTermPerformanceSearchingAll, setIsTermPerformanceSearchingAll] = useState(false);
  const [isCollectionSearchingAll, setIsCollectionSearchingAll] = useState(false);
  const [activeCollectionTab, setActiveCollectionTab] = useState<string>(quizCategories[0].id);
  const [activeSubcollectionTab, setActiveSubcollectionTab] = useState<string | null>(null);
  const [pickedCard, setPickedCard] = useState<PickedCard | null>(null);
  const [collectionMode, setCollectionMode] = useState<'card' | 'word'>('card');
  const [wordModeIndexes, setWordModeIndexes] = useState<Record<string, number>>({});

  // Reset search terms when changing game state
  useEffect(() => {
    setSearchTerm('');
    setTermPerformanceSearchTerm('');
    setIsTermPerformanceSearchingAll(false);
    setIsCollectionSearchingAll(false);
  }, [gameState]);

  // Reset subcategory tab when main category tab changes, unless the current subcategory is already valid for the new category
  useEffect(() => {
    const category = quizCategories.find(c => c.id === activeCollectionTab);
    if (category && category.subcategories.length > 0) {
      const isValidSub = category.subcategories.some(sub => sub.id === activeSubcollectionTab);
      if (!isValidSub) {
        setActiveSubcollectionTab(category.subcategories[0].id);
      }
    } else {
      setActiveSubcollectionTab(null);
    }
  }, [activeCollectionTab]);

  // Category color mapping
  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case '1': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', accent: 'bg-emerald-500', light: 'bg-emerald-100/50' };
      case '2': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', accent: 'bg-blue-500', light: 'bg-blue-100/50' };
      case '3': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', accent: 'bg-amber-500', light: 'bg-amber-100/50' };
      default: return { bg: 'bg-theme-muted', text: 'text-theme-text', border: 'border-theme-border', accent: 'bg-theme-text-muted', light: 'bg-theme-border/50' };
    }
  };

  const getGachaPullCount = () => {
    if (!selectedSubcategory && questions.length === 100) {
      // Speed Star Mode
      if (speedStarCorrectCount === 0) return 0;
      let count = 1; // Base 1 pull for 1+ correct
      let tempCorrect = speedStarCorrectCount;
      let currentRequired = 3;
      let nextInc = 4;
      while (tempCorrect >= currentRequired) {
        count++;
        tempCorrect -= currentRequired;
        currentRequired = nextInc;
        nextInc++;
      }
      return count;
    }
    
    // Regular Quiz Modes
    if (questions.length === 20) return 5;
    if (questions.length === 10) return 2;
    if (questions.length === 5) {
      if (isDailyChallenge) {
        return (correctCount / questions.length) >= 0.5 ? 2 : 1;
      }
      return (correctCount / questions.length) >= 0.5 ? 1 : 0;
    }
    return 0;
  };

  const drawSingleCard = (currentCollection: Record<string, number>) => {
    // Rarity weights based on score
    let weights = { UR: 1, SR: 5, R: 20, C: 74 };
    if (score > 3000) weights = { UR: 10, SR: 25, R: 40, C: 25 };
    else if (score > 2000) weights = { UR: 5, SR: 15, R: 40, C: 40 };
    else if (score > 1000) weights = { UR: 2, SR: 10, R: 30, C: 58 };

    const allTermsList = allTerms;
    
    // Determine rarity first
    const rand = Math.random() * 100;
    let selectedRarity: Rarity = 'C';
    let cumulative = 0;
    for (const [rarity, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (rand <= cumulative) {
        selectedRarity = rarity as Rarity;
        break;
      }
    }

    // Determine the base pool of terms
    let baseTerms = allTermsList;
    if (selectedSubcategory && Math.random() < 0.9) {
      const parentCategory = quizCategories.find(cat => 
        cat.subcategories.some(sub => sub.id === selectedSubcategory.id)
      );
      if (parentCategory) {
        baseTerms = parentCategory.subcategories.flatMap(sub => sub.terms.map(t => t.name));
      }
    }

    // Filter terms by rarity
    let possibleTerms = baseTerms.filter(term => (allTermsMap[term]?.rarity || 'C') === selectedRarity);
    
    // Fallback if no terms of this rarity exist in the restricted pool
    if (possibleTerms.length === 0) {
      possibleTerms = allTermsList.filter(term => (allTermsMap[term]?.rarity || 'C') === selectedRarity);
    }
    
    // Bias: 70% chance to pick from unowned if available in this rarity
    const unownedInRarity = possibleTerms.filter(term => !currentCollection[term]);
    if (unownedInRarity.length > 0 && Math.random() < 0.7) {
      possibleTerms = unownedInRarity;
    }

    // Apply 1.3x weight to terms in the current subcategory
    const currentSubcategoryTerms = selectedSubcategory?.terms.map(t => t.name) || [];
    const weightedTerms = possibleTerms.map(term => ({
      term,
      weight: currentSubcategoryTerms.includes(term) ? 1.3 : 1.0
    }));

    const totalWeight = weightedTerms.reduce((sum, item) => sum + item.weight, 0);
    let randWeight = Math.random() * totalWeight;
    let resultTerm = possibleTerms[0];

    for (const item of weightedTerms) {
      randWeight -= item.weight;
      if (randWeight <= 0) {
        resultTerm = item.term;
        break;
      }
    }
    
    return { term: resultTerm, rarity: selectedRarity };
  };

  const gachaTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameState !== 'RESULT') {
      if (gachaTimeoutRef.current) {
        clearTimeout(gachaTimeoutRef.current);
        gachaTimeoutRef.current = null;
      }
      setIsGachaRolling(false);
      setCurrentGachaCard(null);
      setGachaQueue(0);
      setGachaHistory([]);
    }
  }, [gameState]);

  const pullGacha = () => {
    if (isGachaRolling) return;
    
    const pullCount = getGachaPullCount();
    if (pullCount === 0) return;

    setGachaQueue(pullCount - 1);
    setGachaHistory([]);
    setIsGachaRolling(true);

    const firstDraw = drawSingleCard(ownedCards);
    const isDuplicate = (ownedCards[firstDraw.term] || 0) > 0;
    const maxRedraws = firstDraw.rarity === 'UR' ? 3 : firstDraw.rarity === 'SR' ? 2 : 1;

    gachaTimeoutRef.current = setTimeout(() => {
      setCurrentGachaCard({
        term: firstDraw.term,
        initialRarity: firstDraw.rarity,
        redrawsUsed: 0,
        maxRedraws,
        isDuplicate
      });
      setIsGachaRolling(false);
    }, 3000);
  };

  const handleKeepCard = (action: 'next' | 'close' | 'collection' = 'next') => {
    if (!currentGachaCard) return;
    
    const newCollection = { ...ownedCards, [currentGachaCard.term]: (ownedCards[currentGachaCard.term] || 0) + 1 };
    saveCollection(newCollection);
    
    const oldLevel = calculateLevel(ownedCards);
    const newLevel = calculateLevel(newCollection);
    if (newLevel > oldLevel) {
      setTimeout(() => {
        setShowLevelUp(newLevel);
      }, 500);
    }

    const newHistory = [...gachaHistory, currentGachaCard.term];
    setGachaHistory(newHistory);

    if (gachaQueue > 0) {
      setGachaQueue(prev => prev - 1);
      setIsGachaRolling(true);
      setCurrentGachaCard(null);

      const nextDraw = drawSingleCard(newCollection);
      const isDuplicate = (newCollection[nextDraw.term] || 0) > 0;
      const maxRedraws = nextDraw.rarity === 'UR' ? 3 : nextDraw.rarity === 'SR' ? 2 : 1;

      gachaTimeoutRef.current = setTimeout(() => {
        setCurrentGachaCard({
          term: nextDraw.term,
          initialRarity: nextDraw.rarity,
          redrawsUsed: 0,
          maxRedraws,
          isDuplicate
        });
        setIsGachaRolling(false);
      }, 3000);
    } else {
      setGachaResults(newHistory);
      setCurrentGachaCard(null);
      setGachaHistory([]);
      if (action === 'collection') {
        jumpToCollection(currentGachaCard.term);
      }
    }
  };

  const handleRedraw = () => {
    if (!currentGachaCard || currentGachaCard.redrawsUsed >= currentGachaCard.maxRedraws) return;

    setIsGachaRolling(true);
    setCurrentGachaCard(null);

    const redraw = drawSingleCard(ownedCards);
    const isDuplicate = (ownedCards[redraw.term] || 0) > 0;

    gachaTimeoutRef.current = setTimeout(() => {
      setCurrentGachaCard({
        term: redraw.term,
        initialRarity: currentGachaCard.initialRarity,
        redrawsUsed: currentGachaCard.redrawsUsed + 1,
        maxRedraws: currentGachaCard.maxRedraws,
        isDuplicate
      });
      setIsGachaRolling(false);
    }, 3000);
  };

  const jumpToCollection = (term: string) => {
    // Find category and subcategory for this term
    let catId = quizCategories[0].id;
    let subId: string | null = null;

    for (const cat of quizCategories) {
      for (const sub of cat.subcategories) {
        if (sub.terms.some(t => t.name === term)) {
          catId = cat.id;
          subId = sub.id;
          break;
        }
      }
    }

    setSearchTerm(''); // Clear search term to ensure the card is visible
    setActiveCollectionTab(catId);
    setActiveSubcollectionTab(subId);
    setTargetCardId(term);
    setGameState('COLLECTION');
  };

  // Scroll to target card when jumping to collection
  useEffect(() => {
    if (gameState === 'COLLECTION' && targetCardId && cardRefs.current[targetCardId]) {
      setTimeout(() => {
        cardRefs.current[targetCardId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight effect could be added here
        setTargetCardId(null);
      }, 500);
    }
  }, [gameState, targetCardId]);

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

  const getRarityStyles = (rarity: Rarity) => {
    switch (rarity) {
      case 'UR':
        return {
          border: 'border-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]',
          bg: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
          text: 'text-white',
          textColor: 'text-purple-600',
          label: 'Ultra Rare',
          accent: 'bg-theme-card/20',
          glow: 'shadow-[0_0_30px_rgba(236,72,153,0.8)]',
          pulse: 'animate-pulse',
          flash: 'bg-purple-400',
          particles: 20
        };
      case 'SR':
        return {
          border: 'border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]',
          bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
          text: 'text-white',
          textColor: 'text-yellow-600',
          label: 'Super Rare',
          accent: 'bg-theme-card/20',
          glow: 'shadow-[0_0_20px_rgba(250,204,21,0.6)]',
          pulse: 'animate-pulse',
          flash: 'bg-yellow-300',
          particles: 15
        };
      case 'R':
        return {
          border: 'border-4 border-blue-400',
          bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
          text: 'text-white',
          textColor: 'text-blue-600',
          label: 'Rare',
          accent: 'bg-theme-card/20',
          glow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)]',
          pulse: '',
          flash: 'bg-blue-300',
          particles: 8
        };
      default:
        return {
          border: 'border-4 border-theme-border-strong',
          bg: 'bg-theme-card',
          text: 'text-theme-text',
          textColor: 'text-theme-text-muted',
          label: 'Common',
          accent: 'bg-theme-border',
          glow: '',
          pulse: '',
          flash: 'bg-white',
          particles: 0
        };
    }
  };

  // Start the quiz for a subcategory or category
  const startQuiz = async (item: Subcategory | Category) => {
    setIsLoading(true);
    
    let termsToPickFrom: string[] = [];
    let title = "";
    let questionCount = 10;
    
    if ('subcategories' in item) {
      // It's a Category (Unit)
      const termsToPickFromData = item.subcategories.flatMap(sub => sub.terms);
      termsToPickFrom = termsToPickFromData.map(t => t.name);
      title = `${item.title}（単元演習）`;
      setSelectedSubcategory({ id: item.id, title, terms: termsToPickFromData });
      questionCount = 10;
    } else {
      // It's a Subcategory (Sub-unit)
      termsToPickFrom = item.terms.map(t => t.name);
      title = item.title;
      setSelectedSubcategory(item);
      // If the ID matches a top-level category, it's a "Unit Practice" continuation
      const isCategory = quizCategories.some(cat => cat.id === item.id);
      questionCount = isCategory ? 10 : 5;
    }
    
    // Select random terms
    const selectedTerms = [...termsToPickFrom]
      .sort(() => 0.5 - Math.random())
      .slice(0, questionCount);

    try {
      // Generate questions sequentially to track consecutive types
      const generatedQuestions = [];
      let consecutiveDescToTerm = 0;
      
      for (const term of selectedTerms) {
        let forcedType: QuestionType | undefined = undefined;
        if (consecutiveDescToTerm >= 3) {
          forcedType = 'TERM_TO_DESC';
        }
        
        const q = await generateQuestion(term, termsToPickFrom, allTerms, forcedType);
        
        if (q.type === 'DESC_TO_TERM') {
          consecutiveDescToTerm++;
        } else {
          consecutiveDescToTerm = 0;
        }
        
        generatedQuestions.push(q);
      }

      resetQuizState();
      setQuestions(generatedQuestions);
      setGameState('QUIZ');
    } catch (error) {
      console.error("Failed to start quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start comprehensive quiz (random from all categories)
  const startComprehensiveQuiz = async () => {
    setIsLoading(true);
    const title = '総合演習（全単元）';
    setSelectedSubcategory({ id: 'all', title, terms: [] });

    // Flatten all subcategories to pick from
    const allSubcategories = quizCategories.flatMap(cat => cat.subcategories);
    const allTermsData = allSubcategories.flatMap(sub => sub.terms);
    
    // Pick 20 random questions
    const selectedQuestionsData = [];
    for (let i = 0; i < 20; i++) {
      const randomSub = allSubcategories[Math.floor(Math.random() * allSubcategories.length)];
      const randomTerm = randomSub.terms[Math.floor(Math.random() * randomSub.terms.length)];
      selectedQuestionsData.push({ term: randomTerm, subTerms: randomSub.terms });
    }

    try {
      // Generate questions sequentially to track consecutive types
      const generatedQuestions = [];
      let consecutiveDescToTerm = 0;
      
      for (const data of selectedQuestionsData) {
        let forcedType: QuestionType | undefined = undefined;
        if (consecutiveDescToTerm >= 3) {
          forcedType = 'TERM_TO_DESC';
        }
        
        const q = await generateQuestion(data.term.name, data.subTerms.map(t => t.name), allTerms, forcedType);
        
        if (q.type === 'DESC_TO_TERM') {
          consecutiveDescToTerm++;
        } else {
          consecutiveDescToTerm = 0;
        }
        
        generatedQuestions.push(q);
      }

      resetQuizState();
      setQuestions(generatedQuestions);
      setGameState('QUIZ');
    } catch (error) {
      console.error("Failed to start comprehensive quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSpeedStar = async () => {
    setIsLoading(true);
    resetQuizState();
    setSelectedSubcategory(null);
    setSpeedStarCorrectCount(0);
    setSpeedStarRequiredForNext(3);
    setSpeedStarNextIncrement(4);
    setSpeedStarChallenges(prev => prev + 1);
    
    try {
      // Flatten all subcategories to pick from
      const allSubcategories = quizCategories.flatMap(cat => cat.subcategories);
      
      // Pick 100 random questions with dummy options from the same category
      const selectedQuestionsData = [];
      for (let i = 0; i < 100; i++) {
        const randomSub = allSubcategories[Math.floor(Math.random() * allSubcategories.length)];
        const randomTerm = randomSub.terms[Math.floor(Math.random() * randomSub.terms.length)];
        selectedQuestionsData.push({ term: randomTerm, subTerms: randomSub.terms });
      }
      
      const ssQuestions = await Promise.all(
        selectedQuestionsData.map(data => generateQuestion(data.term.name, data.subTerms.map(t => t.name), allTerms, 'DESC_TO_TERM', 4))
      );
      
      setQuestions(ssQuestions);
      setTimeLeft(30);
      setGameState('SPEED_STAR');
      // Ticket is consumed upon starting
      setHasBonusTicket(false);
      storage.setItem('it_quiz_bonus_ticket', 'false');
    } catch (error) {
      console.error("Failed to start Speed Star:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuizState = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(45);
    setUserAnswer(null);
    setFeedback(null);
    setCorrectCount(0);
    setPenaltyActive(false);
    setPenaltyTime(0);
    setGachaResults([]);
    setCurrentGachaCard(null);
    setGachaQueue(0);
    setGachaHistory([]);
    setIsGachaRolling(false);
    setQuestions([]);
    setIsDailyChallenge(false);
  };

  const startDailyChallenge = async () => {
    setIsLoading(true);
    resetQuizState();
    setIsDailyChallenge(true);
    
    // Pick a random subcategory
    const allSubcategories = quizCategories.flatMap(cat => cat.subcategories);
    const randomSub = allSubcategories[Math.floor(Math.random() * allSubcategories.length)];
    setSelectedSubcategory(randomSub);

    try {
      // Pick 5 random terms from this subcategory
      const shuffledTerms = [...randomSub.terms].sort(() => 0.5 - Math.random());
      const selectedTerms = shuffledTerms.slice(0, 5);

      const generatedQuestions = await Promise.all(
        selectedTerms.map(term => 
          generateQuestion(term.name, randomSub.terms.map(t => t.name), allTerms)
        )
      );

      setQuestions(generatedQuestions);
      setGameState('QUIZ');
    } catch (error) {
      console.error("Failed to start daily challenge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const quitQuiz = () => {
    resetQuizState();
    setGameState('CATEGORY_SELECT');
  };

  // Timer logic
  useEffect(() => {
    let timer: number;
    if ((gameState === 'QUIZ' || gameState === 'SPEED_STAR') && timeLeft > 0 && !feedback) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 0.1));
      }, 100);
    } else if (timeLeft === 0 && (gameState === 'QUIZ' || gameState === 'SPEED_STAR') && !feedback) {
      if (gameState === 'SPEED_STAR') {
        // Update Speed Star high scores immediately on timeout
        setSpeedStarMaxCombo(prev => Math.max(prev, maxCombo));
        setSpeedStarMaxCorrect(prev => Math.max(prev, speedStarCorrectCount));
        setGameState('RESULT');
      } else {
        handleAnswer(''); // Time out for regular quiz
      }
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, feedback, maxCombo, speedStarCorrectCount]);

  // Penalty timer logic
  useEffect(() => {
    let timer: number;
    if (penaltyActive && penaltyTime > 0) {
      timer = window.setInterval(() => {
        setPenaltyTime(prev => Math.max(0, prev - 0.1));
      }, 100);
    } else if (penaltyTime <= 0 && penaltyActive) {
      setPenaltyActive(false);
    }
    return () => clearInterval(timer);
  }, [penaltyActive, penaltyTime]);

  const handleAnswer = (answer: string) => {
    if (penaltyActive) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    setUserAnswer(answer);
    
    if (gameState === 'SPEED_STAR') {
      updateTermStats(currentQuestion.term, isCorrect);
      if (isCorrect) {
        setScore(prev => prev + 200);
        setSpeedStarCorrectCount(prev => prev + 1);
        setCombo(prev => prev + 1);
        setMaxCombo(prev => Math.max(prev, combo + 1));
        setTimeLeft(prev => Math.min(30, prev + 2));
        setFeedback('CORRECT');
      } else {
        setCombo(0);
        setTimeLeft(prev => Math.max(0, prev - 5));
        setFeedback('WRONG');
      }
      
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer(null);
        if (currentQuestionIndex < questions.length - 1 && timeLeft > 0) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          // Update Speed Star high scores
          setSpeedStarMaxCombo(prev => Math.max(prev, Math.max(maxCombo, combo + (isCorrect ? 1 : 0))));
          setSpeedStarMaxCorrect(prev => Math.max(prev, speedStarCorrectCount + (isCorrect ? 1 : 0)));
          setGameState('RESULT');
        }
      }, 500);
      return;
    }

    if (isCorrect) {
      updateTermStats(currentQuestion.term, true);
      // Score based on time: Base 100 + (remaining time * 10)
      const timeBonus = Math.floor(timeLeft * 3.33); // Adjusted for 45s limit (150/45 approx 3.33)
      const comboBonus = combo * 20;
      setScore(prev => prev + 100 + timeBonus + comboBonus);
      setCombo(prev => prev + 1);
      setMaxCombo(prev => Math.max(prev, combo + 1));
      setCorrectCount(prev => prev + 1);
      setFeedback('CORRECT');
    } else {
      updateTermStats(currentQuestion.term, false);
      setCombo(0);
      setFeedback('WRONG');
      setPenaltyActive(true);
      setPenaltyTime(5);
    }

    const delay = isCorrect ? 1000 : 5000;

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(45);
      } else {
        // Update stats on completion
        if (selectedSubcategory) {
          updateStats(selectedSubcategory.id, score);
        }
        
        if (isDailyChallenge) {
          const dailyId = getDailyId();
          
          // Streak logic
          const yesterday = new Date();
          const now = new Date();
          const offset = now.getHours() < 5 ? 1 : 0;
          yesterday.setDate(now.getDate() - 1 - offset);
          const yesterdayId = yesterday.toISOString().split('T')[0];
          
          let newStreak = 1;
          if (lastDailyChallengeId === yesterdayId) {
            newStreak = dailyStreak + 1;
          } else if (lastDailyChallengeId === dailyId) {
            newStreak = dailyStreak;
          }
          
          setDailyStreak(newStreak);
          setLastDailyChallengeId(dailyId);
          storage.setItem('it_quiz_last_daily_id', dailyId);
          storage.setItem('it_quiz_daily_streak', newStreak.toString());
        }
        
        setGameState('RESULT');
      }
    }, delay);
  };

  // Filtered terms for collection
  const filteredTerms = useMemo(() => {
    if (isCollectionSearchingAll || searchTerm) {
      // If searching all or searching specific term, ignore category/subcategory tabs and search everywhere
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
  }, [searchTerm, isCollectionSearchingAll, activeCollectionTab, activeSubcollectionTab]);

  const { rarityOwned, rarityTotals, rarityOwnedCopies, rarityTotalCopies, hasAnyDuplicate } = useMemo(() => {
    const totals = { UR: 0, SR: 0, R: 0, C: 0 };
    const owned = { UR: 0, SR: 0, R: 0, C: 0 };
    const totalCopies = { UR: 0, SR: 0, R: 0, C: 0 };
    const ownedCopies = { UR: 0, SR: 0, R: 0, C: 0 };
    let hasDup = false;
    allTerms.forEach(term => {
      const r = (allTermsMap[term]?.rarity || 'C') as 'UR'|'SR'|'R'|'C';
      if (totals[r] !== undefined) {
        totals[r]++;
        totalCopies[r] += 3;
      }
      if (ownedCards[term]) {
        owned[r]++;
        ownedCopies[r] += Math.min(ownedCards[term], 3);
        if (ownedCards[term] > 1) hasDup = true;
      }
    });
    return { rarityOwned: owned, rarityTotals: totals, rarityOwnedCopies: ownedCopies, rarityTotalCopies: totalCopies, hasAnyDuplicate: hasDup };
  }, [ownedCards]);

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-sans selection:bg-theme-accent selection:text-white transition-colors duration-500 overflow-x-hidden">
      {/* Global Header */}
      {userName && gameState !== 'QUIZ' && (
        <header className="sticky top-0 z-40 bg-theme-bg/80 backdrop-blur-md border-b border-theme-border overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-theme-accent text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-theme-accent/20">
                <BrainCircuit size={24} className="md:w-7 md:h-7" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-theme-heading font-bold tracking-tight">IT Quiz Master</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] md:text-xs font-bold text-theme-accent bg-theme-accent/10 px-2 py-0.5 rounded-full">Lv.{userLevel}</span>
                  <span className="text-[10px] md:text-xs font-bold text-theme-text-muted truncate max-w-[100px]">{userName}</span>
                </div>
                {/* Level Progress Bar */}
                <div className="mt-2 w-full max-w-[100px] md:max-w-[180px] h-2 bg-theme-muted rounded-full overflow-hidden border border-theme-border/30 shadow-inner relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${userLevelProgress * 100}%` }}
                    transition={{ type: "spring", damping: 20, stiffness: 50 }}
                    className="h-full bg-gradient-to-r from-theme-accent to-amber-400 relative"
                  >
                    {/* Progress Glow */}
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 blur-sm" />
                  </motion.div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {gameState !== 'START' && gameState !== 'SPEED_STAR' && (
                <button 
                  onClick={() => {
                    if (gameState === 'RESULT') resetQuizState();
                    setGameState('START');
                  }}
                  className="p-2 md:px-4 md:py-2 bg-theme-card rounded-xl border border-theme-border hover:bg-theme-muted transition-all flex items-center gap-2 group"
                  title="トップに戻る"
                >
                  <Home size={18} className="text-theme-text-muted group-hover:text-theme-accent transition-colors" />
                  <span className="font-bold text-sm hidden md:inline">トップに戻る</span>
                </button>
              )}
              {deferredPrompt && (
                <button 
                  onClick={handleInstallClick}
                  className="p-2 md:px-4 md:py-2 bg-theme-accent text-white rounded-xl border border-theme-accent hover:bg-black transition-all flex items-center gap-2 group shadow-lg shadow-theme-accent/20"
                  title="アプリをインストール"
                >
                  <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                  <span className="font-bold text-sm hidden md:inline">インストール</span>
                </button>
              )}
              <button 
                onClick={() => setShowMigrationModal(true)}
                className="p-2 md:px-4 md:py-2 bg-theme-card rounded-xl border border-theme-border hover:bg-theme-muted transition-all flex items-center gap-2 group"
                title="データ移行"
              >
                <RefreshCw size={18} className="text-theme-accent group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-bold text-sm hidden md:inline">データ移行</span>
              </button>
            </div>
          </div>
        </header>
      )}

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
            takeScreenshot={takeScreenshot}
            userLevel={userLevel}
            userName={userName}
            userProfile={userProfile}
            getStatsFor={getStatsFor}
            getCategoryColor={getCategoryColor}
          />
        )}

        {gameState === 'STATS' && (
          <StatsView
            setGameState={setGameState}
            statsRef={statsRef}
            takeScreenshot={takeScreenshot}
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
            startComprehensiveQuiz={startComprehensiveQuiz}
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
            handleAnswer={handleAnswer}
          />
        )}

        {gameState === 'QUIZ' && questions.length > 0 && (
          <QuizView
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            timeLeft={timeLeft}
            score={score}
            combo={combo}
            userAnswer={userAnswer}
            feedback={feedback}
            isDailyChallenge={isDailyChallenge}
            userLevel={userLevel}
            penaltyActive={penaltyActive}
            handleAnswer={handleAnswer}
            quitQuiz={quitQuiz}
          />
        )}

        {gameState === 'RESULT' && (
          <ResultView
            speedStarCorrectCount={speedStarCorrectCount}
            selectedSubcategory={selectedSubcategory}
            getGachaPullCount={getGachaPullCount}
            isDailyChallenge={isDailyChallenge}
            questions={questions}
            correctCount={correctCount}
            gachaResults={gachaResults}
            pullGacha={pullGacha}
            isGachaRolling={isGachaRolling}
            score={score}
            maxCombo={maxCombo}
            hasBonusTicket={hasBonusTicket}
            startSpeedStar={startSpeedStar}
            resetQuizState={resetQuizState}
            setGameState={setGameState}
            startComprehensiveQuiz={startComprehensiveQuiz}
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

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-theme-card/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-theme-accent border-t-transparent rounded-full mb-4"
            />
            <p className="text-lg font-bold text-theme-accent animate-pulse">問題を準備中...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
          >
            {feedback === 'CORRECT' ? (
              <div className="bg-green-500 text-white p-8 rounded-full shadow-2xl">
                <CheckCircle2 size={120} />
              </div>
            ) : (
              <div className="bg-red-500 text-white p-8 rounded-full shadow-2xl">
                <XCircle size={120} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Card Pickup Modal */}
      <AnimatePresence>
        {pickedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          >
            <HaloEffect rarity={allTermsMap[pickedCard.term]?.rarity || 'C'} />
            {/* Backdrop with Rarity Effect */}
            <div 
              className={`absolute inset-0 backdrop-blur-xl ${
                allTermsMap[pickedCard.term]?.rarity === 'UR' ? 'bg-purple-900/40' :
                allTermsMap[pickedCard.term]?.rarity === 'SR' ? 'bg-yellow-900/30' :
                allTermsMap[pickedCard.term]?.rarity === 'R' ? 'bg-blue-900/30' :
                'bg-black/60'
              }`}
              onClick={() => setPickedCard(null)}
            />

            {/* Floating Particles or Glow for High Rarity */}
            {['SR', 'UR'].includes(allTermsMap[pickedCard.term]?.rarity || 'C') && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: Math.random() * window.innerWidth, 
                      y: Math.random() * window.innerHeight,
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{ 
                      y: [null, Math.random() * -200],
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                    className={`absolute w-2 h-2 rounded-full ${
                      allTermsMap[pickedCard.term!]?.rarity === 'UR' ? 'bg-pink-400' : 'bg-yellow-300'
                    } blur-sm`}
                  />
                ))}
              </div>
            )}

            <motion.div
              layoutId={`card-${pickedCard.term}`}
              style={{ perspective: 1000 }}
              initial={{ scale: 0.8, y: 50, rotateY: 180 }}
              animate={{ scale: 1, y: 0, rotateY: 0 }}
              exit={{ scale: 0.8, y: 50, rotateY: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={() => handleCardClick(pickedCard.term)}
              className={`relative w-full max-w-[260px] md:max-w-sm aspect-[2/3] md:aspect-[3/4] max-h-[85vh] rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl border-4 ${getRarityStyles(allTermsMap[pickedCard.term]?.rarity || 'C').border} ${getRarityStyles(allTermsMap[pickedCard.term]?.rarity || 'C').glow} z-10`}
            >
              {/* Card Backgrounds */}
              <div className="absolute inset-0 bg-theme-card" />
              <div className={`absolute inset-0 ${getRarityStyles(allTermsMap[pickedCard.term]?.rarity || 'C').bg} opacity-10`} />

              {/* Pulse Effect (Behind Content) */}
              {getRarityStyles(allTermsMap[pickedCard.term]?.rarity || 'C').pulse && (
                <div className={`absolute inset-0 ${getRarityStyles(allTermsMap[pickedCard.term]?.rarity || 'C').bg} opacity-15 ${getRarityStyles(allTermsMap[pickedCard.term]?.rarity || 'C').pulse} z-0`} />
              )}

              {/* Shine Effect (Behind Content) */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"
              />

              {/* Card Content in Modal */}
              <div className="h-full flex flex-col bg-transparent relative z-10">
                {/* Header */}
                <div className={`px-3 py-2 md:px-4 md:py-3 flex justify-between items-center shrink-0 ${allTermsMap[pickedCard.term]?.rarity !== 'C' ? getRarityStyles(allTermsMap[pickedCard.term]?.rarity || 'C').bg : 'bg-theme-muted'} ${allTermsMap[pickedCard.term]?.rarity !== 'C' ? 'text-white' : 'text-theme-text-muted'}`}>
                  <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase drop-shadow-sm">
                    {getRarityStyles(allTermsMap[pickedCard.term]?.rarity || 'C').label}
                  </span>
                  <span className="text-[8px] md:text-[10px] font-bold bg-theme-card/20 px-2 py-0.5 rounded-full font-mono">
                    ID: {termToId[pickedCard.term] || "000"}
                  </span>
                </div>

                {/* Body */}
                <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center text-center space-y-3 md:space-y-4 overflow-y-auto">
                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl flex items-center justify-center ${getRarityStyles(allTermsMap[pickedCard.term]?.rarity || 'C').bg} ${allTermsMap[pickedCard.term]?.rarity === 'C' || !allTermsMap[pickedCard.term] ? 'text-theme-text' : 'text-white'} shadow-inner shrink-0`}>
                    <div className="hidden md:block">{getTermIcon(pickedCard.term, 48)}</div>
                    <div className="block md:hidden">{getTermIcon(pickedCard.term, 32)}</div>
                  </div>
                  
                  <div className="space-y-1 shrink-0">
                    <h3 className="text-xl md:text-2xl font-bold leading-tight text-theme-text drop-shadow-sm">{pickedCard.term}</h3>
                    <p className="text-[9px] md:text-xs text-theme-text-muted font-bold uppercase tracking-widest">
                      {quizCategories.find(c => c.subcategories.some(s => s.terms.some(t => t.name === pickedCard.term)))?.title || 'Unknown Category'}
                    </p>
                  </div>

                  <motion.div 
                    key={pickedCard.descriptionIndex}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pt-3 md:pt-4 border-t border-theme-border w-full shrink-0"
                  >
                    <div className="flex items-center justify-center gap-1.5 md:gap-2 text-theme-text-muted mb-2">
                      <Info size={12} className="md:w-3 md:h-3" />
                      <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Pattern {pickedCard.descriptionIndex + 1}</span>
                    </div>
                    <p className="text-sm md:text-lg text-theme-text leading-relaxed font-bold mb-2 drop-shadow-sm">
                      "{(allTermsMap[pickedCard.term]?.descriptions || ["説明がありません。"])[pickedCard.descriptionIndex]}"
                    </p>
                    <p className="text-[10px] md:text-sm text-theme-text-muted leading-relaxed italic">
                      {(() => {
                        const flavor = allTermsMap[pickedCard.term]?.flavorTexts;
                        if (!flavor) return "未知のデータ...";
                        if (Array.isArray(flavor)) {
                          return flavor[pickedCard.descriptionIndex % flavor.length];
                        }
                        return flavor;
                      })()}
                    </p>
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 md:px-4 md:py-3 bg-theme-muted flex justify-between items-center shrink-0 border-t border-theme-border">
                  <div className="flex gap-1 md:gap-1.5">
                    {[...Array(Math.min(allTermsMap[pickedCard.term]?.descriptions?.length || 1, 3))].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${i === pickedCard.descriptionIndex ? getRarityStyles(allTermsMap[pickedCard.term]?.rarity || 'C').bg : 'bg-theme-border-strong'}`} 
                      />
                    ))}
                  </div>
                  <div className="text-theme-text-muted animate-bounce">
                    <RotateCcw size={14} className="md:w-4 md:h-4" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Close Hint */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-4 md:bottom-10 text-white/40 md:text-white/60 text-[10px] md:text-sm font-medium tracking-widest uppercase flex flex-col md:flex-row items-center gap-1 md:gap-2 text-center"
            >
              <div className="flex items-center gap-1">
                <MousePointer2 size={12} className="md:w-4 md:h-4" />
                <span>Tap card to switch</span>
              </div>
              <span className="hidden md:inline">•</span>
              <span>Tap outside to close</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {resetStep > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-theme-card w-full max-w-md rounded-[2.5rem] p-10 space-y-8 text-center shadow-2xl border border-theme-border max-h-[90vh] overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle size={40} />
                </div>
                <h2 className="text-2xl font-bold">データの初期化</h2>
                <p className="text-theme-text-muted text-sm">
                  ユーザーデータ、カードコレクション、学習成績をすべて消去します。
                  この操作は取り消せません。
                </p>
              </div>

              <p className="text-center text-red-500 font-bold text-sm bg-red-50 py-2 rounded-lg">
                {resetStep === 1 && "本当によろしいですか？"}
                {resetStep === 2 && "もとに戻せませんよ？"}
                {resetStep === 3 && "(もどせないったら！)"}
                {resetStep === 4 && "(こうかいしませんね？)"}
              </p>

              <div className="flex flex-col gap-3">
                {resetStep < 4 ? (
                  <>
                    <button 
                      onClick={() => {
                        const nextStep = resetStep + 1;
                        setResetStep(nextStep);
                        setResetCooldown(nextStep); // 1s, 2s, 3s
                      }}
                      disabled={resetCooldown > 0}
                      className={`w-full py-4 rounded-2xl font-bold transition-all ${
                        resetCooldown > 0 
                          ? 'bg-theme-muted text-theme-text-muted cursor-not-allowed' 
                          : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
                      }`}
                    >
                      {resetCooldown > 0 ? `${resetCooldown}...` : '次へ進む'}
                    </button>
                    <button 
                      onClick={() => setResetStep(0)}
                      className="w-full py-4 bg-theme-border text-theme-text-muted rounded-2xl font-bold hover:bg-theme-border-strong transition-colors"
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={resetAllStats}
                      disabled={resetCooldown > 0}
                      className={`w-full py-4 rounded-2xl font-bold transition-all ${
                        resetCooldown > 0 
                          ? 'bg-theme-muted text-theme-text-muted cursor-not-allowed' 
                          : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20'
                      }`}
                    >
                      {resetCooldown > 0 ? `${resetCooldown}...` : '後悔しません'}
                    </button>
                    <button 
                      onClick={() => setResetStep(0)}
                      className="w-full py-4 bg-theme-border text-theme-text-muted rounded-2xl font-bold hover:bg-theme-border-strong transition-colors"
                    >
                      いいえ
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-xl overflow-hidden"
            onClick={() => {
              const unlockedLevel = showLevelUp;
              setShowLevelUp(null);
              if (unlockedLevel && unlockedLevel >= 2 && unlockedLevel <= 99) {
                const card = storyCards.find(c => c.id === unlockedLevel - 1);
                if (card) setShowStoryCard(card);
              }
            }}
          >
            <SpeedLines />
            <Burst color="bg-amber-400" count={20} />
            
            <motion.div
              initial={{ scale: 0.5, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 100 }}
              className="text-center space-y-10 p-12 relative z-10"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-40px] bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500 rounded-full blur-3xl opacity-40"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative bg-gradient-to-b from-amber-300 to-amber-600 p-1.5 rounded-full shadow-[0_0_50px_rgba(251,191,36,0.6)]"
                >
                  <div className="bg-theme-card rounded-full p-10">
                    <Trophy size={100} className="text-amber-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                  </div>
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <motion.h2 
                  initial={{ opacity: 0, scale: 2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-6xl md:text-8xl font-theme-heading font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                >
                  LEVEL UP!
                </motion.h2>
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-6 text-amber-400 font-bold"
                >
                  <span className="text-3xl opacity-60">Lv.{showLevelUp - 1}</span>
                  <ArrowRight size={32} className="text-white/40" />
                  <span className="text-white text-6xl md:text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">{showLevelUp}</span>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-white/40 text-lg font-bold tracking-[0.3em] uppercase animate-pulse"
              >
                Tap to continue
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
      <AnimatePresence>
        {!userName && gameState === 'START' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-theme-card w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-theme-border space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-theme-accent/10 text-theme-accent rounded-3xl flex items-center justify-center mx-auto mb-2">
                  <UserCheck size={32} />
                </div>
                <h2 className="text-2xl font-bold">ユーザー登録</h2>
                <p className="text-theme-text-muted text-xs">情報を入力して冒険を始めましょう。</p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const grade = formData.get('grade') as string;
                  const classNum = formData.get('classNum') as string;
                  const attendanceNum = formData.get('attendanceNum') as string;
                  const userNameInput = (formData.get('username') as string).trim();
                  
                  if (!grade || !classNum || !attendanceNum || !userNameInput) {
                    alert("すべての項目を入力してください。");
                    return;
                  }
                  if (parseInt(classNum) < 1 || parseInt(attendanceNum) < 1) {
                    alert("クラスと出席番号は1以上の数値を入力してください。");
                    return;
                  }
                  if (userNameInput.length > 12) {
                    alert("名前は12文字以内で入力してください。");
                    return;
                  }
                  if (/[<>/\\;]/.test(userNameInput)) {
                    alert("名前に使用できない文字が含まれています。");
                    return;
                  }
                  saveUserProfile({ grade, classNum, attendanceNum, userName: userNameInput });
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-theme-text-muted ml-2 uppercase tracking-wider">学年</label>
                    <select name="grade" className="w-full px-4 py-3 bg-theme-muted border-2 border-theme-border rounded-xl focus:border-theme-accent outline-none font-bold transition-all">
                      <option value="">選択</option>
                      <option value="1">1年</option>
                      <option value="2">2年</option>
                      <option value="3">3年</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-theme-text-muted ml-2 uppercase tracking-wider">クラス</label>
                    <input name="classNum" type="number" min="1" placeholder="組" className="w-full px-4 py-3 bg-theme-muted border-2 border-theme-border rounded-xl focus:border-theme-accent outline-none font-bold transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-theme-text-muted ml-2 uppercase tracking-wider">出席番号</label>
                    <input name="attendanceNum" type="number" min="1" placeholder="番" className="w-full px-4 py-3 bg-theme-muted border-2 border-theme-border rounded-xl focus:border-theme-accent outline-none font-bold transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-theme-text-muted ml-2 uppercase tracking-wider">ユーザーネーム（ハンドルネーム可）</label>
                  <input 
                    name="username"
                    type="text"
                    placeholder="最大12文字"
                    className="w-full px-4 py-3 bg-theme-muted border-2 border-theme-border rounded-xl focus:border-theme-accent outline-none font-bold transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-theme-accent text-white rounded-2xl font-bold text-lg shadow-lg shadow-theme-accent/30 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                >
                  冒険を始める
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install Prompt Modal (Mobile) */}
      <AnimatePresence>
        {showInstallPrompt && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[700] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-theme-card w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-theme-border space-y-8 text-center max-h-[90vh] overflow-y-auto"
            >
              <div className="w-16 h-16 bg-theme-accent/10 text-theme-accent rounded-3xl flex items-center justify-center mx-auto mb-2">
                <Download size={32} />
              </div>
              <h2 className="text-2xl font-bold">アプリをインストール</h2>
              <p className="text-theme-text-muted text-sm">
                ホーム画面に追加すると、より快適に学習を進めることができます！
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-4 bg-theme-accent text-white rounded-xl font-bold text-lg hover:bg-black transition-colors"
                >
                  インストールする
                </button>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="w-full py-4 bg-theme-muted text-theme-text-muted rounded-xl font-bold hover:bg-theme-border transition-colors"
                >
                  あとで
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Migration Modal */}
      <AnimatePresence>
        {showMigrationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`bg-theme-card w-full ${isQRFullscreen && migrationQR ? 'max-w-none h-full' : 'max-w-lg'} p-8 rounded-[2.5rem] shadow-2xl border border-theme-border space-y-6 relative ${isQRFullscreen && migrationQR ? '' : 'max-h-[90vh] overflow-y-auto'}`}
            >
              <button 
                onClick={() => {
                  setShowMigrationModal(false);
                  setMigrationQR(null);
                  setIsScanning(false);
                  setMigrationError(null);
                  setPendingMigrationData(null);
                  setIsQRFullscreen(false);
                }}
                className="absolute top-6 right-6 p-2 hover:bg-theme-muted rounded-full transition-colors z-10"
              >
                <X size={24} />
              </button>

              {!isQRFullscreen && (
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-theme-accent/10 text-theme-accent rounded-3xl flex items-center justify-center mx-auto mb-2">
                    <RefreshCw size={32} />
                  </div>
                  <h2 className="text-2xl font-bold">データ移行</h2>
                  <p className="text-theme-text-muted text-sm">他のデバイスへデータを引き継いだり、読み込んだりできます。</p>
                </div>
              )}

              {!migrationQR && !isScanning && !pendingMigrationData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={exportData}
                    className="p-6 bg-theme-muted border-2 border-theme-border rounded-3xl hover:border-theme-accent transition-all group text-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-theme-accent/10 text-theme-accent rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <QrCode size={24} />
                    </div>
                    <div className="font-bold">QRコード発行</div>
                    <div className="text-xs text-theme-text-muted">現在のデータをQRコードとして出力します。</div>
                  </button>
                  <button 
                    onClick={() => setIsScanning(true)}
                    className="p-6 bg-theme-muted border-2 border-theme-border rounded-3xl hover:border-theme-accent transition-all group text-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-theme-accent/10 text-theme-accent rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Scan size={24} />
                    </div>
                    <div className="font-bold">QRコード読み取り</div>
                    <div className="text-xs text-theme-text-muted">他のデバイスのQRコードを読み込みます。</div>
                  </button>
                </div>
              )}

              {!migrationQR && !isScanning && !pendingMigrationData && (
                <div className="pt-4 border-t border-theme-border">
                  <button 
                    onClick={() => {
                      setShowMigrationModal(false);
                      setResetStep(1);
                      setResetCooldown(0);
                    }}
                    className="w-full py-4 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors"
                  >
                    <RotateCcw size={20} />
                    データをリセット
                  </button>
                </div>
              )}

              {migrationQR && (
                <div className={`space-y-6 text-center ${isQRFullscreen ? 'h-full flex flex-col justify-center items-center' : ''}`}>
                  <ErrorBoundary>
                    <div 
                      onClick={() => setIsQRFullscreen(!isQRFullscreen)}
                      className={`bg-white p-6 rounded-3xl inline-block shadow-inner border-4 border-theme-accent/20 cursor-pointer transition-all ${isQRFullscreen ? 'scale-110 sm:scale-125' : 'hover:scale-105'}`}
                    >
                      <QRCodeSVG 
                        value={migrationQR} 
                        size={isQRFullscreen ? (window.innerWidth < 640 ? 280 : 400) : 256} 
                        level="L" 
                        includeMargin={true} 
                      />
                    </div>
                  </ErrorBoundary>
                  
                  {!isQRFullscreen ? (
                    <>
                      <div className="space-y-2">
                        <p className="font-bold text-theme-accent">QRコードが発行されました</p>
                        <p className="text-xs text-theme-text-muted">このQRコードを移行先のデバイスで読み取ってください。<br/>タップすると拡大表示します。</p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => setMigrationQR(null)}
                          className="w-full py-4 bg-theme-border text-theme-text rounded-2xl font-bold hover:bg-theme-border-strong transition-all"
                        >
                          戻る
                        </button>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(migrationQR).then(() => {
                              alert("データをクリップボードにコピーしました。");
                            });
                          }}
                          className="w-full py-2 text-xs text-theme-text-muted hover:text-theme-accent transition-colors"
                        >
                          テキストとしてコピー（QRコードが読めない場合）
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-8">
                      <button 
                        onClick={() => setIsQRFullscreen(false)}
                        className="px-8 py-3 bg-theme-accent text-white rounded-full font-bold shadow-lg"
                      >
                        拡大を解除
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isScanning && (
                <div className="space-y-6">
                  <div id="qr-reader" className="overflow-hidden rounded-3xl border-2 border-theme-accent shadow-lg min-h-[300px] bg-black"></div>
                  <div className="text-center space-y-2">
                    <p className="font-bold">スキャン中...</p>
                    <p className="text-xs text-theme-text-muted">移行元のQRコードをカメラにかざしてください。</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setIsScanning(false)}
                      className="w-full py-4 bg-theme-border text-theme-text rounded-2xl font-bold hover:bg-theme-border-strong transition-all"
                    >
                      キャンセル
                    </button>
                    <button 
                      onClick={() => {
                        const text = prompt("コピーしたテキストを貼り付けてください：");
                        if (text) processMigrationData(text);
                      }}
                      className="w-full py-2 text-xs text-theme-text-muted hover:text-theme-accent transition-colors"
                    >
                      テキストから読み込む
                    </button>
                  </div>
                </div>
              )}

              {pendingMigrationData && (
                <div className="space-y-6">
                  <div className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 text-red-600 font-bold">
                      <AlertTriangle size={24} />
                      <span>データの書き換え警告</span>
                    </div>
                    <p className="text-sm text-red-500 leading-relaxed">
                      読み取ったデータで現在の学習状況を上書きしますか？<br />
                      <span className="font-bold">現在のデータは完全に消去され、元に戻すことはできません。</span>
                    </p>
                    <div className="p-4 bg-white/50 rounded-xl space-y-1 text-xs text-theme-text-muted">
                      <p>移行されるユーザー: <span className="font-bold text-theme-text">{pendingMigrationData.userName}</span></p>
                      <p>移行されるレベル: <span className="font-bold text-theme-text">Lv.{calculateLevel(pendingMigrationData.ownedCards)}</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={confirmMigration}
                      className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all"
                    >
                      データを上書きして移行する
                    </button>
                    <button 
                      onClick={() => setPendingMigrationData(null)}
                      className="w-full py-4 bg-theme-border text-theme-text rounded-2xl font-bold hover:bg-theme-border-strong transition-all"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}

              {migrationError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold text-center border border-red-100">
                  {migrationError}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
