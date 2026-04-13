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
import { quizCategories, Category, Subcategory, allTermsMap, allTerms, Rarity } from './data/quizData';
import { storyCards, StoryCard } from './data/storyData';
import { generateQuestion, Question, QuestionType } from './services/geminiService';

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

// Helper to get icon for a term
const getTermIcon = (term: string, size: number = 32) => {
  const t = term.toLowerCase();
  let IconComponent = Code;

  if (t.includes('データ') || t.includes('標本') || t.includes('量的') || t.includes('質的')) IconComponent = Database;
  else if (t.includes('ai') || t.includes('人工知能') || t.includes('脳')) IconComponent = Brain;
  else if (t.includes('クラウド')) IconComponent = Cloud;
  else if (t.includes('iot') || t.includes('デバイス') || t.includes('スマート')) IconComponent = Smartphone;
  else if (t.includes('sns') || t.includes('メール') || t.includes('メーリング')) IconComponent = MessageSquare;
  else if (t.includes('インタフェース') || t.includes('マウス') || t.includes('クリック')) IconComponent = MousePointerClick;
  else if (t.includes('デザイン') || t.includes('ユニバーサル')) IconComponent = Sparkles;
  else if (t.includes('仮想') || t.includes('拡張') || t.includes('複合') || t.includes('vr') || t.includes('ar') || t.includes('mr')) IconComponent = Layers;
  else if (t.includes('サーバ')) IconComponent = Server;
  else if (t.includes('通信') || t.includes('ict') || t.includes('ネットワーク') || t.includes('lan') || t.includes('wan')) IconComponent = Network;
  else if (t.includes('ic') || t.includes('rfid') || t.includes('非接触')) IconComponent = Radio;
  else if (t.includes('gps') || t.includes('住所') || t.includes('ドメイン')) IconComponent = MapPin;
  else if (t.includes('銀行') || t.includes('決済') || t.includes('商取引') || t.includes('ec')) IconComponent = CreditCard;
  else if (t.includes('ショッピング')) IconComponent = ShoppingCart;
  else if (t.includes('発注') || t.includes('eos')) IconComponent = Truck;
  else if (t.includes('モラル') || t.includes('肖像') || t.includes('プライバシー')) IconComponent = UserCheck;
  else if (t.includes('詐欺') || t.includes('有害') || t.includes('攻撃') || t.includes('マルウェア') || t.includes('ウイルス')) IconComponent = AlertTriangle;
  else if (t.includes('id') || t.includes('パスワード') || t.includes('認証')) IconComponent = Fingerprint;
  else if (t.includes('法') || t.includes('権利') || t.includes('知的財産')) IconComponent = Gavel;
  else if (t.includes('著作権')) IconComponent = Copyright;
  else if (t.includes('クリエイティブ')) IconComponent = CreativeCommons;
  else if (t.includes('ハードウェア') || t.includes('装置') || t.includes('cpu')) IconComponent = Cpu;
  else if (t.includes('記憶') || t.includes('メモリ') || t.includes('hdd') || t.includes('ssd')) IconComponent = HardDrive;
  else if (t.includes('解像度') || t.includes('カメラ')) IconComponent = Camera;
  else if (t.includes('bluetooth') || t.includes('無線') || t.includes('wifi') || t.includes('wi-fi')) IconComponent = Wifi;
  else if (t.includes('アクセスポイント')) IconComponent = Radio;
  else if (t.includes('hdmi') || t.includes('usb') || t.includes('ケーブル')) IconComponent = Link;
  else if (t.includes('デジタル') || t.includes('アナログ') || t.includes('ビット') || t.includes('バイト') || t.includes('2進数') || t.includes('バイナリ')) IconComponent = Binary;
  else if (t.includes('変換') || t.includes('圧縮') || t.includes('解凍')) IconComponent = RefreshCw;
  else if (t.includes('ms') || t.includes('μs') || t.includes('ns') || t.includes('ps') || t.includes('fs') || t.includes('時間') || t.includes('時計')) IconComponent = Clock;
  else if (t.includes('ソフトウェア') || t.includes('os') || t.includes('アプリ')) IconComponent = Settings;
  else if (t.includes('インストール')) IconComponent = Download;
  else if (t.includes('アンインストール')) IconComponent = Trash2;
  else if (t.includes('オープンソース') || t.includes('フリー') || t.includes('シェア')) IconComponent = BookOpen;
  else if (t.includes('バグ') || t.includes('パッチ')) IconComponent = PenTool;
  else if (t.includes('ファイル') || t.includes('テキスト')) IconComponent = FileText;
  else if (t.includes('フォルダ')) IconComponent = Archive;
  else if (t.includes('インターネット') || t.includes('プロバイダ') || t.includes('web') || t.includes('ブラウザ') || t.includes('url') || t.includes('html')) IconComponent = Globe;
  else if (t.includes('アップロード')) IconComponent = Upload;
  else if (t.includes('ダウンロード')) IconComponent = Download;
  else if (t.includes('検索')) IconComponent = SearchCode;
  else if (t.includes('セキュリティ') || t.includes('暗号') || t.includes('盾')) IconComponent = Shield;
  else if (t.includes('バックアップ')) IconComponent = Box;
  else if (t.includes('統計') || t.includes('分散') || t.includes('偏差') || t.includes('相関')) IconComponent = Activity;
  else if (t.includes('平均') || t.includes('中央') || t.includes('最頻') || t.includes('代表')) IconComponent = Target;
  else if (t.includes('ヒストグラム') || t.includes('棒グラフ')) IconComponent = BarChart;
  else if (t.includes('円グラフ') || t.includes('割合')) IconComponent = PieChart;
  else if (t.includes('散布図') || t.includes('点')) IconComponent = Zap;
  else if (t.includes('折れ線') || t.includes('チャート') || t.includes('分析')) IconComponent = LineChart;
  else if (t.includes('ロジカル') || t.includes('思考') || t.includes('mece') || t.includes('swot') || t.includes('pdca')) IconComponent = Lightbulb;
  else if (t.includes('ガント') || t.includes('予定') || t.includes('進捗')) IconComponent = Clock;
  else if (t.includes('ブレーン') || t.includes('アイデア') || t.includes('kj')) IconComponent = Sparkles;
  else if (t.includes('シミュレーション')) IconComponent = Monitor;
  else if (t.includes('アルゴリズム') || t.includes('プログラム') || t.includes('流れ図')) IconComponent = Terminal;

  return <IconComponent size={size} />;
};

const HaloEffect = ({ rarity }: { rarity: Rarity }) => {
  const getColors = () => {
    switch (rarity) {
      case 'UR': return 'rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.3), rgba(251, 146, 60, 0.2)';
      case 'SR': return 'rgba(250, 204, 21, 0.4), rgba(249, 115, 22, 0.3), transparent';
      case 'R': return 'rgba(59, 130, 246, 0.4), rgba(79, 70, 229, 0.3), transparent';
      default: return 'rgba(148, 163, 184, 0.2), transparent, transparent';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      {/* Radial Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[150vmax] h-[150vmax] rounded-full"
        style={{
          background: `radial-gradient(circle, ${getColors()})`,
          filter: 'blur(100px)',
        }}
      />
    </div>
  );
};

const Burst = ({ color, count }: { color: string, count: number }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          x: "50%", 
          y: "50%", 
          scale: 0,
          opacity: 1,
          left: 0,
          top: 0
        }}
        animate={{ 
          x: `${50 + (Math.random() - 0.5) * 200}%`,
          y: `${50 + (Math.random() - 0.5) * 200}%`,
          scale: [0, 1, 0],
          opacity: [1, 1, 0]
        }}
        transition={{ 
          duration: 1, 
          ease: "easeOut",
          delay: 0.1
        }}
        className={`absolute w-2 h-2 rounded-full ${color} blur-[1px]`}
      />
    ))}
  </div>
);

const SpeedLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          rotate: (i * 360) / 15,
          scaleX: 0,
          opacity: 0,
          x: "-50%",
          y: "-50%",
          left: "50%",
          top: "50%"
        }}
        animate={{ 
          scaleX: [0, 1.2, 0],
          opacity: [0, 0.4, 0],
        }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          delay: Math.random() * 0.5,
          ease: "easeInOut"
        }}
        className="absolute h-[2px] w-[1000px] bg-gradient-to-r from-transparent via-white/30 to-transparent origin-left"
      />
    ))}
  </div>
);

const GachaRollingOverlay = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[700] bg-slate-900 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>
      
      {/* Particle Stream Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-emerald-500 to-transparent animate-[fall_2s_linear_infinite]"></div>
        <div className="absolute top-0 left-2/4 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-[fall_3s_linear_infinite_0.5s]"></div>
        <div className="absolute top-0 left-3/4 w-1 h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-[fall_2.5s_linear_infinite_1s]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="w-32 h-32 border-4 border-cyan-500/30 rounded-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-cyan-400 text-2xl font-mono tracking-[0.3em] uppercase animate-pulse">
            Data Analyzing...
          </h2>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Background Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full blur-[1px] animate-ping opacity-20"></div>
        <div className="absolute top-3/4 left-2/3 w-3 h-3 bg-purple-400 rounded-full blur-[1px] animate-ping opacity-20 [animation-delay:1s]"></div>
        <div className="absolute top-1/2 left-4/5 w-2 h-2 bg-emerald-400 rounded-full blur-[1px] animate-ping opacity-20 [animation-delay:2s]"></div>
      </div>

      {/* Final Flash Trigger */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{ duration: 3, times: [0, 0.9, 1] }}
        className="absolute inset-0 bg-white z-[800] pointer-events-none"
      />
    </motion.div>
  );
};

const StoryCardOverlay = ({ card, onClose }: { card: StoryCard; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6"
      onClick={onClose}
    >
      <SpeedLines />
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateY: 180 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        className="relative w-full max-w-sm aspect-[2/3] bg-slate-900 rounded-[2.5rem] border-4 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
        
        {/* Card Header */}
        <div className="p-6 border-b border-amber-500/20 flex justify-between items-center bg-amber-500/5">
          <span className="text-amber-500 font-black tracking-widest text-xs uppercase">Story Card #{card.id}</span>
          <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">{card.chapter}</span>
        </div>

        {/* Card Content */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
          <div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center">
            <BookOpen size={40} className="text-amber-500" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">「{card.title}」</h3>
            <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full opacity-50" />
            <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap text-left">
              {card.content}
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-6 text-center border-t border-amber-500/10">
          <button 
            onClick={onClose}
            className="text-amber-500/60 font-bold text-xs uppercase tracking-[0.2em] hover:text-amber-500 transition-colors"
          >
            Tap to close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-red-600">エラーが発生しました</h2>
          <p className="text-sm text-red-500">
            申し訳ありません。予期せぬエラーが発生しました。<br />
            {this.state.error?.message.includes('too large') ? 'データ量が多すぎてQRコードを作成できません。' : 'アプリを再読み込みしてください。'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold"
          >
            再読み込み
          </button>
        </div>
      );
    }

    return this.props.children;
  }
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
    const saved = localStorage.getItem('it_quiz_term_stats');
    return saved ? JSON.parse(saved) : {};
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
    return localStorage.getItem('it_quiz_last_daily_id') || '';
  });
  const [dailyStreak, setDailyStreak] = useState<number>(() => {
    return parseInt(localStorage.getItem('it_quiz_daily_streak') || '0', 10);
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
    const savedName = localStorage.getItem('it_quiz_username');
    const savedProfile = localStorage.getItem('it_quiz_user_profile');
    if (savedName) setUserName(savedName);
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));

    const savedStats = localStorage.getItem('it_quiz_stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Failed to parse stats", e);
      }
    }

    const savedTicket = localStorage.getItem('it_quiz_bonus_ticket');
    if (savedTicket) setHasBonusTicket(savedTicket === 'true');

    const savedQuizCount = localStorage.getItem('it_quiz_count');
    if (savedQuizCount) setQuizCount(parseInt(savedQuizCount, 10));

    const savedSpeedStarStats = localStorage.getItem('it_quiz_speed_star_stats');
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

    const savedCollection = localStorage.getItem('it_quiz_collection');
    if (savedCollection) {
      try {
        setOwnedCards(JSON.parse(savedCollection));
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
    localStorage.setItem('it_quiz_collection', JSON.stringify(cappedCollection));
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
    localStorage.setItem('it_quiz_stats', JSON.stringify(newStats));
  };

  const saveUserProfile = (profile: { grade: string; classNum: string; attendanceNum: string; userName: string }) => {
    setUserName(profile.userName);
    setUserProfile({ grade: profile.grade, classNum: profile.classNum, attendanceNum: profile.attendanceNum });
    localStorage.setItem('it_quiz_username', profile.userName);
    localStorage.setItem('it_quiz_user_profile', JSON.stringify({ grade: profile.grade, classNum: profile.classNum, attendanceNum: profile.attendanceNum }));
    
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
    localStorage.setItem('it_quiz_speed_star_stats', JSON.stringify(stats));
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
      localStorage.setItem('it_quiz_term_stats', JSON.stringify(newStats));
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
      localStorage.setItem('it_quiz_count', newQuizCount.toString());
      
      if (newQuizCount % 3 === 0 && !hasBonusTicket) {
        setHasBonusTicket(true);
        localStorage.setItem('it_quiz_bonus_ticket', 'true');
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
    localStorage.removeItem('it_quiz_term_stats');
    setUserName(null);
    setUserProfile(null);
    localStorage.removeItem('it_quiz_username');
    localStorage.removeItem('it_quiz_user_profile');
    
    // Speed Star Stats Reset
    localStorage.removeItem('it_quiz_speed_star_stats');
    setSpeedStarMaxCombo(0);
    setSpeedStarMaxCorrect(0);
    setSpeedStarChallenges(0);
    
    // Daily Challenge Reset
    setLastDailyChallengeId(null);
    setDailyStreak(0);
    localStorage.removeItem('it_quiz_last_daily_id');
    localStorage.removeItem('it_quiz_daily_streak');

    // Other Related Data Reset
    localStorage.removeItem('it_quiz_count');
    setQuizCount(0);
    localStorage.removeItem('it_quiz_bonus_ticket');
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

      // Compression logic
      const compressData = () => {
        let compressed = "";
        // termStats: T + ID(3 hex) + Correct(2 hex) + Total(2 hex) = 8 chars
        Object.entries(filteredTermStats).forEach(([name, stat]) => {
          const term = allTermsMap[name];
          if (term) {
            const id = term.id.toString(16).padStart(3, '0');
            const correct = Math.min(255, stat.correct).toString(16).padStart(2, '0');
            const total = Math.min(255, stat.total).toString(16).padStart(2, '0');
            compressed += `T${id}${correct}${total}`;
          }
        });
        // ownedCards: C + ID(3 hex) + Count(2 hex) = 6 chars
        Object.entries(ownedCards).forEach(([name, count]) => {
          const term = allTermsMap[name];
          if (term && count > 0) {
            const id = term.id.toString(16).padStart(3, '0');
            const c = Math.min(255, count).toString(16).padStart(2, '0');
            compressed += `C${id}${c}`;
          }
        });
        return compressed;
      };

      const data = {
        v: 2, // Version 2: Compressed
        u: userName,
        p: userProfile,
        s: stats,
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
      const encrypted = CryptoJS.AES.encrypt(jsonString, 'it-quiz-master-secret-key').toString();
      
      // QR code data limit check (approximate)
      if (encrypted.length > 4000) {
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
      const bytes = CryptoJS.AES.decrypt(encryptedData, 'it-quiz-master-secret-key');
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      
      let finalData: any = {};

      if (decryptedData.v === 2) {
        // Decompress version 2
        const idToName: Record<number, string> = {};
        Object.values(allTermsMap).forEach(t => idToName[t.id] = t.name);

        const stats: TermStats = {};
        const owned: Record<string, number> = {};
        const d = decryptedData.d || "";
        
        let i = 0;
        while (i < d.length) {
          const type = d[i];
          if (type === 'T') {
            const id = parseInt(d.substring(i + 1, i + 4), 16);
            const correct = parseInt(d.substring(i + 4, i + 6), 16);
            const total = parseInt(d.substring(i + 6, i + 8), 16);
            const name = idToName[id];
            if (name) stats[name] = { correct, total };
            i += 8;
          } else if (type === 'C') {
            const id = parseInt(d.substring(i + 1, i + 4), 16);
            const count = parseInt(d.substring(i + 4, i + 6), 16);
            const name = idToName[id];
            if (name) owned[name] = count;
            i += 6;
          } else {
            i++;
          }
        }

        finalData = {
          userName: decryptedData.u,
          userProfile: decryptedData.p,
          stats: decryptedData.s,
          ownedCards: owned,
          termStats: stats,
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
      if (pendingMigrationData.termStats) {
        setTermStats(pendingMigrationData.termStats);
        localStorage.setItem('it_quiz_term_stats', JSON.stringify(pendingMigrationData.termStats));
      }
      
      // New fields
      if (pendingMigrationData.hasBonusTicket !== undefined) {
        setHasBonusTicket(pendingMigrationData.hasBonusTicket);
        localStorage.setItem('it_quiz_bonus_ticket', pendingMigrationData.hasBonusTicket.toString());
      }
      if (pendingMigrationData.quizCount !== undefined) {
        setQuizCount(pendingMigrationData.quizCount);
        localStorage.setItem('it_quiz_count', pendingMigrationData.quizCount.toString());
      }
      if (pendingMigrationData.speedStarStats) {
        setSpeedStarMaxCombo(pendingMigrationData.speedStarStats.maxCombo || 0);
        setSpeedStarMaxCorrect(pendingMigrationData.speedStarStats.maxCorrect || 0);
        setSpeedStarChallenges(pendingMigrationData.speedStarStats.challenges || 0);
        localStorage.setItem('it_quiz_speed_star_stats', JSON.stringify(pendingMigrationData.speedStarStats));
      }
      if (pendingMigrationData.lastDailyChallengeId !== undefined) {
        setLastDailyChallengeId(pendingMigrationData.lastDailyChallengeId);
        localStorage.setItem('it_quiz_last_daily_id', pendingMigrationData.lastDailyChallengeId);
      }
      if (pendingMigrationData.dailyStreak !== undefined) {
        setDailyStreak(pendingMigrationData.dailyStreak);
        localStorage.setItem('it_quiz_daily_streak', pendingMigrationData.dailyStreak.toString());
      }
      
      // Save to localStorage
      localStorage.setItem('it_quiz_username', pendingMigrationData.userName || '');
      localStorage.setItem('it_quiz_user_profile', JSON.stringify(pendingMigrationData.userProfile));
      localStorage.setItem('it_quiz_stats', JSON.stringify(pendingMigrationData.stats));
      localStorage.setItem('it_quiz_collection', JSON.stringify(pendingMigrationData.ownedCards));
      
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
  const [activeCollectionTab, setActiveCollectionTab] = useState<string>(quizCategories[0].id);
  const [activeSubcollectionTab, setActiveSubcollectionTab] = useState<string | null>(null);
  const [pickedCard, setPickedCard] = useState<PickedCard | null>(null);
  const [collectionMode, setCollectionMode] = useState<'card' | 'word'>('card');
  const [wordModeIndexes, setWordModeIndexes] = useState<Record<string, number>>({});

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

    setTimeout(() => {
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

      setTimeout(() => {
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

    setTimeout(() => {
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
      localStorage.setItem('it_quiz_bonus_ticket', 'false');
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
          localStorage.setItem('it_quiz_last_daily_id', dailyId);
          localStorage.setItem('it_quiz_daily_streak', newStreak.toString());
        }
        
        setGameState('RESULT');
      }
    }, delay);
  };

  // Filtered terms for collection
  const filteredTerms = useMemo(() => {
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

    if (searchTerm) {
      // If searching, ignore category/subcategory tabs and search everywhere
      let allTermsResults: { term: string; category: string; subcategoryId: string }[] = [];
      quizCategories.forEach(cat => {
        cat.subcategories.forEach(sub => {
          sub.terms.forEach(term => {
            if (term.name.includes(searchTerm)) {
              allTermsResults.push({ term: term.name, category: cat.title, subcategoryId: sub.id });
            }
          });
        });
      });
      return allTermsResults;
    }

    return terms;
  }, [searchTerm, activeCollectionTab, activeSubcollectionTab]);

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
    <div className="min-h-screen bg-theme-bg text-theme-text font-sans selection:bg-theme-accent selection:text-white transition-colors duration-500">
      {/* Global Header */}
      {userName && gameState !== 'QUIZ' && (
        <header className="sticky top-0 z-40 bg-theme-bg/80 backdrop-blur-md border-b border-theme-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
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
                <div className="mt-2 w-full max-w-[180px] h-2 bg-theme-muted rounded-full overflow-hidden border border-theme-border/30 shadow-inner relative">
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
            <div className="flex items-center gap-2">
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
              {hasBonusTicket && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl border border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.2)] animate-pulse">
                  <Zap size={16} className="text-amber-400" />
                  <span className="text-[10px] md:text-xs font-black text-amber-400 tracking-tighter uppercase">Bonus Ticket</span>
                </div>
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
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center relative"
          >
            <div className="mb-8 relative mt-12 md:mt-0">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="bg-theme-accent p-6 rounded-3xl shadow-xl"
              >
                <BrainCircuit size={80} className="text-white" />
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-theme-secondary text-white p-3 rounded-full shadow-lg"
              >
                <Zap size={24} />
              </motion.div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-theme-heading font-bold mb-4 tracking-tight">
              IT Quiz <span className="italic text-theme-accent">Master</span>
              <span className="block text-2xl md:text-3xl mt-2 font-sans font-medium text-theme-text-muted">【情報基礎】の知識を極めよう</span>
            </h1>
            
            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 w-full max-w-6xl px-4">
              {!isDailyChallengeCompleted && (
                <button 
                  onClick={startDailyChallenge}
                  className="group relative px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full text-lg md:text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(124,58,237,0.5)] flex-1 min-w-[200px] max-w-xs border-2 border-white/20"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Sparkles size={24} className="text-amber-300 animate-pulse" /> Daily Challenge <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  {dailyStreak > 0 && (
                    <div className="absolute -top-1 -right-1 bg-amber-400 text-black text-[10px] px-2 py-0.5 rounded-full font-black shadow-sm">
                      {dailyStreak} DAY STREAK!
                    </div>
                  )}
                </button>
              )}

              {hasBonusTicket && (
                <button 
                  onClick={startSpeedStar}
                  className="group relative px-8 md:px-10 py-4 md:py-5 bg-black text-amber-400 border-2 border-amber-400 rounded-full text-lg md:text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl flex-1 min-w-[200px] max-w-xs"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Zap size={24} className="animate-pulse" /> SPEED STAR <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-amber-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              )}

              <button 
                onClick={() => setGameState('CATEGORY_SELECT')}
                className="group relative px-8 md:px-10 py-4 md:py-5 bg-theme-text text-theme-bg text-white rounded-full text-lg md:text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl flex-1 min-w-[200px] max-w-xs"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Start Challenge <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-theme-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button 
                onClick={() => setGameState('COLLECTION')}
                className="group relative px-8 md:px-10 py-4 md:py-5 bg-theme-card text-[#141414] border-2 border-theme-border-strong rounded-full text-lg md:text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg flex-1 min-w-[200px] max-w-xs"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Card Collection <LayoutGrid size={24} />
                </span>
              </button>

              <button 
                onClick={() => setGameState('STATS')}
                className="md:hidden group relative px-8 md:px-10 py-4 md:py-5 bg-theme-card text-theme-accent border-2 border-theme-accent/20 rounded-full text-lg md:text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg flex-1 min-w-[200px] max-w-xs"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  学習成績 <BarChart size={24} />
                </span>
              </button>

              <button 
                onClick={() => setGameState('STORY')}
                className="group relative px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white border-2 border-slate-700 rounded-full text-lg md:text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg flex-1 min-w-[200px] max-w-xs"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  STORY <BookOpen size={24} className="text-amber-400" />
                </span>
                <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>

            {/* Collection Progress Section */}
            <button 
              onClick={() => setGameState('COLLECTION')}
              className="mt-12 w-full max-w-3xl bg-theme-card p-6 md:p-8 rounded-3xl shadow-sm border border-theme-border text-left hover:border-theme-accent transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg md:text-xl font-bold text-theme-text flex items-center gap-2">
                  <LayoutGrid className="text-theme-accent group-hover:rotate-12 transition-transform" size={20} />
                  Card collection status
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-bold text-theme-text-muted bg-theme-border px-3 py-1 rounded-full">
                    {Object.values(rarityOwned).reduce((a, b) => (a as number) + (b as number), 0)} / {Object.values(rarityTotals).reduce((a, b) => (a as number) + (b as number), 0)}
                  </span>
                  <ChevronRight size={16} className="text-theme-text-muted group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {(['UR', 'SR', 'R', 'C'] as const).map(r => {
                  const styles = getRarityStyles(r);
                  const total = rarityTotals[r];
                  const owned = rarityOwned[r];
                  const totalCopies = rarityTotalCopies[r];
                  const ownedCopies = rarityOwnedCopies[r];
                  const percentage = total > 0 ? Math.round((owned / total) * 100) : 0;
                  const copiesPercentage = totalCopies > 0 ? Math.round((ownedCopies / totalCopies) * 100) : 0;
                  return (
                    <div key={r} className="flex flex-col p-3 md:p-4 rounded-2xl bg-theme-muted border border-theme-border relative overflow-hidden">
                      <div className={`absolute -right-4 -bottom-4 opacity-5 ${styles.textColor}`}>
                        <Trophy size={64} />
                      </div>
                      <div className="flex justify-between items-end mb-3 relative z-10">
                        <span className={`text-lg md:text-xl font-black tracking-wider ${styles.textColor} drop-shadow-sm`}>{r}</span>
                      </div>
                      <div className="space-y-3 relative z-10">
                        {hasAnyDuplicate ? (
                          <>
                            <div>
                              <div className="flex justify-between text-[10px] md:text-xs mb-1">
                                <span className="text-theme-text-muted font-bold">種類</span>
                                <span><span className="font-bold text-theme-text">{owned}</span> <span className="text-theme-text-muted">/ {total}</span></span>
                              </div>
                              <div className="w-full bg-theme-border-strong rounded-full h-1.5 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                  className={`h-full rounded-full ${styles.bg}`} 
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] md:text-xs mb-1">
                                <span className="text-theme-text-muted font-bold">枚数(最大3)</span>
                                <span><span className="font-bold text-theme-text">{ownedCopies}</span> <span className="text-theme-text-muted">/ {totalCopies}</span></span>
                              </div>
                              <div className="w-full bg-theme-border-strong rounded-full h-1.5 overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${copiesPercentage}%` }}
                                  transition={{ duration: 1, delay: 0.3 }}
                                  className={`h-full rounded-full ${styles.bg} opacity-70`} 
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div>
                            <div className="flex justify-between text-[10px] md:text-xs mb-1">
                              <span className="text-theme-text-muted font-bold">種類</span>
                              <span><span className="font-bold text-theme-text">{owned}</span> <span className="text-theme-text-muted">/ {total}</span></span>
                            </div>
                            <div className="w-full bg-theme-border-strong rounded-full h-2 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`h-full rounded-full ${styles.bg}`} 
                              />
                            </div>
                            <p className="text-[10px] text-right mt-1.5 text-theme-text-muted font-bold">{percentage}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </button>

            {/* Desktop Stats Button */}
            <div className="hidden md:block w-full max-w-3xl mt-6">
              <button 
                onClick={() => setGameState('STATS')}
                className="w-full group relative p-6 bg-theme-card border-2 border-theme-accent/20 rounded-[2rem] text-xl font-bold overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-theme-accent/10 rounded-2xl text-theme-accent group-hover:scale-110 transition-transform">
                    <BarChart size={32} />
                  </div>
                  <div className="text-left">
                    <span className="block text-2xl font-bold text-theme-accent">学習成績を確認</span>
                    <span className="block text-sm text-theme-text-muted font-medium mt-1">詳細なスコアや進捗をチェック</span>
                  </div>
                </div>
                <ChevronRight size={32} className="text-theme-accent group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-theme-accent/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </button>
            </div>

            {/* Statistics Section */}
            <div className="mt-20 w-full max-w-4xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-theme-heading font-bold flex items-center gap-3">
                  <BarChart className="text-theme-accent" /> 学習状況
                </h2>
              </div>

              <div className="space-y-6 mb-12">
                {/* Comprehensive Stats */}
                <div className="bg-theme-card p-8 rounded-[2.5rem] shadow-sm border border-theme-border relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Trophy size={120} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-center md:justify-between gap-8 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                      <p className="text-xs font-bold text-theme-text-muted uppercase tracking-widest mb-2">総合演習（全単元）</p>
                      <h3 className="text-3xl font-theme-heading font-bold">現在の成績</h3>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-end gap-8 md:gap-16">
                      <div className="space-y-1 text-center md:text-left">
                        <p className="text-sm text-theme-text-muted flex items-center justify-center md:justify-start gap-2">
                          <Trophy size={14} className="text-amber-500" /> ハイスコア
                        </p>
                        <p className="text-3xl font-mono font-bold tracking-tight">{getStatsFor('all').highScore.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1 text-center md:text-left">
                        <p className="text-sm text-theme-text-muted flex items-center justify-center md:justify-start gap-2">
                          <RotateCcw size={14} className="text-theme-accent" /> 演習回数
                        </p>
                        <p className="text-3xl font-mono font-bold tracking-tight">{getStatsFor('all').attempts}<span className="text-sm ml-1 font-sans">回</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Category Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {quizCategories.map(cat => (
                    <div key={cat.id} className="bg-theme-card p-6 rounded-3xl shadow-sm border border-theme-border relative overflow-hidden group">
                      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform ${getCategoryColor(cat.id).text}`}>
                        <Database size={48} />
                      </div>
                      <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${getCategoryColor(cat.id).text}`}>{cat.title}</p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-sm text-theme-text-muted">ハイスコア</span>
                          <span className="text-xl font-mono font-bold">{getStatsFor(cat.id).highScore.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-sm text-theme-text-muted">演習回数</span>
                          <span className="text-xl font-mono font-bold">{getStatsFor(cat.id).attempts}回</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'STATS' && (
          <motion.div 
            key="stats"
            ref={statsRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto p-6 py-12 relative"
          >
            {/* Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center overflow-hidden rounded-[3rem]">
              <span className="text-6xl md:text-9xl font-bold text-theme-text select-none whitespace-nowrap rotate-[-20deg]">CONFIDENTIAL</span>
            </div>

            <div className="flex flex-nowrap items-center justify-between gap-2 md:gap-4 mb-12">
              <div className="flex items-center gap-2 md:gap-6 min-w-0">
                <h2 className="text-2xl sm:text-4xl md:text-6xl font-theme-heading font-bold truncate">学習成績</h2>
              </div>
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <button 
                  onClick={() => setGameState('TERM_PERFORMANCE')}
                  className="text-[10px] md:text-sm font-bold text-theme-accent hover:text-white hover:bg-theme-accent transition-all duration-300 flex items-center gap-1 bg-theme-accent/10 px-2 py-1 md:px-4 md:py-2 rounded-full border border-theme-accent/20"
                >
                  <BarChart size={14} className="md:w-4 md:h-4" /> 詳細データ
                </button>
                <button 
                  onClick={takeScreenshot}
                  className="text-[10px] md:text-sm font-bold text-theme-accent hover:text-white hover:bg-theme-accent transition-all duration-300 flex items-center gap-2 bg-theme-accent/10 px-3 py-1.5 md:px-6 md:py-3 rounded-full border border-theme-accent/20 hover:shadow-lg"
                >
                  <Camera size={14} className="md:w-4 md:h-4" /> 提出
                </button>
              </div>
            </div>

            {/* User Profile Summary */}
            <div className="bg-theme-accent/5 border border-theme-accent/20 rounded-3xl p-6 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-theme-accent text-white rounded-2xl flex items-center justify-center shadow-lg shadow-theme-accent/20">
                  <UserCheck size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-theme-accent bg-theme-accent/10 px-2 py-0.5 rounded-full uppercase tracking-wider">User Profile</span>
                    <span className="text-lg md:text-xl font-bold text-theme-accent bg-theme-accent/10 px-3 py-0.5 rounded-full shadow-sm">Lv.{userLevel}</span>
                  </div>
                  <h3 className="text-2xl font-bold">{userName}</h3>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-4 md:gap-12">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">学年</p>
                  <p className="text-xl font-bold">{userProfile?.grade}年</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">クラス</p>
                  <p className="text-xl font-bold">{userProfile?.classNum}組</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">出席番号</p>
                  <p className="text-xl font-bold">{userProfile?.attendanceNum}番</p>
                </div>
              </div>
            </div>

                <div className="space-y-16">
                  {/* Comprehensive Summary */}
                  <section className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-theme-accent">
                      <Trophy size={24} /> 総合演習
                    </h3>
                    <div className="bg-theme-card p-8 rounded-[2rem] shadow-sm border border-theme-border grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-1">
                        <p className="text-sm text-theme-text-muted font-bold uppercase tracking-wider">ハイスコア</p>
                        <p className="text-3xl font-mono font-bold">{getStatsFor('all').highScore.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-theme-text-muted font-bold uppercase tracking-wider">演習回数</p>
                        <p className="text-3xl font-mono font-bold">{getStatsFor('all').attempts}回</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-theme-text-muted font-bold uppercase tracking-wider">平均スコア</p>
                        <p className="text-3xl font-mono font-bold">
                          {getStatsFor('all').attempts > 0 
                            ? Math.floor(getStatsFor('all').totalScore / getStatsFor('all').attempts).toLocaleString() 
                            : 0}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Speed Star Stats */}
                  <section className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-amber-500">
                  <Zap size={24} /> SPEED STAR
                </h3>
                <div className="bg-black p-8 rounded-[2rem] shadow-xl border border-amber-400/30 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Zap size={120} className="text-amber-400" />
                  </div>
                  <div className="space-y-1 relative z-10">
                    <p className="text-sm text-amber-400/60 font-bold uppercase tracking-wider">最高正答数</p>
                    <p className="text-3xl font-mono font-bold text-amber-400">{speedStarMaxCorrect}回</p>
                  </div>
                  <div className="space-y-1 relative z-10">
                    <p className="text-sm text-amber-400/60 font-bold uppercase tracking-wider">最大コンボ</p>
                    <p className="text-3xl font-mono font-bold text-amber-400">{speedStarMaxCombo} COMBO</p>
                  </div>
                  <div className="space-y-1 relative z-10">
                    <p className="text-sm text-amber-400/60 font-bold uppercase tracking-wider">挑戦回数</p>
                    <p className="text-3xl font-mono font-bold text-amber-400">{speedStarChallenges}回</p>
                  </div>
                </div>
              </section>

              {/* Category Breakdown */}
              {quizCategories.map(category => (
                <section key={category.id} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-theme-border-strong pb-2 gap-2">
                    <h3 className="text-xl font-bold text-theme-accent">
                      {category.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                      <span className="text-theme-text-muted">単元ハイスコア: <span className="text-black font-mono font-bold">{getStatsFor(category.id).highScore.toLocaleString()}</span></span>
                      <span className="text-theme-text-muted">演習回数: <span className="text-black font-mono font-bold">{getStatsFor(category.id).attempts}回</span></span>
                      <span className="text-theme-text-muted">平均スコア: <span className="text-black font-mono font-bold">
                        {getStatsFor(category.id).attempts > 0 
                          ? Math.floor(getStatsFor(category.id).totalScore / getStatsFor(category.id).attempts).toLocaleString() 
                          : 0}
                      </span></span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.subcategories.map(sub => {
                      const s = getStatsFor(sub.id);
                      return (
                        <div key={sub.id} className="bg-theme-card p-6 rounded-2xl border border-theme-border shadow-sm flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-bold">{sub.title}</p>
                            <p className="text-xs text-theme-text-muted">演習回数: {s.attempts}回</p>
                          </div>
                          <div className="flex gap-8">
                            <div className="text-right">
                              <p className="text-[10px] text-theme-text-muted font-bold uppercase tracking-tighter">Avg Score</p>
                              <p className="text-lg font-mono font-bold text-theme-text-muted">
                                {s.attempts > 0 ? Math.floor(s.totalScore / s.attempts).toLocaleString() : 0}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-theme-text-muted font-bold uppercase tracking-tighter">High Score</p>
                              <p className="text-xl font-mono font-bold">{s.highScore.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}

              {/* Weak Points Section */}
              {weakPoints.length > 0 && (
                <section className="space-y-6 mt-12">
                  <div className="flex items-center justify-between border-b border-theme-border-strong pb-2">
                    <h3 className="text-xl font-bold text-red-500 flex items-center gap-2 uppercase tracking-tighter">
                      <AlertCircle size={24} /> weak point 3
                    </h3>
                    <button 
                      onClick={() => setGameState('TERM_PERFORMANCE')}
                      className="text-sm font-bold text-theme-accent hover:underline flex items-center gap-1"
                    >
                      詳細データ <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {weakPoints.slice(0, 3).map((wp, idx) => (
                      <div key={wp.name} className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                          <span className="text-4xl font-black text-red-900">#{idx + 1}</span>
                        </div>
                        <p className="font-bold text-red-900 mb-1 truncate pr-8">{wp.name}</p>
                        <div className="flex items-end gap-2">
                          <p className="text-2xl font-mono font-bold text-red-600">{wp.rate.toFixed(1)}%</p>
                          <p className="text-[10px] text-red-400 font-bold mb-1 uppercase tracking-tighter">Correct Rate</p>
                        </div>
                        <p className="text-xs text-red-400 mt-2">正解: {wp.correct} / 出題: {wp.total}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        )}

        {gameState === 'TERM_PERFORMANCE' && (
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
                  onClick={() => setTermSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
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
                    onClick={() => setTermSortOrder(null)}
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
              <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
                {quizCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCollectionTab(cat.id);
                      setActiveSubcollectionTab(null);
                    }}
                    className={`px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-base font-bold transition-all ${
                      activeCollectionTab === cat.id 
                        ? `${getCategoryColor(cat.id).accent} text-white shadow-lg scale-105` 
                        : 'bg-theme-border text-theme-text-muted hover:bg-theme-border-strong'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>

              {/* Subcategory Tabs */}
              {quizCategories.find(c => c.id === activeCollectionTab)?.subcategories.length! > 0 && (
                <div className="flex flex-wrap gap-1.5 md:gap-2 pt-4 md:pt-6 border-t border-theme-border">
                  {quizCategories.find(c => c.id === activeCollectionTab)?.subcategories.map(sub => (
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
              {quizCategories.filter(c => c.id === activeCollectionTab).map(category => {
                const categoryTerms = category.subcategories
                  .filter(sub => !activeSubcollectionTab || sub.id === activeSubcollectionTab)
                  .flatMap(sub => sub.terms.map(t => ({ ...t, subId: sub.id })));
                
                const displayTerms = categoryTerms.map(term => {
                  const stat = termStats[term.name] || { correct: 0, total: 0 };
                  const rate = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
                  const ownedCount = ownedCards[term.name] || 0;
                  return { term, stat, rate, ownedCount };
                });

                if (termSortOrder) {
                  displayTerms.sort((a, b) => termSortOrder === 'asc' ? a.rate - b.rate : b.rate - a.rate);
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
                            {displayTerms.map(({ term, stat, rate, ownedCount }) => {
                              const descriptions = allTermsMap[term.name]?.descriptions || ["説明がありません。"];
                              const currentIndex = termPerformanceDescIndexes[term.name] || 0;
                              
                              return (
                                <tr 
                                  key={term.name} 
                                  className={`transition-colors ${ownedCount > 1 ? 'hover:bg-theme-muted/50 cursor-pointer' : 'hover:bg-theme-muted/30'}`}
                                  onClick={() => {
                                    if (ownedCount > 1) {
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
                                        <span className="font-bold text-sm md:text-base">{term.name}</span>
                                      </div>
                                      <div className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase w-fit ${
                                        ownedCount > 0 ? 'bg-theme-accent/10 text-theme-accent' : 'bg-theme-muted text-theme-text-muted'
                                      }`}>
                                        {ownedCount > 0 ? `x${ownedCount}` : '未所持'}
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
              })}
            </div>
          </motion.div>
        )}

        {gameState === 'STORY' && (
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
              {["プロローグ", "第一章：企業活動と情報処理", "第二章：コンピュータシステムと情報通信ネットワーク", "第三章：情報セキュリティの確保と法規", "第四章：情報の集計と分析", "最終章：統合判断", "アフターエピソード：それから"].map(chapter => {
                const chapterCards = storyCards.filter(c => c.chapter === chapter);
                const unlockedInChapter = chapterCards.filter(c => c.id < userLevel);
                
                if (unlockedInChapter.length === 0) return null;

                return (
                  <div key={chapter} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-bold text-theme-accent">{chapter}</h3>
                      <div className="flex-1 h-px bg-theme-border" />
                      <span className="text-xs font-bold text-theme-text-muted uppercase tracking-widest">
                        {unlockedInChapter.length} / {chapterCards.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {chapterCards.map(card => {
                        const isUnlocked = card.id < userLevel;
                        return (
                          <motion.button
                            key={card.id}
                            whileHover={isUnlocked ? { scale: 1.02, y: -4 } : {}}
                            whileTap={isUnlocked ? { scale: 0.98 } : {}}
                            onClick={() => isUnlocked && setShowStoryCard(card)}
                            className={`relative p-6 rounded-3xl border-2 text-left transition-all ${
                              isUnlocked 
                                ? 'bg-theme-card border-theme-border hover:border-amber-500/50 shadow-sm' 
                                : 'bg-theme-muted border-transparent opacity-40 grayscale cursor-not-allowed'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                                isUnlocked ? 'bg-amber-500 text-black' : 'bg-theme-border text-theme-text-muted'
                              }`}>
                                #{card.id}
                              </span>
                              {isUnlocked ? (
                                <BookOpen size={18} className="text-amber-500" />
                              ) : (
                                <Lock size={18} className="text-theme-text-muted" />
                              )}
                            </div>
                            <h4 className={`font-bold mb-2 ${isUnlocked ? 'text-theme-text' : 'text-theme-text-muted'}`}>
                              {isUnlocked ? card.title : 'Locked Episode'}
                            </h4>
                            <p className="text-xs text-theme-text-muted line-clamp-2">
                              {isUnlocked ? card.content : 'レベルを上げてストーリーを解放しましょう。'}
                            </p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              
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
        )}

        {gameState === 'COLLECTION' && (
          <motion.div 
            key="collection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto p-6 py-12"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-4xl font-theme-heading font-bold mb-2">IT Card Collection</h2>
                <p className="text-theme-text-muted">知識をカードとして集めよう。{allTerms.length}枚のカードを収録。</p>
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

            {/* Search & Tabs */}
            <div className="bg-theme-card p-6 rounded-[2rem] shadow-sm border border-theme-border mb-12">
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-muted" size={20} />
                <input 
                  type="text" 
                  placeholder="カードの名前で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-theme-bg rounded-2xl border-none focus:ring-2 focus:ring-theme-accent transition-all text-lg"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
                {quizCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCollectionTab(cat.id)}
                    className={`px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-bold transition-all ${
                      activeCollectionTab === cat.id 
                        ? `${getCategoryColor(cat.id).accent} text-white shadow-lg scale-105` 
                        : 'bg-theme-border text-theme-text-muted hover:bg-theme-border-strong'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>

              {/* Subcategory Tabs */}
              {quizCategories.find(c => c.id === activeCollectionTab)?.subcategories.length! > 0 && (
                <div className="flex flex-wrap gap-1.5 md:gap-2 pt-4 md:pt-6 border-t border-theme-border">
                  {quizCategories.find(c => c.id === activeCollectionTab)?.subcategories.map(sub => (
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

            {/* Grouped Collection */}
            <div className="space-y-20">
              {quizCategories.filter(c => c.id === activeCollectionTab).map(category => {
                const categoryTerms = filteredTerms.filter(t => t.category === category.title);
                const colors = getCategoryColor(category.id);
                
                if (categoryTerms.length === 0 && !searchTerm) return null;

                return (
                  <div key={category.id} className="space-y-8">
                    {collectionMode === 'card' ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                        {categoryTerms.map(({ term }, index) => {
                          const rarity = allTermsMap[term]?.rarity || 'C';
                          const styles = getRarityStyles(rarity);
                          const isOwned = !!ownedCards[term];
                          const count = ownedCards[term] || 0;
                          
                          return (
                            <div key={term} className="relative h-full" style={{ isolation: 'isolate' }}>
                              {/* Stacked copies effect */}
                              {isOwned && count > 1 && (
                                <div className={`absolute inset-0 rounded-2xl border-2 ${styles.border} bg-theme-card translate-x-1.5 -translate-y-1.5 rotate-2 -z-10 opacity-60`} />
                              )}
                              {isOwned && count > 2 && (
                                <div className={`absolute inset-0 rounded-2xl border-2 ${styles.border} bg-theme-card translate-x-3 -translate-y-3 rotate-6 -z-20 opacity-30`} />
                              )}
                              
                              <motion.div 
                                ref={el => { cardRefs.current[term] = el; }}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={isOwned ? { scale: 1.05 } : {}}
                                onClick={() => handleCardClick(term)}
                                className={`relative h-full flex flex-col rounded-2xl overflow-hidden ${isOwned ? 'cursor-pointer' : 'cursor-not-allowed grayscale opacity-50'} group ${isOwned ? styles.border : 'border-2 border-dashed border-theme-border-strong'} ${isOwned ? styles.glow : ''} bg-theme-card`}
                              >
                                {/* Card Backgrounds */}
                                <div className={`absolute inset-0 ${isOwned ? styles.bg : 'bg-theme-border'} opacity-10 group-hover:opacity-20 transition-opacity`} />
                              
                              {/* Pulse Effect (Behind Content) */}
                              {isOwned && styles.pulse && (
                                <div className={`absolute inset-0 ${styles.bg} opacity-15 ${styles.pulse} z-0`} />
                              )}

                              <div className="flex-1 flex flex-col bg-transparent relative z-10" style={{ perspective: 1000 }}>
                                {/* Card Header */}
                                <div className={`px-2 py-1.5 md:px-3 md:py-2 flex justify-between items-center shrink-0 ${isOwned && rarity !== 'C' ? styles.bg : 'bg-theme-muted'} ${isOwned && rarity !== 'C' ? 'text-white' : 'text-theme-text-muted'}`}>
                                  <span className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase drop-shadow-sm">{isOwned ? styles.label : 'LOCKED'}</span>
                                  {isOwned && count > 1 && (
                                    <span className="text-[8px] md:text-[10px] font-bold bg-theme-card/20 px-1.5 py-0.5 rounded-full">x{count}</span>
                                  )}
                                </div>

                                {/* Card Content */}
                                <div className="flex-1 p-3 md:p-4 flex flex-col items-center justify-start text-center space-y-2 md:space-y-3">
                                  <div className={`hidden md:flex w-12 h-12 shrink-0 rounded-xl items-center justify-center ${isOwned ? styles.bg : 'bg-theme-border'} ${isOwned ? (rarity === 'C' ? 'text-theme-text' : 'text-white') : 'text-theme-text-muted'} shadow-inner`}>
                                    {isOwned ? getTermIcon(term, 20) : <Lock size={20} />}
                                  </div>
                                  
                                  <div className="space-y-0.5 w-full shrink-0">
                                    <h3 className={`text-sm md:text-base font-bold leading-tight ${isOwned ? 'text-theme-text' : 'text-theme-text-muted'} break-words drop-shadow-sm`}>{isOwned ? term : '???'}</h3>
                                  </div>

                                  {isOwned && (
                                      <motion.div 
                                        key={pickedCard?.term === term ? pickedCard.descriptionIndex : 0}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="pt-2 md:pt-3 border-t border-theme-border w-full flex-1 flex flex-col justify-between"
                                      >
                                      <p className="text-[10px] md:text-xs text-theme-text leading-relaxed text-left mb-1 drop-shadow-sm font-bold">
                                        {(allTermsMap[term]?.descriptions || ["説明がありません。"])[pickedCard?.term === term ? pickedCard.descriptionIndex : 0]}
                                      </p>
                                      {allTermsMap[term]?.flavorTexts && (
                                        <p className="text-[8px] md:text-[10px] text-theme-text-muted leading-relaxed text-left mb-2 italic">
                                          {(() => {
                                            const flavor = allTermsMap[term]?.flavorTexts;
                                            const idx = pickedCard?.term === term ? pickedCard.descriptionIndex : 0;
                                            if (Array.isArray(flavor)) {
                                              return flavor[idx % flavor.length];
                                            }
                                            return flavor;
                                          })()}
                                        </p>
                                      )}
                                      <div className="flex justify-center gap-1 mt-auto pb-1">
                                        {[...Array(Math.min(allTermsMap[term]?.descriptions?.length || 1, 3))].map((_, i) => (
                                          <div 
                                            key={i} 
                                            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                                              (pickedCard?.term === term ? i === pickedCard.descriptionIndex : i === 0)
                                                ? (isOwned ? styles.bg : 'bg-theme-text-muted') 
                                                : (i < count ? 'bg-theme-border-strong' : 'bg-theme-border')
                                            }`} 
                                          />
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-theme-card rounded-2xl border border-theme-border overflow-x-auto">
                        <table className="w-full text-left text-sm md:text-base min-w-[600px]">
                          <thead className="bg-theme-muted text-theme-text-muted">
                            <tr>
                              <th className="p-4 font-bold w-24 md:w-48">Term</th>
                              <th className="p-4 font-bold">Description</th>
                              <th className="p-4 font-bold">Flavor Text</th>
                              <th className="p-4 font-bold w-16 text-center">Rarity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-theme-border">
                            {categoryTerms.map(({ term }, index) => {
                              const rarity = allTermsMap[term]?.rarity || 'C';
                              const styles = getRarityStyles(rarity);
                              const isOwned = !!ownedCards[term];
                              const count = ownedCards[term] || 0;
                              const currentIndex = wordModeIndexes[term] || 0;
                              
                              const handleRowClick = () => {
                                const maxDescriptions = Math.min(allTermsMap[term]?.descriptions?.length || 1, 3);
                                if (isOwned && count > 1 && maxDescriptions > 1) {
                                  setWordModeIndexes(prev => ({
                                    ...prev,
                                    [term]: (currentIndex + 1) % Math.min(count, maxDescriptions)
                                  }));
                                }
                              };

                              // Helper to wrap term every 6 characters for mobile
                              const formatTerm = (t: string) => {
                                if (!t) return '';
                                const chunks = [];
                                for (let i = 0; i < t.length; i += 6) {
                                  chunks.push(t.substring(i, i + 6));
                                }
                                return chunks.join('\n');
                              };

                              return (
                                <tr 
                                  key={term} 
                                  onClick={handleRowClick}
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
                                        <span>{(allTermsMap[term]?.descriptions || ["説明がありません。"])[currentIndex]}</span>
                                        {Math.min(count, allTermsMap[term]?.descriptions?.length || 1, 3) > 1 && (
                                          <div className="flex gap-1 mt-1">
                                            {[...Array(Math.min(count, allTermsMap[term]?.descriptions?.length || 1, 3))].map((_, i) => (
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
                                        const flavor = allTermsMap[term]?.flavorTexts;
                                        if (Array.isArray(flavor)) {
                                          return flavor[currentIndex % flavor.length];
                                        }
                                        return flavor;
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
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredTerms.length === 0 && (
              <div className="text-center py-24">
                <p className="text-theme-text-muted text-xl font-theme-heading">該当するカードが見つかりませんでした。</p>
              </div>
            )}
          </motion.div>
        )}

        {gameState === 'CATEGORY_SELECT' && (
          <motion.div 
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto p-6 py-12"
          >
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-theme-heading font-bold">単元を選択</h2>
            </div>

            {/* Speed Star Mode Button */}
            {hasBonusTicket && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startSpeedStar}
                disabled={isLoading}
                className="w-full mb-6 p-6 md:p-8 bg-black text-amber-400 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 group overflow-hidden relative border-2 border-amber-400"
              >
                <div className="relative z-10 flex items-center gap-4 md:gap-6">
                  <div className="p-3 md:p-4 bg-amber-400/10 rounded-2xl backdrop-blur-md">
                    <Zap size={28} className="text-amber-400 md:w-8 md:h-8 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl md:text-2xl font-bold">SPEED STAR</h3>
                      <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded-full font-black uppercase">Bonus Game</span>
                    </div>
                    <p className="text-sm md:text-base text-amber-400/60">全単元からランダムに出題。スピード勝負！</p>
                    <div className="flex gap-4 mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-400/40">
                      <span>Best Correct: {speedStarMaxCorrect}</span>
                      <span>Max Combo: {speedStarMaxCombo}</span>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 flex items-center gap-2 font-bold text-base md:text-lg self-end md:self-auto">
                  挑戦する <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                </div>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.05, 0.1, 0.05]
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl"
                />
              </motion.button>
            )}

            {/* Comprehensive Mode Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startComprehensiveQuiz}
              disabled={isLoading}
              className="w-full mb-8 md:mb-12 p-6 md:p-8 bg-gradient-to-r from-[#141414] to-[#5A5A40] text-white rounded-[2rem] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 group overflow-hidden relative"
            >
              <div className="relative z-10 flex items-center gap-4 md:gap-6">
                <div className="p-3 md:p-4 bg-theme-card/10 rounded-2xl backdrop-blur-md">
                  <Trophy size={28} className="text-theme-secondary md:w-8 md:h-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-1">総合演習</h3>
                  <p className="text-sm md:text-base text-white/60">全単元からランダムに20問出題されます</p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-2 font-bold text-base md:text-lg self-end md:self-auto">
                挑戦する <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </div>
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -right-10 -bottom-10 w-64 h-64 bg-theme-card rounded-full blur-3xl"
              />
            </motion.button>

            <div className="space-y-12">
              {quizCategories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-theme-border-strong pb-3 md:pb-2 gap-3 md:gap-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                      <h3 className="text-lg md:text-xl font-bold text-theme-accent">
                        {category.title}
                      </h3>
                      <div className="flex gap-3 text-[10px] font-bold text-theme-text-muted uppercase tracking-wider">
                        <span>Best: {getStatsFor(category.id).highScore.toLocaleString()}</span>
                        <span>Cleared: {getStatsFor(category.id).attempts}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => startQuiz(category)}
                      className="text-xs md:text-sm font-bold bg-theme-accent text-white px-4 py-2 md:py-1 rounded-full hover:bg-black transition-colors self-start md:self-auto"
                    >
                      単元演習を開始
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => startQuiz(sub)}
                        disabled={isLoading}
                        className="flex items-center justify-between p-4 md:p-6 bg-theme-card rounded-2xl border border-theme-border shadow-sm hover:shadow-md hover:border-theme-accent transition-all text-left group"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="p-2 md:p-3 bg-theme-bg rounded-xl group-hover:bg-theme-accent group-hover:text-white transition-colors">
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-sm md:text-base">{sub.title}</p>
                            <div className="flex gap-3 text-[9px] md:text-[10px] font-bold text-theme-text-muted uppercase tracking-wider mt-1">
                              <span>Best: {getStatsFor(sub.id).highScore.toLocaleString()}</span>
                              <span>Cleared: {getStatsFor(sub.id).attempts}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-theme-text-muted group-hover:text-theme-accent transition-colors flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'SPEED_STAR' && questions.length > 0 && (
          <motion.div 
            key="speed-star"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black text-white flex flex-col"
          >
            <SpeedLines />
            
            {/* Fixed Timer Bar ONLY */}
            <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md p-2 border-b border-white/10">
              <div className="max-w-3xl mx-auto w-full h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${timeLeft < 5 ? 'bg-red-500' : 'bg-amber-400'}`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${Math.min(100, (timeLeft / 30) * 100)}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-4 md:p-6 relative z-10">
              <div className="max-w-3xl mx-auto w-full py-2 md:py-8">
                {/* Header Info (Now scrolls with content) */}
                <div className="flex items-center justify-between mb-6 gap-2 overflow-x-hidden">
                  <div className="flex items-center gap-1.5 md:gap-4 min-w-0">
                    <div className="bg-white/10 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 font-bold flex items-center gap-1.5 md:gap-3 shrink-0">
                      <Zap size={14} className="text-amber-400 md:w-5 md:h-5" />
                      <span className="text-amber-400 text-[9px] sm:text-[10px] md:text-sm whitespace-nowrap">SPEED STAR</span>
                    </div>
                    <div className="bg-white/5 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 text-[9px] sm:text-[10px] md:text-sm font-bold whitespace-nowrap shrink-0">
                      Correct: {speedStarCorrectCount}
                    </div>
                    {combo > 1 && (
                      <motion.div 
                        initial={{ scale: 0, x: -20 }}
                        animate={{ scale: 1, x: 0 }}
                        className="bg-amber-500 text-black px-2.5 py-1 md:px-4 md:py-1 rounded-full text-[9px] sm:text-[10px] md:text-sm font-black shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center gap-1 shrink-0"
                      >
                        <Zap size={10} fill="currentColor" className="md:w-3.5 md:h-3.5" /> {combo}
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 font-mono font-bold shrink-0">
                    <Timer size={16} className={`${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-amber-400'} md:w-7 md:h-7`} />
                    <span className={`text-base sm:text-lg md:text-3xl ${timeLeft < 5 ? 'text-red-500' : 'text-amber-400'} whitespace-nowrap`}>{Math.ceil(timeLeft)}s</span>
                  </div>
                </div>

                {/* Question */}
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 p-8 md:p-12 rounded-[2rem] border border-white/10 mb-8 relative overflow-hidden backdrop-blur-sm"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-amber-400" />
                  <h3 className="text-xl md:text-3xl font-theme-heading leading-relaxed mb-0">
                    {questions[currentQuestionIndex].description}
                  </h3>
                </motion.div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-4">
                  {questions[currentQuestionIndex].options.map((option, idx) => {
                    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
                    const isSelected = option === userAnswer;
                    
                    let buttonClass = 'bg-white/5 border-white/10 hover:border-amber-400 hover:bg-white/10';
                    if (feedback === 'CORRECT' && isCorrect) {
                      buttonClass = 'bg-green-500/20 border-green-500 text-green-400';
                    } else if (feedback === 'WRONG' && isSelected) {
                      buttonClass = 'bg-red-500/20 border-red-500 text-red-400';
                    }

                    return (
                      <motion.button
                        key={`${currentQuestionIndex}-${idx}`}
                        whileHover={!feedback ? { scale: 1.02, x: 10 } : {}}
                        whileTap={!feedback ? { scale: 0.98 } : {}}
                        onClick={() => !feedback && handleAnswer(option)}
                        disabled={!!feedback}
                        className={`
                          relative p-5 rounded-2xl text-left transition-all border-2 text-lg font-bold
                          ${buttonClass}
                        `}
                      >
                        <span className="mr-4 text-white/40">{idx + 1}.</span>
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'QUIZ' && questions.length > 0 && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex flex-col transition-colors duration-1000 overflow-y-auto ${
              isDailyChallenge ? 'bg-indigo-950 text-white' : 'bg-theme-bg'
            }`}
          >
            {isDailyChallenge && (
              <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2),transparent_70%)]" />
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-600/10 blur-[120px] rounded-full"
                />
              </div>
            )}
            
            <div className="max-w-3xl mx-auto w-full p-6 py-12 flex flex-col flex-grow relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={quitQuiz}
                  className={`p-2 rounded-full transition-colors ${
                    isDailyChallenge ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-theme-card text-theme-text-muted hover:text-black'
                  }`}
                  title="クイズを中断して戻る"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className={`px-4 py-2 rounded-full shadow-sm border font-bold flex items-center gap-3 ${
                  isDailyChallenge ? 'bg-white/10 border-white/20' : 'bg-theme-card border-theme-border'
                }`}>
                  {isDailyChallenge ? (
                    <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles size={12} /> DAILY
                    </span>
                  ) : (
                    <span className="text-xs text-theme-accent bg-theme-accent/10 px-2 py-0.5 rounded-full">Lv.{userLevel}</span>
                  )}
                  <span>Q {currentQuestionIndex + 1} / {questions.length}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xl font-mono font-bold">
                <Timer size={24} className={timeLeft < 3 ? 'text-red-500 animate-pulse' : (isDailyChallenge ? 'text-indigo-300' : '')} />
                <span className={timeLeft < 3 ? 'text-red-500' : ''}>{Math.ceil(timeLeft)}s</span>
              </div>
            </div>

            {/* Visual Timer Bar */}
            <div className={`w-full h-2 rounded-full mb-4 overflow-hidden ${isDailyChallenge ? 'bg-white/10' : 'bg-theme-border-strong'}`}>
              <motion.div 
                className={`h-full ${timeLeft < 5 ? 'bg-red-500' : (isDailyChallenge ? 'bg-indigo-400' : 'bg-theme-secondary')}`}
                initial={{ width: '100%' }}
                animate={{ width: `${(timeLeft / 45) * 100}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>

            {/* Progress Bar */}
            <div className={`w-full h-1 rounded-full mb-12 overflow-hidden ${isDailyChallenge ? 'bg-white/5' : 'bg-theme-border'}`}>
              <motion.div 
                className={`h-full ${isDailyChallenge ? 'bg-amber-400' : 'bg-theme-accent'}`}
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="flex-grow relative z-10">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-6 md:p-12 rounded-[2rem] shadow-xl border mb-6 md:mb-8 relative overflow-hidden ${
                  isDailyChallenge ? 'bg-white/5 border-white/10' : 'bg-theme-card border-theme-border'
                }`}
              >
                <div className={`absolute top-0 left-0 w-2 h-full ${isDailyChallenge ? 'bg-amber-400' : 'bg-theme-accent'}`} />
                <h3 className="text-xl md:text-3xl font-theme-heading leading-relaxed mb-0">
                  {questions[currentQuestionIndex].description}
                </h3>
              </motion.div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {questions[currentQuestionIndex].options.map((option, idx) => {
                  const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
                  const isSelected = option === userAnswer;
                  
                  let buttonClass = isDailyChallenge 
                    ? 'bg-white/5 border-white/10 hover:border-amber-400 hover:bg-white/10 text-white' 
                    : 'bg-theme-card border-theme-border hover:border-theme-accent hover:bg-theme-bg';
                  
                  if (feedback === 'CORRECT' && isCorrect) {
                    buttonClass = 'bg-green-500/20 border-green-500 text-green-400';
                  } else if (feedback === 'WRONG') {
                    if (isCorrect) {
                      buttonClass = 'bg-green-500/20 border-green-500 text-green-400';
                    } else if (isSelected) {
                      buttonClass = 'bg-red-500/20 border-red-500 text-red-400 ring-2 ring-red-500/20';
                    } else {
                      buttonClass = isDailyChallenge ? 'bg-white/5 border-white/10 opacity-30' : 'bg-theme-card border-theme-border opacity-50';
                    }
                  }

                  if (penaltyActive && !feedback) {
                    buttonClass = 'bg-theme-muted border-theme-border-strong text-theme-text-muted cursor-not-allowed opacity-50';
                  }

                  const isLongOption = option.length > 40;

                  return (
                    <motion.button
                      key={`${currentQuestionIndex}-${idx}`}
                      whileHover={!feedback && !penaltyActive ? { scale: 1.02 } : {}}
                      whileTap={!feedback && !penaltyActive ? { scale: 0.98 } : {}}
                      onClick={() => !feedback && !penaltyActive && handleAnswer(option)}
                      disabled={!!feedback || penaltyActive}
                      className={`
                        relative p-4 md:p-5 rounded-2xl text-left transition-all border-2
                        ${isLongOption ? 'text-sm md:text-base font-medium' : 'text-base md:text-lg font-bold'}
                        ${buttonClass}
                      `}
                    >
                      <span className="mr-4 text-theme-text-muted">{idx + 1}.</span>
                      {option}
                      {feedback === 'CORRECT' && isCorrect && (
                        <CheckCircle2 className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500" />
                      )}
                      {feedback === 'WRONG' && isSelected && (
                        <XCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-red-500" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Score Display */}
            <div className="mt-8 flex flex-col items-center gap-2 relative z-10">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className={`text-[10px] uppercase tracking-widest font-bold ${isDailyChallenge ? 'text-white/40' : 'text-theme-text-muted'}`}>Current Score</p>
                  <p className="text-4xl font-mono font-bold">{score.toLocaleString()}</p>
                </div>
                {combo > 1 && (
                  <motion.div 
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    className={`${isDailyChallenge ? 'bg-amber-500 text-black' : 'bg-theme-secondary text-white'} px-4 py-2 rounded-2xl shadow-lg flex flex-col items-center justify-center min-w-[100px]`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">Combo</span>
                    <div className="flex items-center gap-1">
                      <Zap size={16} fill="currentColor" />
                      <span className="text-2xl font-mono font-bold">{combo}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            </div>
          </motion.div>
        )}

        {gameState === 'RESULT' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-2xl mx-auto p-4 md:p-6 py-8 md:py-12 text-center"
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
                              {quizCategories.find(c => c.subcategories.some(s => s.terms.some(t => t.name === currentGachaCard.term)))?.title || 'Unknown Category'}
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
