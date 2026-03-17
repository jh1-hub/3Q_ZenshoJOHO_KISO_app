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

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('it_quiz_stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Failed to parse stats", e);
      }
    }
  }, []);

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
    saveStats({});
    setResetStep(0);
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
    switch (rarity) {
      case 'UR':
        return {
          border: 'border-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]',
          bg: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
          text: 'text-white',
          label: 'Ultra Rare',
          accent: 'bg-white/20',
          glow: 'animate-pulse shadow-[0_0_30px_rgba(236,72,153,0.8)]'
        };
      case 'SR':
        return {
          border: 'border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]',
          bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
          text: 'text-white',
          label: 'Super Rare',
          accent: 'bg-white/20',
          glow: 'shadow-[0_0_20px_rgba(250,204,21,0.6)]'
        };
      case 'R':
        return {
          border: 'border-4 border-blue-400',
          bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
          text: 'text-white',
          label: 'Rare',
          accent: 'bg-white/20',
          glow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)]'
        };
      default:
        return {
          border: 'border-4 border-slate-200',
          bg: 'bg-white',
          text: 'text-slate-800',
          label: 'Common',
          accent: 'bg-slate-100',
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
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans selection:bg-[#5A5A40] selection:text-white">
      <AnimatePresence mode="wait">
        {gameState === 'START' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <div className="mb-8 relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="bg-[#5A5A40] p-6 rounded-3xl shadow-xl"
              >
                <BrainCircuit size={80} className="text-white" />
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-[#FF6321] text-white p-3 rounded-full shadow-lg"
              >
                <Zap size={24} />
              </motion.div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 tracking-tight">
              IT Quiz <span className="italic text-[#5A5A40]">Master</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-md">
              【情報基礎】の知識を極めよう
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setGameState('CATEGORY_SELECT')}
                className="group relative px-12 py-5 bg-[#141414] text-white rounded-full text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-3">
                  学習を始める <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-[#5A5A40] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button 
                onClick={() => setGameState('COLLECTION')}
                className="group relative px-12 py-5 bg-white text-[#141414] border-2 border-gray-200 rounded-full text-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <span className="relative z-10 flex items-center gap-3">
                  カードコレクション <LayoutGrid size={24} />
                </span>
              </button>
            </div>

            {/* Statistics Section */}
            <div className="mt-20 w-full max-w-4xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-bold flex items-center gap-3">
                  <BarChart className="text-[#5A5A40]" /> 学習状況
                </h2>
                <button 
                  onClick={() => setResetStep(1)}
                  className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                >
                  <RotateCcw size={14} /> データをリセット
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Comprehensive Stats */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Trophy size={48} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">総合演習</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-sm text-gray-500">ハイスコア</span>
                      <span className="text-xl font-mono font-bold">{getStatsFor('all').highScore.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-sm text-gray-500">演習回数</span>
                      <span className="text-xl font-mono font-bold">{getStatsFor('all').attempts}回</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-sm text-gray-500">平均スコア</span>
                      <span className="text-xl font-mono font-bold">
                        {getStatsFor('all').attempts > 0 
                          ? Math.floor(getStatsFor('all').totalScore / getStatsFor('all').attempts).toLocaleString() 
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category Stats Summary */}
                {quizCategories.map(cat => (
                  <div key={cat.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform ${getCategoryColor(cat.id).text}`}>
                      <Database size={48} />
                    </div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${getCategoryColor(cat.id).text}`}>{cat.title}</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-gray-500">ハイスコア</span>
                        <span className="text-xl font-mono font-bold">{getStatsFor(cat.id).highScore.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-gray-500">演習回数</span>
                        <span className="text-xl font-mono font-bold">{getStatsFor(cat.id).attempts}回</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-gray-500">平均スコア</span>
                        <span className="text-xl font-mono font-bold">
                          {getStatsFor(cat.id).attempts > 0 
                            ? Math.floor(getStatsFor(cat.id).totalScore / getStatsFor(cat.id).attempts).toLocaleString() 
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Subcategory Stats */}
              <div className="space-y-12">
                {quizCategories.map(category => (
                  <div key={category.id} className="space-y-4">
                    <h3 className={`text-lg font-bold border-l-4 pl-3 ${getCategoryColor(category.id).border} ${getCategoryColor(category.id).text}`}>
                      {category.title} 詳細
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.subcategories.map(sub => {
                        const s = getStatsFor(sub.id);
                        return (
                          <div key={sub.id} className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-sm font-bold mb-3 truncate">{sub.title}</p>
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-400 uppercase">
                              <div>High Score</div>
                              <div className="text-right text-gray-700 font-mono">{s.highScore.toLocaleString()}</div>
                              <div>Attempts</div>
                              <div className="text-right text-gray-700 font-mono">{s.attempts}</div>
                              <div>Avg</div>
                              <div className="text-right text-gray-700 font-mono">
                                {s.attempts > 0 ? Math.floor(s.totalScore / s.attempts).toLocaleString() : 0}
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                <h2 className="text-4xl font-serif font-bold mb-2">IT Card Collection</h2>
                <p className="text-gray-500">知識をカードとして集めよう。{Object.keys(termDescriptions).length}枚のカードを収録。</p>
              </div>
              <button 
                onClick={() => setGameState('START')}
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors font-bold"
              >
                <ArrowLeft size={20} /> トップに戻る
              </button>
            </div>

            {/* Search & Tabs */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-12">
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="カードの名前で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#F5F5F0] rounded-2xl border-none focus:ring-2 focus:ring-[#5A5A40] transition-all text-lg"
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
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>

              {/* Subcategory Tabs */}
              {quizCategories.find(c => c.id === activeCollectionTab)?.subcategories.length! > 0 && (
                <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                  {quizCategories.find(c => c.id === activeCollectionTab)?.subcategories.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubcollectionTab(sub.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeSubcollectionTab === sub.id 
                          ? `${getCategoryColor(activeCollectionTab).accent} text-white shadow-md` 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
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
                            
                            <div className="h-full flex flex-col bg-white">
                              {/* Card Header */}
                              <div className={`px-4 py-3 flex justify-between items-center ${rarity !== 'C' ? styles.bg : 'bg-slate-50'} ${rarity !== 'C' ? 'text-white' : 'text-slate-600'}`}>
                                <span className="text-[10px] font-bold tracking-widest uppercase">{styles.label}</span>
                              </div>

                              {/* Card Content */}
                              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
                                <div className={`p-3 rounded-xl ${rarity !== 'C' ? 'bg-white/20' : 'bg-slate-100'} transition-transform group-hover:scale-110 duration-300`}>
                                  {getTermIcon(term, 48)}
                                </div>
                                <h3 className={`text-xl font-bold leading-tight ${styles.text === 'text-white' ? 'text-slate-800' : styles.text}`}>
                                  {term}
                                </h3>
                                <p className="text-xs text-slate-500 line-clamp-3">
                                  {(termDescriptions[term] || ["説明がありません。"])[0]}
                                </p>
                              </div>

                              {/* Card Footer / Rarity indicator */}
                              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-[10px] font-mono text-slate-400">ID: {termToId[term] || "000"}</span>
                                <div className="flex gap-1">
                                  {['C', 'R', 'SR', 'UR'].map(r => (
                                    <div 
                                      key={r} 
                                      className={`w-2 h-2 rounded-full ${rarity === r ? styles.bg : 'bg-slate-200'}`} 
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
              <h2 className="text-3xl font-serif font-bold">単元を選択</h2>
              <button 
                onClick={() => setGameState('START')}
                className="text-gray-500 hover:text-black transition-colors"
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
              className="w-full mb-12 p-8 bg-gradient-to-r from-[#141414] to-[#5A5A40] text-white rounded-[2rem] shadow-xl flex items-center justify-between group overflow-hidden relative"
            >
              <div className="relative z-10 flex items-center gap-6">
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                  <Trophy size={32} className="text-[#FF6321]" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-1">総合演習</h3>
                  <p className="text-white/60">全単元からランダムに20問出題されます</p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-2 font-bold text-lg">
                挑戦する <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </div>
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -right-10 -bottom-10 w-64 h-64 bg-white rounded-full blur-3xl"
              />
            </motion.button>

            <div className="space-y-12">
              {quizCategories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h3 className="text-xl font-bold text-[#5A5A40]">
                      {category.title}
                    </h3>
                    <button
                      onClick={() => startQuiz(category)}
                      className="text-sm font-bold bg-[#5A5A40] text-white px-4 py-1 rounded-full hover:bg-black transition-colors"
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
                        className="flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#5A5A40] transition-all text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-[#F5F5F0] rounded-xl group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <p className="font-bold">{sub.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{sub.terms.length} 用語収録</p>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-300 group-hover:text-[#5A5A40] transition-colors" />
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
                  className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-black"
                  title="クイズを中断して戻る"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 font-bold">
                  Q {currentQuestionIndex + 1} / {questions.length}
                </div>
                {combo > 1 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    className="bg-[#FF6321] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1"
                  >
                    <Zap size={14} /> {combo} COMBO
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xl font-mono font-bold">
                <Timer size={24} className={timeLeft < 3 ? 'text-red-500 animate-pulse' : ''} />
                <span className={timeLeft < 3 ? 'text-red-500' : ''}>{Math.ceil(timeLeft)}s</span>
              </div>
            </div>

            {/* Visual Timer Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
              <motion.div 
                className={`h-full ${timeLeft < 5 ? 'bg-red-500' : 'bg-[#FF6321]'}`}
                initial={{ width: '100%' }}
                animate={{ width: `${(timeLeft / 15) * 100}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-100 rounded-full mb-12 overflow-hidden">
              <motion.div 
                className="h-full bg-[#5A5A40]"
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
                className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 mb-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-[#5A5A40]" />
                <h3 className="text-2xl md:text-3xl font-serif leading-relaxed mb-0">
                  {questions[currentQuestionIndex].description}
                </h3>
              </motion.div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-4">
                {questions[currentQuestionIndex].options.map((option, idx) => {
                  const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
                  const isSelected = option === userAnswer;
                  
                  let buttonClass = 'bg-white border-gray-100 hover:border-[#5A5A40] hover:bg-[#F5F5F0]';
                  if (feedback === 'CORRECT' && isCorrect) {
                    buttonClass = 'bg-green-50 border-green-500 text-green-700';
                  } else if (feedback === 'WRONG') {
                    if (isCorrect) {
                      buttonClass = 'bg-green-50 border-green-500 text-green-700';
                    } else if (isSelected) {
                      buttonClass = 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-200';
                    } else {
                      buttonClass = 'bg-white border-gray-100 opacity-50';
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
                      <span className="mr-4 text-gray-300">{idx + 1}.</span>
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
              <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">Current Score</p>
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
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 mb-8">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="inline-block p-6 bg-[#F5F5F0] rounded-full mb-6"
              >
                <Trophy size={64} className="text-[#FF6321]" />
              </motion.div>
              
              <h2 className="text-4xl font-serif font-bold mb-2">Quiz Complete!</h2>
              <p className="text-gray-500 mb-8">{selectedSubcategory?.title}</p>
              
              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="p-6 bg-[#F5F5F0] rounded-3xl">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Score</p>
                  <p className="text-3xl font-mono font-bold">{score.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-[#F5F5F0] rounded-3xl">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Max Combo</p>
                  <p className="text-3xl font-mono font-bold">{maxCombo}</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setGameState('CATEGORY_SELECT')}
                  className="w-full py-5 bg-[#141414] text-white rounded-2xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-colors"
                >
                  <LayoutGrid size={24} /> 他の単元を選ぶ
                </button>
                <button 
                  onClick={() => startQuiz(selectedSubcategory!)}
                  className="w-full py-5 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
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
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#5A5A40] border-t-transparent rounded-full mb-4"
            />
            <p className="text-lg font-bold text-[#5A5A40] animate-pulse">問題を準備中...</p>
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
              <div className="h-full flex flex-col bg-white">
                {/* Header */}
                <div className={`px-8 py-6 flex justify-between items-center ${getRarityStyles(termRarities[pickedCard.term] || 'C').bg} ${getRarityStyles(termRarities[pickedCard.term] || 'C').text}`}>
                  <div className="space-y-1">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">
                      {getRarityStyles(termRarities[pickedCard.term] || 'C').label}
                    </span>
                    <h2 className="text-3xl font-black tracking-tight">{pickedCard.term}</h2>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-10 flex flex-col items-center justify-center space-y-8">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`p-8 rounded-[2rem] ${getRarityStyles(termRarities[pickedCard.term] || 'C').bg} ${getRarityStyles(termRarities[pickedCard.term] || 'C').text} shadow-2xl border border-slate-100`}
                  >
                    {getTermIcon(pickedCard.term, 96)}
                  </motion.div>
                  
                  <div className="space-y-4 w-full">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <Info size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Description Pattern {pickedCard.descriptionIndex + 1}</span>
                    </div>
                    <p className="text-xl text-slate-700 font-medium leading-relaxed text-center">
                      {(termDescriptions[pickedCard.term] || ["説明がありません。"])[pickedCard.descriptionIndex]}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <p className="text-sm text-slate-400 italic text-center">
                      "{(() => {
                        const flavor = flavorTexts[pickedCard.term];
                        if (!flavor) return "未知のデータ...";
                        if (Array.isArray(flavor)) {
                          return flavor[pickedCard.descriptionIndex % flavor.length];
                        }
                        return flavor;
                      })()}"
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-10 py-6 bg-slate-50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Collection ID</span>
                    <span className="text-lg font-mono font-bold text-slate-600">{termToId[pickedCard.term] || "000"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      {['C', 'R', 'SR', 'UR'].map(r => (
                        <div 
                          key={r} 
                          className={`w-3 h-3 rounded-full ${termRarities[pickedCard.term!] === r ? getRarityStyles(r).bg : 'bg-slate-200'}`} 
                        />
                      ))}
                    </div>
                    <div className="text-slate-300 animate-bounce">
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
              className="bg-white w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">
                {resetStep === 1 && "学習状況のリセット"}
                {resetStep === 2 && "本当によろしいですか？"}
                {resetStep === 3 && "ホントに？"}
                {resetStep === 4 && "こうかいしませんね？"}
              </h3>
              
              <p className="text-gray-500 mb-10 leading-relaxed">
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
                      className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors"
                    >
                      次へ進む
                    </button>
                    <button 
                      onClick={() => setResetStep(0)}
                      className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={resetAllStats}
                      className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors"
                    >
                      後悔しません
                    </button>
                    <button 
                      onClick={() => setResetStep(0)}
                      className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
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
    </div>
  );
}
