import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ResetConfirmationModalProps {
  resetStep: number;
  resetCooldown: number;
  onNextStep: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  resetStep,
  resetCooldown,
  onNextStep,
  onCancel,
  onConfirm
}) => {
  const getStepContent = () => {
    switch (resetStep) {
      case 1:
        return {
          message: "セーブデータをすべて消しますか？",
          sub: "ユーザーデータ、カードコレクション、学習成績をすべて消去します。",
          confirmText: "はい",
          cancelText: "いいえ"
        };
      case 2:
        return {
          message: "本当によろしいですか？",
          sub: "※元に戻せません！",
          confirmText: "はい",
          cancelText: "いいえ"
        };
      case 3:
        return {
          message: "こうかいしませんね？",
          sub: "※戻せませんよ！",
          confirmText: "後悔しない",
          cancelText: "いいえ"
        };
      case 4:
        return {
          message: "ホントに？",
          sub: "(もどせないったら！)",
          confirmText: "消す！",
          cancelText: "やめとく"
        };
      default:
        return null;
    }
  };

  const content = getStepContent();
  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-theme-card w-full max-w-md rounded-[2.5rem] p-10 space-y-8 text-center shadow-2xl border border-theme-border"
      >
        <div className="space-y-4">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-2">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-2xl font-bold">{content.message}</h2>
          <p className="text-theme-text-muted text-sm">{content.sub}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={resetStep === 4 ? onConfirm : onNextStep}
            disabled={resetCooldown > 0}
            className={`w-full py-4 rounded-2xl font-bold transition-all ${
              resetCooldown > 0 
                ? 'bg-theme-muted text-theme-text-muted cursor-not-allowed' 
                : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
            }`}
          >
            {resetCooldown > 0 ? `${resetCooldown}...` : content.confirmText}
          </button>
          <button 
            onClick={onCancel}
            className="w-full py-4 bg-theme-border text-theme-text-muted rounded-2xl font-bold hover:bg-theme-border-strong transition-colors"
          >
            {content.cancelText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
