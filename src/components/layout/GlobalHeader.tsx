import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Download, RefreshCw, Home } from 'lucide-react';

interface GlobalHeaderProps {
  userName: string | null;
  userLevel: number;
  userLevelProgress: number;
  gameState: string;
  setGameState: (state: any) => void;
  resetQuizState: () => void;
  deferredPrompt: any;
  handleInstallClick: () => void;
  setShowMigrationModal: (show: boolean) => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  userName,
  userLevel,
  userLevelProgress,
  gameState,
  setGameState,
  resetQuizState,
  deferredPrompt,
  handleInstallClick,
  setShowMigrationModal
}) => {
  if (!userName || gameState === 'QUIZ') return null;

  return (
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
  );
};
