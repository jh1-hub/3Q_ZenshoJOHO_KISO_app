import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';

interface InstallPromptModalProps {
  showInstallPrompt: boolean;
  setShowInstallPrompt: (show: boolean) => void;
  handleInstallClick: () => void;
  isMobile: boolean;
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({
  showInstallPrompt,
  setShowInstallPrompt,
  handleInstallClick,
  isMobile
}) => {
  if (!showInstallPrompt || !isMobile) return null;

  return (
    <AnimatePresence>
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
    </AnimatePresence>
  );
};
