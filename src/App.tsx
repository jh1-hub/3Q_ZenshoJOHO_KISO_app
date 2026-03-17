import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Timer, 
  ChevronRight, 
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
  MousePointerClick
} from 'lucide-react';
import { quizCategories, Category, Subcategory } from './data/quizData';
import { generateQuestion, Question } from './services/geminiService';
import { termDescriptions } from './data/termDescriptions';
import { flavorTexts } from './data/flavorTexts';
import { termRarities, Rarity } from './data/rarities';

type GameState = 'START' | 'CATEGORY_SELECT' | 'QUIZ' | 'RESULT' | 'COLLECTION';
type Theme = 'CLASSIC' | 'CYBER';

interface UnitStats {
  highScore: number;
  attempts: number;
  totalScore: number;
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

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<GameStats>({});
  const [resetStep, setResetStep] = useState(0);
  const [theme, setTheme] = useState<Theme>('CLASSIC');
  const [showResetEffect, setShowResetEffect] = useState(false);

  // Load stats and theme from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('it_quiz_stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Failed to parse stats", e);
      }
    }

    const savedTheme = localStorage.getItem('it_quiz_theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('it_quiz_theme', theme);
  }, [theme]);

  // Save stats to localStorage
  const saveStats = (newStats: GameStats) => {
    setStats(newStats);
    localStorage.setItem('it_quiz_stats', JSON.stringify(newStats));
  };

  const updateStats = (id: string, newScore: number) => {
    const currentStats = { ...stats };
    const unitStats = currentStats[id] || { highScore: 0, attempts: 0, totalScore: 0 };
    
    currentStats[id] = {
      highScore: Math.max(unitStats.highScore, newScore),
      attempts: unitStats.attempts + 1,
      totalScore: unitStats.totalScore + newScore
    };
    
    saveStats(currentStats);
  };

  const resetAllStats = () => {
    setShowResetEffect(true);
    setTimeout(() => {
      saveStats({});
      setResetStep(0);
      setTimeout(() => setShowResetEffect(false), 1000);
    }, 500);
  };

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
          if (!map[term]) {
            map[term] = count.toString().padStart(3, '0');
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

  // Reset subcategory tab when main category tab changes
  useEffect(() => {
    const category = quizCategories.find(c => c.id === activeCollectionTab);
    if (category && category.subcategories.length > 0) {
      setActiveSubcollectionTab(category.subcategories[0].id);
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
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100', accent: 'bg-gray-500', light: 'bg-gray-100/50' };
    }
  };

  const handleCardClick = (term: string) => {
    if (pickedCard?.term === term) {
      // If already picked, cycle description
      const descriptions = termDescriptions[term] || ["説明がありません。"];
      setPickedCard({
        term,
        descriptionIndex: (pickedCard.descriptionIndex + 1) % descriptions.length
      });
    } else {
      setPickedCard({ term, descriptionIndex: 0 });
    }
  };

  const getRarityStyles = (rarity: Rarity) => {
    const isCyber = theme === 'CYBER';
    switch (rarity) {
      case 'UR':
        return {
          border: isCyber ? 'border-2 border-[#00FF00] shadow-[0_0_20px_#00FF00]' : 'border-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]',
          bg: isCyber ? 'bg-black' : 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
          text: isCyber ? 'text-[#00FF00]' : 'text-white',
          label: 'Ultra Rare',
          accent: isCyber ? 'bg-[#00FF0022]' : 'bg-white/20',
          glow: isCyber ? 'animate-pulse shadow-[0_0_30px_#00FF00]' : 'animate-pulse shadow-[0_0_30px_rgba(236,72,153,0.8)]'
        };
      case 'SR':
        return {
          border: isCyber ? 'border-2 border-[#00FF00] shadow-[0_0_15px_#00FF00]' : 'border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]',
          bg: isCyber ? 'bg-black' : 'bg-gradient-to-br from-yellow-400 to-orange-500',
          text: isCyber ? 'text-[#00FF00]' : 'text-white',
          label: 'Super Rare',
          accent: isCyber ? 'bg-[#00FF0022]' : 'bg-white/20',
          glow: isCyber ? 'shadow-[0_0_20px_#00FF00]' : 'shadow-[0_0_20px_rgba(250,204,21,0.6)]'
        };
      case 'R':
        return {
          border: isCyber ? 'border-2 border-[#00FF00] shadow-[0_0_10px_#00FF00]' : 'border-4 border-blue-400',
          bg: isCyber ? 'bg-black' : 'bg-gradient-to-br from-blue-500 to-indigo-600',
          text: isCyber ? 'text-[#00FF00]' : 'text-white',
          label: 'Rare',
          accent: isCyber ? 'bg-[#00FF0022]' : 'bg-white/20',
          glow: isCyber ? 'shadow-[0_0_10px_#00FF00]' : 'shadow-[0_0_10px_rgba(59,130,246,0.4)]'
        };
      default:
        return {
          border: isCyber ? 'border-2 border-[#00FF0033]' : 'border-4 border-slate-200',
          bg: isCyber ? 'bg-black' : 'bg-white',
          text: isCyber ? 'text-[#00FF00]' : 'text-slate-800',
          label: 'Common',
          accent: isCyber ? 'bg-[#00FF0011]' : 'bg-slate-100',
          glow: ''
        };
    }
  };

  // Start the quiz for a subcategory or category
  const startQuiz = async (item: Subcategory | Category) => {
    setIsLoading(true);
    
    let termsToPickFrom: string[] = [];
    let title = "";
    
    if ('subcategories' in item) {
      // It's a Category
      termsToPickFrom = item.subcategories.flatMap(sub => sub.terms);
      title = `${item.title}（単元演習）`;
      setSelectedSubcategory({ id: item.id, title, terms: termsToPickFrom });
    } else {
      // It's a Subcategory
      termsToPickFrom = item.terms;
      title = item.title;
      setSelectedSubcategory(item);
    }
    
    // Select 10 random terms
    const selectedTerms = [...termsToPickFrom]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);

    try {
      const generatedQuestions = await Promise.all(
        selectedTerms.map(term => generateQuestion(term, termsToPickFrom))
      );
      setQuestions(generatedQuestions);
      resetQuizState();
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
    const allTerms = allSubcategories.flatMap(sub => sub.terms);
    
    // Pick 20 random questions
    const selectedQuestionsData = [];
    for (let i = 0; i < 20; i++) {
      const randomSub = allSubcategories[Math.floor(Math.random() * allSubcategories.length)];
      const randomTerm = randomSub.terms[Math.floor(Math.random() * randomSub.terms.length)];
      selectedQuestionsData.push({ term: randomTerm, subTerms: randomSub.terms });
    }

    try {
      const generatedQuestions = await Promise.all(
        selectedQuestionsData.map(data => generateQuestion(data.term, allTerms))
      );
      setQuestions(generatedQuestions);
      resetQuizState();
      setGameState('QUIZ');
    } catch (error) {
      console.error("Failed to start comprehensive quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuizState = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(15);
    setUserAnswer(null);
    setFeedback(null);
  };

  const quitQuiz = () => {
    resetQuizState();
    setGameState('CATEGORY_SELECT');
  };

  // Timer logic
  useEffect(() => {
    let timer: number;
    if (gameState === 'QUIZ' && timeLeft > 0 && !feedback) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 0.1));
      }, 100);
    } else if (timeLeft === 0 && gameState === 'QUIZ' && !feedback) {
      handleAnswer(''); // Time out
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, feedback]);

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    setUserAnswer(answer);
    
    if (isCorrect) {
      // Score based on time: Base 100 + (remaining time * 10)
      const timeBonus = Math.floor(timeLeft * 10);
      const comboBonus = combo * 20;
      setScore(prev => prev + 100 + timeBonus + comboBonus);
      setCombo(prev => prev + 1);
      setMaxCombo(prev => Math.max(prev, combo + 1));
      setFeedback('CORRECT');
    } else {
      setCombo(0);
      setFeedback('WRONG');
    }

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(15);
      } else {
        // Update stats on completion
        if (selectedSubcategory) {
          updateStats(selectedSubcategory.id, score);
        }
        setGameState('RESULT');
      }
    }, 2000);
  };

  // Filtered terms for collection
  const filteredTerms = useMemo(() => {
    let terms: { term: string; category: string; subcategoryId: string }[] = [];
    quizCategories.forEach(cat => {
      if (activeCollectionTab === cat.id) {
        cat.subcategories.forEach(sub => {
          if (!activeSubcollectionTab || activeSubcollectionTab === sub.id) {
            sub.terms.forEach(term => {
              terms.push({ term, category: cat.title, subcategoryId: sub.id });
            });
          }
        });
      }
    });

    if (searchTerm) {
      // If searching, ignore category/subcategory tabs and search everywhere
      let allTerms: { term: string; category: string; subcategoryId: string }[] = [];
      quizCategories.forEach(cat => {
        cat.subcategories.forEach(sub => {
          sub.terms.forEach(term => {
            if (term.includes(searchTerm)) {
              allTerms.push({ term, category: cat.title, subcategoryId: sub.id });
            }
          });
        });
      });
      return allTerms;
    }

    return terms;
  }, [searchTerm, activeCollectionTab, activeSubcollectionTab]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'CLASSIC' 
        ? 'bg-[#F5F5F0] text-[#141414] font-sans selection:bg-[#5A5A40] selection:text-white' 
        : 'bg-[#050505] text-[#00FF00] font-mono selection:bg-[#00FF00] selection:text-black'
    }`}>
      <AnimatePresence mode="wait">
        {gameState === 'START' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center relative overflow-hidden"
          >
            {/* Cyber Background Elements */}
            {theme === 'CYBER' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00FF0011_1px,transparent_1px),linear-gradient(to_bottom,#00FF0011_1px,transparent_1px)] bg-[size:40px_40px]" />
                <motion.div 
                  animate={{ y: ['0%', '100%'] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-[#00FF0022] to-transparent"
                />
              </div>
            )}

            <div className="mb-8 relative">
              <motion.div
                animate={theme === 'CLASSIC' ? { rotate: [0, 10, -10, 0] } : { scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className={`${theme === 'CLASSIC' ? 'bg-[#5A5A40]' : 'bg-[#00FF00] shadow-[0_0_30px_#00FF00]'} p-6 rounded-3xl shadow-xl`}
              >
                <BrainCircuit size={80} className={theme === 'CLASSIC' ? 'text-white' : 'text-black'} />
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className={`absolute -top-4 -right-4 ${theme === 'CLASSIC' ? 'bg-[#FF6321]' : 'bg-white text-black'} p-3 rounded-full shadow-lg`}
              >
                <Zap size={24} />
              </motion.div>
            </div>
            
            <h1 className={`text-5xl md:text-7xl font-serif font-bold mb-4 tracking-tight ${theme === 'CYBER' ? 'font-mono uppercase italic' : ''}`}>
              IT Quiz <span className={`italic ${theme === 'CLASSIC' ? 'text-[#5A5A40]' : 'text-[#00FF00] brightness-150'}`}>Master</span>
            </h1>
            <p className={`text-xl mb-12 max-w-md ${theme === 'CLASSIC' ? 'text-gray-600' : 'text-[#00FF00] opacity-70'}`}>
              全商情報処理検定【情報基礎】演習アプリ
            </p>

            {/* Theme Toggle */}
            <div className="mb-12 flex items-center gap-4 bg-black/5 p-2 rounded-full backdrop-blur-sm border border-white/10">
              <button 
                onClick={() => setTheme('CLASSIC')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${theme === 'CLASSIC' ? 'bg-white text-black shadow-md' : 'text-gray-400'}`}
              >
                Classic
              </button>
              <button 
                onClick={() => setTheme('CYBER')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${theme === 'CYBER' ? 'bg-[#00FF00] text-black shadow-[0_0_15px_#00FF00]' : 'text-gray-400'}`}
              >
                Cyber
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setGameState('CATEGORY_SELECT')}
                className={`group relative px-12 py-5 rounded-full text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl ${
                  theme === 'CLASSIC' ? 'bg-[#141414] text-white' : 'bg-[#00FF00] text-black shadow-[0_0_20px_#00FF00]'
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  学習を始める <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                {theme === 'CLASSIC' && <div className="absolute inset-0 bg-[#5A5A40] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
              </button>

              <button 
                onClick={() => setGameState('COLLECTION')}
                className={`group relative px-12 py-5 border-2 rounded-full text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg ${
                  theme === 'CLASSIC' ? 'bg-white text-[#141414] border-gray-200' : 'bg-transparent text-[#00FF00] border-[#00FF00]'
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  カードコレクション <LayoutGrid size={24} />
                </span>
              </button>
            </div>

            {/* Statistics Section */}
            <div className="mt-20 w-full max-w-5xl">
              <div className="flex items-center justify-between mb-10">
                <h2 className={`text-3xl font-serif font-bold flex items-center gap-3 ${theme === 'CYBER' ? 'font-mono uppercase' : ''}`}>
                  <BarChart className={theme === 'CLASSIC' ? 'text-[#5A5A40]' : 'text-[#00FF00]'} /> 学習状況
                </h2>
                <button 
                  onClick={() => setResetStep(1)}
                  className={`text-xs font-bold transition-colors flex items-center gap-1 ${theme === 'CLASSIC' ? 'text-red-400 hover:text-red-600' : 'text-red-500 hover:text-red-400'}`}
                >
                  <RotateCcw size={14} /> データをリセット
                </button>
              </div>

              {/* Comprehensive Stats Section */}
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`h-px flex-1 ${theme === 'CLASSIC' ? 'bg-gray-200' : 'bg-[#00FF0022]'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-[0.4em] ${theme === 'CLASSIC' ? 'text-gray-400' : 'text-[#00FF00] opacity-50'}`}>Comprehensive Stats</span>
                  <div className={`h-px flex-1 ${theme === 'CLASSIC' ? 'bg-gray-200' : 'bg-[#00FF0022]'}`} />
                </div>
                
                <div className={`p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group border ${
                  theme === 'CLASSIC' ? 'bg-white border-gray-100' : 'bg-black border-[#00FF0044] shadow-[0_0_30px_rgba(0,255,0,0.1)]'
                }`}>
                  <div className={`absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform ${theme === 'CLASSIC' ? 'text-[#5A5A40]' : 'text-[#00FF00]'}`}>
                    <Trophy size={160} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`p-3 rounded-2xl ${theme === 'CLASSIC' ? 'bg-[#F5F5F0] text-[#5A5A40]' : 'bg-[#00FF0022] text-[#00FF00]'}`}>
                        <Award size={24} />
                      </div>
                      <h3 className="text-2xl font-bold">総合演習の記録</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                      <div className="space-y-1">
                        <p className={`text-xs font-bold uppercase tracking-widest ${theme === 'CLASSIC' ? 'text-gray-400' : 'text-[#00FF00] opacity-40'}`}>ハイスコア</p>
                        <p className="text-5xl font-mono font-bold tracking-tighter">{getStatsFor('all').highScore.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className={`text-xs font-bold uppercase tracking-widest ${theme === 'CLASSIC' ? 'text-gray-400' : 'text-[#00FF00] opacity-40'}`}>演習回数</p>
                        <p className="text-5xl font-mono font-bold tracking-tighter">{getStatsFor('all').attempts}<span className="text-lg ml-1 opacity-50">回</span></p>
                      </div>
                      <div className="space-y-1">
                        <p className={`text-xs font-bold uppercase tracking-widest ${theme === 'CLASSIC' ? 'text-gray-400' : 'text-[#00FF00] opacity-40'}`}>平均スコア</p>
                        <p className="text-5xl font-mono font-bold tracking-tighter">
                          {getStatsFor('all').attempts > 0 
                            ? Math.floor(getStatsFor('all').totalScore / getStatsFor('all').attempts).toLocaleString() 
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unit Stats Section */}
              <div className="space-y-16">
                <div className="flex items-center gap-4">
                  <div className={`h-px flex-1 ${theme === 'CLASSIC' ? 'bg-gray-200' : 'bg-[#00FF0022]'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-[0.4em] ${theme === 'CLASSIC' ? 'text-gray-400' : 'text-[#00FF00] opacity-50'}`}>Unit Learning Stats</span>
                  <div className={`h-px flex-1 ${theme === 'CLASSIC' ? 'bg-gray-200' : 'bg-[#00FF0022]'}`} />
                </div>

                {quizCategories.map(category => (
                  <div key={category.id} className="space-y-8">
                    <div className={`p-8 rounded-[2.5rem] border ${
                      theme === 'CLASSIC' ? 'bg-white border-gray-100' : 'bg-black/40 border-[#00FF0022]'
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4">
                          <div className={`p-4 rounded-2xl ${getCategoryColor(category.id).bg} ${getCategoryColor(category.id).text}`}>
                            <Database size={28} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{category.title}</h3>
                            <p className="text-sm text-gray-500">単元ごとの習得状況</p>
                          </div>
                        </div>
                        <div className="flex gap-8">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">最高</p>
                            <p className="text-2xl font-mono font-bold">{getStatsFor(category.id).highScore.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">回数</p>
                            <p className="text-2xl font-mono font-bold">{getStatsFor(category.id).attempts}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {category.subcategories.map(sub => {
                          const s = getStatsFor(sub.id);
                          return (
                            <div key={sub.id} className={`p-5 rounded-2xl border transition-all hover:shadow-md ${
                              theme === 'CLASSIC' ? 'bg-[#F5F5F0]/50 border-gray-100' : 'bg-black/60 border-[#00FF0011]'
                            }`}>
                              <p className="text-xs font-bold mb-4 truncate opacity-80">{sub.title}</p>
                              <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-gray-400">BEST</span>
                                  <span className="font-bold">{s.highScore.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-gray-400">ATTEMPTS</span>
                                  <span className="font-bold">{s.attempts}</span>
                                </div>
                                <div className={`w-full h-1 rounded-full mt-2 overflow-hidden ${theme === 'CLASSIC' ? 'bg-gray-100' : 'bg-white/5'}`}>
                                  <div 
                                    className={`h-full ${getCategoryColor(category.id).accent}`} 
                                    style={{ width: `${Math.min(100, (s.highScore / 2000) * 100)}%` }} 
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                <h2 className={`text-4xl font-serif font-bold mb-2 ${theme === 'CYBER' ? 'font-mono uppercase italic' : ''}`}>IT Card Collection</h2>
                <p className={theme === 'CLASSIC' ? 'text-gray-500' : 'text-[#00FF00] opacity-60'}>知識をカードとして集めよう。{Object.keys(termDescriptions).length}枚のカードを収録。</p>
              </div>
              <button 
                onClick={() => setGameState('START')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-sm border transition-all font-bold ${
                  theme === 'CLASSIC' ? 'bg-white text-[#141414] border-gray-200 hover:bg-gray-50' : 'bg-transparent text-[#00FF00] border-[#00FF00] hover:bg-[#00FF0011]'
                }`}
              >
                <ArrowLeft size={20} /> トップに戻る
              </button>
            </div>

            {/* Search & Tabs */}
            <div className={`p-6 rounded-[2rem] shadow-sm border mb-12 ${
              theme === 'CLASSIC' ? 'bg-white border-gray-100' : 'bg-black border-[#00FF0033]'
            }`}>
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="カードの名前で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-none focus:ring-2 transition-all text-lg ${
                    theme === 'CLASSIC' ? 'bg-[#F5F5F0] focus:ring-[#5A5A40]' : 'bg-[#00FF0011] text-[#00FF00] focus:ring-[#00FF00]'
                  }`}
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {quizCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCollectionTab(cat.id)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      activeCollectionTab === cat.id 
                        ? `${getCategoryColor(cat.id).accent} text-white shadow-lg scale-105` 
                        : theme === 'CLASSIC' ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-white/5 text-[#00FF00] opacity-50 hover:opacity-100'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>

              {/* Subcategory Tabs */}
              {quizCategories.find(c => c.id === activeCollectionTab)?.subcategories.length! > 0 && (
                <div className={`flex flex-wrap gap-2 pt-6 border-t ${theme === 'CLASSIC' ? 'border-gray-100' : 'border-[#00FF0011]'}`}>
                  {quizCategories.find(c => c.id === activeCollectionTab)?.subcategories.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubcollectionTab(sub.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeSubcollectionTab === sub.id 
                          ? `${getCategoryColor(activeCollectionTab).accent} text-white shadow-md` 
                          : theme === 'CLASSIC' ? 'bg-gray-50 text-gray-400 hover:bg-gray-100' : 'bg-white/5 text-[#00FF00] opacity-40 hover:opacity-80'
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {categoryTerms.map(({ term }, index) => {
                        const rarity = termRarities[term] || 'C';
                        const styles = getRarityStyles(rarity);
                        
                        return (
                          <motion.div 
                            key={term}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, rotateY: 2 }}
                            onClick={() => handleCardClick(term)}
                            className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group ${styles.border} ${styles.glow} transition-all duration-300`}
                          >
                            {/* Card Background */}
                            <div className={`absolute inset-0 ${styles.bg} opacity-10 group-hover:opacity-20 transition-opacity`} />
                            
                            <div className={`h-full flex flex-col ${theme === 'CLASSIC' ? 'bg-white' : 'bg-black'}`}>
                              {/* Card Header */}
                              <div className={`px-4 py-3 flex justify-between items-center ${rarity !== 'C' ? styles.bg : theme === 'CLASSIC' ? 'bg-slate-50' : 'bg-white/5'} ${rarity !== 'C' ? 'text-white' : theme === 'CLASSIC' ? 'text-slate-600' : 'text-[#00FF00]'}`}>
                                <span className="text-[10px] font-bold tracking-widest uppercase">{styles.label}</span>
                              </div>

                              {/* Card Content */}
                              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
                                <div className={`p-3 rounded-xl ${rarity !== 'C' ? 'bg-white/20' : theme === 'CLASSIC' ? 'bg-slate-100' : 'bg-[#00FF0011]'} transition-transform group-hover:scale-110 duration-300`}>
                                  {getTermIcon(term, 48)}
                                </div>
                                <h3 className={`text-xl font-bold leading-tight ${theme === 'CLASSIC' ? (styles.text === 'text-white' ? 'text-slate-800' : styles.text) : 'text-[#00FF00]'}`}>
                                  {term}
                                </h3>
                                <p className={`text-xs line-clamp-3 ${theme === 'CLASSIC' ? 'text-slate-500' : 'text-[#00FF00] opacity-60'}`}>
                                  {(termDescriptions[term] || ["説明がありません。"])[0]}
                                </p>
                              </div>

                              {/* Card Footer / Rarity indicator */}
                              <div className={`px-6 py-3 border-t flex justify-between items-center ${theme === 'CLASSIC' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-[#00FF0011]'}`}>
                                <span className={`text-[10px] font-mono ${theme === 'CLASSIC' ? 'text-slate-400' : 'text-[#00FF00] opacity-40'}`}>ID: {termToId[term] || "000"}</span>
                                <div className="flex gap-1">
                                  {['C', 'R', 'SR', 'UR'].map(r => (
                                    <div 
                                      key={r} 
                                      className={`w-2 h-2 rounded-full ${rarity === r ? styles.bg : theme === 'CLASSIC' ? 'bg-slate-200' : 'bg-white/10'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Holo Effect for Rare+ */}
                            {rarity !== 'C' && (
                              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 skew-x-12 translate-x-full group-hover:-translate-x-full" />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTerms.length === 0 && (
              <div className="text-center py-24">
                <p className="text-gray-400 text-xl font-serif">該当するカードが見つかりませんでした。</p>
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
              <h2 className={`text-3xl font-serif font-bold ${theme === 'CYBER' ? 'font-mono uppercase italic' : ''}`}>単元を選択</h2>
              <button 
                onClick={() => setGameState('START')}
                className={`transition-colors font-bold ${theme === 'CLASSIC' ? 'text-gray-500 hover:text-black' : 'text-[#00FF00] opacity-60 hover:opacity-100'}`}
              >
                戻る
              </button>
            </div>

            {/* Comprehensive Mode Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startComprehensiveQuiz}
              disabled={isLoading}
              className={`w-full mb-12 p-8 rounded-[2rem] shadow-xl flex items-center justify-between group overflow-hidden relative ${
                theme === 'CLASSIC' ? 'bg-gradient-to-r from-[#141414] to-[#5A5A40] text-white' : 'bg-black border-2 border-[#00FF00] text-[#00FF00] shadow-[0_0_20px_rgba(0,255,0,0.2)]'
              }`}
            >
              <div className="relative z-10 flex items-center gap-6">
                <div className={`p-4 rounded-2xl backdrop-blur-md ${theme === 'CLASSIC' ? 'bg-white/10' : 'bg-[#00FF0022]'}`}>
                  <Trophy size={32} className={theme === 'CLASSIC' ? 'text-[#FF6321]' : 'text-[#00FF00]'} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-1">総合演習</h3>
                  <p className={theme === 'CLASSIC' ? 'text-white/60' : 'text-[#00FF00] opacity-60'}>全単元からランダムに20問出題されます</p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-2 font-bold text-lg">
                挑戦する <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </div>
              {theme === 'CLASSIC' && (
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -right-10 -bottom-10 w-64 h-64 bg-white rounded-full blur-3xl"
                />
              )}
            </motion.button>

            <div className="space-y-12">
              {quizCategories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <div className={`flex items-center justify-between border-b pb-2 ${theme === 'CLASSIC' ? 'border-gray-200' : 'border-[#00FF0033]'}`}>
                    <h3 className={`text-xl font-bold ${theme === 'CLASSIC' ? 'text-[#5A5A40]' : 'text-[#00FF00]'}`}>
                      {category.title}
                    </h3>
                    <button
                      onClick={() => startQuiz(category)}
                      className={`text-sm font-bold px-4 py-1 rounded-full transition-colors ${
                        theme === 'CLASSIC' ? 'bg-[#5A5A40] text-white hover:bg-black' : 'bg-[#00FF00] text-black hover:bg-white'
                      }`}
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
                        className={`flex items-center justify-between p-6 rounded-2xl border shadow-sm transition-all text-left group ${
                          theme === 'CLASSIC' ? 'bg-white border-gray-100 hover:shadow-md hover:border-[#5A5A40]' : 'bg-black border-[#00FF0022] hover:border-[#00FF00] hover:shadow-[0_0_15px_rgba(0,255,0,0.1)]'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl transition-colors ${
                            theme === 'CLASSIC' ? 'bg-[#F5F5F0] group-hover:bg-[#5A5A40] group-hover:text-white' : 'bg-[#00FF0011] text-[#00FF00] group-hover:bg-[#00FF00] group-hover:text-black'
                          }`}>
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <p className={`font-bold ${theme === 'CYBER' ? 'text-[#00FF00]' : ''}`}>{sub.title}</p>
                            <p className={`text-xs mt-1 ${theme === 'CLASSIC' ? 'text-gray-400' : 'text-[#00FF00] opacity-40'}`}>{sub.terms.length} 用語収録</p>
                          </div>
                        </div>
                        <ChevronRight size={20} className={`transition-colors ${theme === 'CLASSIC' ? 'text-gray-300 group-hover:text-[#5A5A40]' : 'text-[#00FF00] opacity-20 group-hover:opacity-100'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'QUIZ' && questions.length > 0 && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto p-6 py-12 min-h-screen flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={quitQuiz}
                  className={`p-2 rounded-full transition-colors ${theme === 'CLASSIC' ? 'hover:bg-white text-gray-400 hover:text-black' : 'hover:bg-white/10 text-[#00FF00] opacity-60 hover:opacity-100'}`}
                  title="クイズを中断して戻る"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className={`px-4 py-2 rounded-full shadow-sm border font-bold ${theme === 'CLASSIC' ? 'bg-white border-gray-100' : 'bg-black border-[#00FF0033] text-[#00FF00]'}`}>
                  Q {currentQuestionIndex + 1} / {questions.length}
                </div>
                {combo > 1 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    className={`px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 ${theme === 'CLASSIC' ? 'bg-[#FF6321] text-white' : 'bg-[#00FF00] text-black shadow-[0_0_15px_#00FF00]'}`}
                  >
                    <Zap size={14} /> {combo} COMBO
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xl font-mono font-bold">
                <Timer size={24} className={timeLeft < 3 ? 'text-red-500 animate-pulse' : theme === 'CLASSIC' ? 'text-[#141414]' : 'text-[#00FF00]'} />
                <span className={timeLeft < 3 ? 'text-red-500' : ''}>{Math.ceil(timeLeft)}s</span>
              </div>
            </div>

            {/* Visual Timer Bar */}
            <div className={`w-full h-2 rounded-full mb-4 overflow-hidden ${theme === 'CLASSIC' ? 'bg-gray-200' : 'bg-white/5'}`}>
              <motion.div 
                className={`h-full ${timeLeft < 5 ? 'bg-red-500' : theme === 'CLASSIC' ? 'bg-[#FF6321]' : 'bg-[#00FF00]'}`}
                initial={{ width: '100%' }}
                animate={{ width: `${(timeLeft / 15) * 100}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>

            {/* Progress Bar */}
            <div className={`w-full h-1 rounded-full mb-12 overflow-hidden ${theme === 'CLASSIC' ? 'bg-gray-100' : 'bg-white/5'}`}>
              <motion.div 
                className={`h-full ${theme === 'CLASSIC' ? 'bg-[#5A5A40]' : 'bg-[#00FF00]'}`}
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="flex-grow">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-8 md:p-12 rounded-[2rem] shadow-xl border mb-8 relative overflow-hidden ${
                  theme === 'CLASSIC' ? 'bg-white border-gray-100' : 'bg-black border-[#00FF0033]'
                }`}
              >
                <div className={`absolute top-0 left-0 w-2 h-full ${theme === 'CLASSIC' ? 'bg-[#5A5A40]' : 'bg-[#00FF00]'}`} />
                <h3 className={`text-2xl md:text-3xl font-serif leading-relaxed mb-0 ${theme === 'CYBER' ? 'font-mono' : ''}`}>
                  {questions[currentQuestionIndex].description}
                </h3>
              </motion.div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-4">
                {questions[currentQuestionIndex].options.map((option, idx) => {
                  const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
                  const isSelected = option === userAnswer;
                  
                  let buttonClass = theme === 'CLASSIC' 
                    ? 'bg-white border-gray-100 hover:border-[#5A5A40] hover:bg-[#F5F5F0]'
                    : 'bg-black border-[#00FF0033] text-[#00FF00] hover:border-[#00FF00] hover:bg-[#00FF0011]';

                  if (feedback === 'CORRECT' && isCorrect) {
                    buttonClass = theme === 'CLASSIC' 
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-green-900/20 border-green-500 text-green-400';
                  } else if (feedback === 'WRONG') {
                    if (isCorrect) {
                      buttonClass = theme === 'CLASSIC' 
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-green-900/20 border-green-500 text-green-400';
                    } else if (isSelected) {
                      buttonClass = theme === 'CLASSIC' 
                        ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-200'
                        : 'bg-red-900/20 border-red-500 text-red-400 ring-2 ring-red-500/50';
                    } else {
                      buttonClass = theme === 'CLASSIC' 
                        ? 'bg-white border-gray-100 opacity-50'
                        : 'bg-black border-[#00FF0011] text-[#00FF00] opacity-30';
                    }
                  }

                  return (
                    <motion.button
                      key={`${currentQuestionIndex}-${idx}`}
                      whileHover={!feedback ? { scale: 1.02 } : {}}
                      whileTap={!feedback ? { scale: 0.98 } : {}}
                      onClick={() => !feedback && handleAnswer(option)}
                      disabled={!!feedback}
                      className={`
                        relative p-5 rounded-2xl text-left text-lg font-bold transition-all border-2
                        ${buttonClass}
                      `}
                    >
                      <span className={`mr-4 ${theme === 'CLASSIC' ? 'text-gray-300' : 'text-[#00FF00] opacity-30'}`}>{idx + 1}.</span>
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
            <div className="mt-8 text-center">
              <p className={`text-sm uppercase tracking-widest font-bold ${theme === 'CLASSIC' ? 'text-gray-400' : 'text-[#00FF00] opacity-40'}`}>Current Score</p>
              <p className="text-4xl font-mono font-bold">{score.toLocaleString()}</p>
            </div>
          </motion.div>
        )}

        {gameState === 'RESULT' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto p-6 py-12 text-center"
          >
            <div className={`p-12 rounded-[3rem] shadow-2xl border mb-8 ${
              theme === 'CLASSIC' ? 'bg-white border-gray-100' : 'bg-black border-[#00FF0033]'
            }`}>
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className={`inline-block p-6 rounded-full mb-6 ${theme === 'CLASSIC' ? 'bg-[#F5F5F0]' : 'bg-[#00FF0022]'}`}
              >
                <Trophy size={64} className={theme === 'CLASSIC' ? 'text-[#FF6321]' : 'text-[#00FF00]'} />
              </motion.div>
              
              <h2 className={`text-4xl font-serif font-bold mb-2 ${theme === 'CYBER' ? 'font-mono uppercase italic' : ''}`}>Quiz Complete!</h2>
              <p className={`mb-8 ${theme === 'CLASSIC' ? 'text-gray-500' : 'text-[#00FF00] opacity-60'}`}>{selectedSubcategory?.title}</p>
              
              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className={`p-6 rounded-3xl ${theme === 'CLASSIC' ? 'bg-[#F5F5F0]' : 'bg-white/5'}`}>
                  <p className={`text-xs uppercase font-bold mb-1 ${theme === 'CLASSIC' ? 'text-gray-400' : 'text-[#00FF00] opacity-40'}`}>Total Score</p>
                  <p className="text-3xl font-mono font-bold">{score.toLocaleString()}</p>
                </div>
                <div className={`p-6 rounded-3xl ${theme === 'CLASSIC' ? 'bg-[#F5F5F0]' : 'bg-white/5'}`}>
                  <p className={`text-xs uppercase font-bold mb-1 ${theme === 'CLASSIC' ? 'text-gray-400' : 'text-[#00FF00] opacity-40'}`}>Max Combo</p>
                  <p className="text-3xl font-mono font-bold">{maxCombo}</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setGameState('CATEGORY_SELECT')}
                  className={`w-full py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 transition-all ${
                    theme === 'CLASSIC' ? 'bg-[#141414] text-white hover:bg-black' : 'bg-[#00FF00] text-black hover:bg-white shadow-[0_0_20px_rgba(0,255,0,0.3)]'
                  }`}
                >
                  <LayoutGrid size={24} /> 他の単元を選ぶ
                </button>
                <button 
                  onClick={() => startQuiz(selectedSubcategory!)}
                  className={`w-full py-5 border-2 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 transition-all ${
                    theme === 'CLASSIC' ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-transparent border-[#00FF00] text-[#00FF00] hover:bg-[#00FF0011]'
                  }`}
                >
                  <RotateCcw size={24} /> もう一度挑戦
                </button>
              </div>
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
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-md ${
              theme === 'CLASSIC' ? 'bg-white/80' : 'bg-black/90'
            }`}
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 2, ease: "linear" },
                scale: { repeat: Infinity, duration: 1 }
              }}
              className={`p-4 rounded-full mb-6 ${theme === 'CLASSIC' ? 'bg-[#F5F5F0]' : 'bg-[#00FF0011]'}`}
            >
              <Zap size={48} className={theme === 'CLASSIC' ? 'text-[#FF6321]' : 'text-[#00FF00]'} />
            </motion.div>
            <p className={`text-xl font-bold tracking-widest ${theme === 'CLASSIC' ? 'text-[#141414]' : 'text-[#00FF00] font-mono'}`}>
              {theme === 'CYBER' ? '> INITIALIZING_SYSTEM...' : '読み込み中...'}
            </p>
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
              <div className={`p-12 rounded-full backdrop-blur-md ${
                theme === 'CLASSIC' ? 'bg-green-500 text-white shadow-2xl' : 'bg-green-500/10 border-2 border-green-500 shadow-[0_0_50px_rgba(0,255,0,0.3)]'
              }`}>
                <CheckCircle2 size={120} className={theme === 'CYBER' ? 'text-green-500' : ''} />
              </div>
            ) : (
              <div className={`p-12 rounded-full backdrop-blur-md ${
                theme === 'CLASSIC' ? 'bg-red-500 text-white shadow-2xl' : 'bg-red-500/10 border-2 border-red-500 shadow-[0_0_50px_rgba(255,0,0,0.3)]'
              }`}>
                <XCircle size={120} className={theme === 'CYBER' ? 'text-red-500' : ''} />
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
            {/* Backdrop with Rarity Effect */}
            <div 
              className={`absolute inset-0 backdrop-blur-xl ${
                termRarities[pickedCard.term] === 'UR' ? 'bg-purple-900/40' :
                termRarities[pickedCard.term] === 'SR' ? 'bg-yellow-900/30' :
                termRarities[pickedCard.term] === 'R' ? 'bg-blue-900/30' :
                'bg-slate-900/60'
              }`}
              onClick={() => setPickedCard(null)}
            />

            {/* Floating Particles or Glow for High Rarity */}
            {['SR', 'UR'].includes(termRarities[pickedCard.term] || 'C') && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
                      termRarities[pickedCard.term!] === 'UR' ? 'bg-pink-400' : 'bg-yellow-300'
                    } blur-sm`}
                  />
                ))}
              </div>
            )}

            <motion.div
              layoutId={`card-${pickedCard.term}`}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={() => handleCardClick(pickedCard.term)}
              className={`relative w-full max-w-md aspect-[3/4] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl ${getRarityStyles(termRarities[pickedCard.term] || 'C').border}`}
            >
              {/* Card Content in Modal */}
              <div className={`h-full flex flex-col ${theme === 'CLASSIC' ? 'bg-white' : 'bg-black'}`}>
                {/* Header */}
                <div className={`px-8 py-6 flex justify-between items-center ${getRarityStyles(termRarities[pickedCard.term] || 'C').bg} ${getRarityStyles(termRarities[pickedCard.term] || 'C').text}`}>
                  <div className="space-y-1">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">
                      {getRarityStyles(termRarities[pickedCard.term] || 'C').label}
                    </span>
                    <h2 className={`text-3xl font-black tracking-tight ${theme === 'CYBER' ? 'font-mono uppercase italic' : ''}`}>{pickedCard.term}</h2>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-10 flex flex-col items-center justify-center space-y-8">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`p-8 rounded-[2rem] shadow-2xl border ${getRarityStyles(termRarities[pickedCard.term] || 'C').bg} ${getRarityStyles(termRarities[pickedCard.term] || 'C').text} ${theme === 'CLASSIC' ? 'border-slate-100' : 'border-[#00FF0033]'}`}
                  >
                    {getTermIcon(pickedCard.term, 96)}
                  </motion.div>
                  
                  <div className="space-y-4 w-full">
                    <div className={`flex items-center justify-center gap-2 ${theme === 'CLASSIC' ? 'text-slate-400' : 'text-[#00FF00] opacity-40'}`}>
                      <Info size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Description Pattern {pickedCard.descriptionIndex + 1}</span>
                    </div>
                    <p className={`text-xl font-medium leading-relaxed text-center ${theme === 'CLASSIC' ? 'text-slate-700' : 'text-[#00FF00]'}`}>
                      {(termDescriptions[pickedCard.term] || ["説明がありません。"])[pickedCard.descriptionIndex]}
                    </p>
                  </div>

                  <div className={`pt-8 border-t w-full ${theme === 'CLASSIC' ? 'border-slate-100' : 'border-[#00FF0011]'}`}>
                    <p className={`text-sm italic text-center ${theme === 'CLASSIC' ? 'text-slate-400' : 'text-[#00FF00] opacity-40'}`}>
                      "{flavorTexts[pickedCard.term] || "未知のデータ..."}"
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className={`px-10 py-6 flex justify-between items-center ${theme === 'CLASSIC' ? 'bg-slate-50' : 'bg-white/5'}`}>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-bold uppercase ${theme === 'CLASSIC' ? 'text-slate-400' : 'text-[#00FF00] opacity-40'}`}>Collection ID</span>
                    <span className={`text-lg font-mono font-bold ${theme === 'CLASSIC' ? 'text-slate-600' : 'text-[#00FF00]'}`}>{termToId[pickedCard.term] || "000"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      {['C', 'R', 'SR', 'UR'].map(r => (
                        <div 
                          key={r} 
                          className={`w-3 h-3 rounded-full ${termRarities[pickedCard.term!] === r ? getRarityStyles(r).bg : theme === 'CLASSIC' ? 'bg-slate-200' : 'bg-white/10'}`} 
                        />
                      ))}
                    </div>
                    <div className={`animate-bounce ${theme === 'CLASSIC' ? 'text-slate-300' : 'text-[#00FF00] opacity-40'}`}>
                      <RotateCcw size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shine Effect */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </motion.div>

            {/* Close Hint */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-10 text-white/60 text-sm font-medium tracking-widest uppercase flex items-center gap-2"
            >
              <MousePointer2 size={16} />
              Click card to switch pattern • Click outside to close
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
              className={`w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl ${
                theme === 'CLASSIC' ? 'bg-white' : 'bg-black border border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
              }`}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                theme === 'CLASSIC' ? 'bg-red-50 text-red-500' : 'bg-red-900/20 text-red-500'
              }`}>
                <AlertTriangle size={40} />
              </div>
              
              <h3 className={`text-2xl font-bold mb-4 ${theme === 'CYBER' ? 'text-red-500' : ''}`}>
                {resetStep === 1 && "学習状況のリセット"}
                {resetStep === 2 && "本当によろしいですか？"}
                {resetStep === 3 && "ホントに？"}
                {resetStep === 4 && "こうかいしませんね？"}
              </h3>
              
              <p className={`mb-10 leading-relaxed ${theme === 'CLASSIC' ? 'text-gray-500' : 'text-red-400/70'}`}>
                {resetStep === 1 && "これまでの学習成績、ハイスコア、演習回数がすべて消去されます。"}
                {resetStep === 2 && "(元に戻せません！)"}
                {resetStep === 3 && "(もどせないったら！)"}
                {resetStep === 4 && "(戻せませんよ！)"}
              </p>

              <div className="flex flex-col gap-3">
                {resetStep < 4 ? (
                  <>
                    <button 
                      onClick={() => setResetStep(prev => prev + 1)}
                      className={`w-full py-4 text-white rounded-2xl font-bold transition-colors ${
                        theme === 'CLASSIC' ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      }`}
                    >
                      次へ進む
                    </button>
                    <button 
                      onClick={() => setResetStep(0)}
                      className={`w-full py-4 rounded-2xl font-bold transition-colors ${
                        theme === 'CLASSIC' ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={resetAllStats}
                      className={`w-full py-4 text-white rounded-2xl font-bold transition-colors ${
                        theme === 'CLASSIC' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-50 hover:bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                      }`}
                    >
                      後悔しません
                    </button>
                    <button 
                      onClick={() => setResetStep(0)}
                      className={`w-full py-4 rounded-2xl font-bold transition-colors ${
                        theme === 'CLASSIC' ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
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

      {/* Reset Effect Overlay */}
      <AnimatePresence>
        {showResetEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[300] pointer-events-none flex items-center justify-center ${theme === 'CLASSIC' ? 'bg-white' : 'bg-black'}`}
          >
            <motion.div 
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 100, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeIn" }}
              className={`w-10 h-10 rounded-full ${theme === 'CLASSIC' ? 'bg-red-500' : 'bg-[#00FF00]'}`}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1, 0] }}
              transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1] }}
              className={`absolute inset-0 ${theme === 'CLASSIC' ? 'bg-red-500/20' : 'bg-[#00FF00]/20'}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
