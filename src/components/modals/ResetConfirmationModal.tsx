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
  return (
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
          {resetStep >= 4 && "(こうかいしませんね？)"}
        </p>

        <div className="flex flex-col gap-3">
          {resetStep < 7 ? (
            <>
              <button 
                onClick={onNextStep}
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
                onClick={onCancel}
                className="w-full py-4 bg-theme-border text-theme-text-muted rounded-2xl font-bold hover:bg-theme-border-strong transition-colors"
              >
                キャンセル
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onConfirm}
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
                onClick={onCancel}
                className="w-full py-4 bg-theme-border text-theme-text-muted rounded-2xl font-bold hover:bg-theme-border-strong transition-colors"
              >
                いいえ
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
