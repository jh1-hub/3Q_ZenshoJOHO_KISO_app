import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X, QrCode, Scan, Download, Copy, Check, Maximize2, Minimize2, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import { exportMigrationData, decryptMigrationData, MigrationData } from '../../lib/migration';

interface MigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: MigrationData;
  onConfirmMigration: (data: any) => void;
  onReset: () => void;
  initialMode?: 'scan' | 'export' | null;
}

export const MigrationModal: React.FC<MigrationModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onConfirmMigration,
  onReset,
  initialMode = null
}) => {
  const [migrationQR, setMigrationQR] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const [isQRFullscreen, setIsQRFullscreen] = useState(false);
  const [pendingMigrationData, setPendingMigrationData] = useState<any | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showPasteInput, setShowPasteInput] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isOpen && initialMode === 'scan') {
      setIsScanning(true);
    }
  }, [isOpen, initialMode]);

  const handleExport = () => {
    const encrypted = exportMigrationData(currentData);
    if (encrypted) {
      if (encrypted.length > 4200) {
        setMigrationError("データ量が多すぎるため、QRコードを発行できません。テキストコピー機能をご利用ください。");
      }
      setMigrationQR(encrypted);
      setMigrationError(null);
    } else {
      setMigrationError("データの書き出し中にエラーが発生しました。");
    }
  };

  const handleCopy = () => {
    if (migrationQR) {
      navigator.clipboard.writeText(migrationQR);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const processDecodedData = (decodedText: string) => {
    try {
      const data = decryptMigrationData(decodedText);
      if (data.userName && data.stats && data.ownedCards) {
        setPendingMigrationData(data);
        setMigrationError(null);
        setShowPasteInput(false);
        setPasteText('');
      } else {
        setMigrationError("無効なデータ形式です。");
      }
    } catch (e) {
      setMigrationError("データの復号に失敗しました。正しいデータか確認してください。");
    }
  };

  const handlePasteImport = () => {
    if (pasteText.trim()) {
      processDecodedData(pasteText.trim());
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal closes
      setMigrationQR(null);
      setIsScanning(false);
      setMigrationError(null);
      setPendingMigrationData(null);
      setIsQRFullscreen(false);
      setShowPasteInput(false);
      setPasteText('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isScanning && isOpen) {
      const startScanner = async () => {
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setMigrationError("このブラウザはカメラアクセスをサポートしていないか、安全な接続（HTTPS）ではありません。");
            setIsScanning(false);
            return;
          }

          // Wait a bit for the DOM element to be available
          await new Promise(resolve => setTimeout(resolve, 800));
          if (!isOpen || !isScanning) return;

          const element = document.getElementById("qr-reader");
          if (!element) {
            console.error("QR reader element not found");
            // If element is not found but we should be scanning, try one more time after a short delay
            await new Promise(resolve => setTimeout(resolve, 500));
            if (!document.getElementById("qr-reader") || !isOpen || !isScanning) {
              setIsScanning(false);
              return;
            }
          }

          if (scannerRef.current) {
            try {
              await scannerRef.current.stop();
            } catch (e) {}
            scannerRef.current = null;
          }

          // Initialize with experimental features for better performance
          const html5QrCode = new Html5Qrcode("qr-reader", { 
            verbose: false,
            experimentalFeatures: {
              useBarCodeDetectorIfSupported: true
            }
          });
          scannerRef.current = html5QrCode;
          
          const qrboxSize = (viewWidth: number, viewHeight: number) => {
            const minEdge = Math.min(viewWidth, viewHeight);
            return {
              width: Math.floor(minEdge * 0.8),
              height: Math.floor(minEdge * 0.8)
            };
          };

          await html5QrCode.start(
            { facingMode: "environment" },
            { 
              fps: 25, 
              qrbox: qrboxSize,
              aspectRatio: 1.0,
              disableFlip: true,
              videoConstraints: {
                width: { min: 640, ideal: 1280 },
                height: { min: 480, ideal: 720 },
                facingMode: "environment"
              }
            },
            (decodedText) => {
              processDecodedData(decodedText);
              setIsScanning(false);
              html5QrCode.stop().catch(console.error);
              scannerRef.current = null;
            },
            () => {}
          );
        } catch (err: any) {
          console.error("Scanner error:", err);
          setMigrationError("カメラの起動に失敗しました。権限を確認してください。");
          setIsScanning(false);
        }
      };
      startScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isScanning, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-theme-card w-full ${isQRFullscreen && migrationQR ? 'max-w-none h-full' : 'max-w-lg'} p-8 rounded-[2.5rem] shadow-2xl border border-theme-border space-y-6 relative ${isQRFullscreen && migrationQR ? '' : 'max-h-[90vh] overflow-y-auto'}`}
          >
        <button 
          onClick={onClose}
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

        {!migrationQR && !isScanning && !pendingMigrationData && !showPasteInput && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={handleExport}
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

            <button 
              onClick={() => setShowPasteInput(true)}
              className="col-span-1 sm:col-span-2 p-4 bg-theme-muted border-2 border-theme-border rounded-2xl hover:border-theme-accent transition-all flex items-center justify-center gap-2 text-theme-text font-bold text-sm"
            >
              <Copy size={18} />
              テキストを貼り付けて読み込む
            </button>

            <button 
              onClick={onReset}
              className="col-span-1 sm:col-span-2 p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2 text-rose-600 font-bold text-sm"
            >
              <RefreshCw size={18} />
              データをすべてリセットする
            </button>
          </div>
        )}

        {showPasteInput && !pendingMigrationData && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-bold">テキスト貼り付け</h3>
              <p className="text-xs text-theme-text-muted">コピーした移行データを下の枠に貼り付けてください。</p>
            </div>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="ここにデータを貼り付け..."
              className="w-full h-32 p-4 bg-theme-muted border-2 border-theme-border rounded-2xl focus:border-theme-accent outline-none text-xs font-mono resize-none"
            />
            <div className="flex gap-3">
              <button 
                onClick={handlePasteImport}
                disabled={!pasteText.trim()}
                className="flex-1 py-4 bg-theme-accent text-white rounded-2xl font-bold shadow-lg shadow-theme-accent/20 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                読み込む
              </button>
              <button 
                onClick={() => {
                  setShowPasteInput(false);
                  setPasteText('');
                  setMigrationError(null);
                }}
                className="px-6 py-4 bg-theme-border text-theme-text-muted rounded-2xl font-bold hover:bg-theme-border-strong transition-all"
              >
                戻る
              </button>
            </div>
          </div>
        )}

        {migrationQR && !pendingMigrationData && (
          <div className={`flex flex-col items-center space-y-6 ${isQRFullscreen ? 'h-full justify-center' : ''}`}>
            <div 
              onClick={() => setIsQRFullscreen(!isQRFullscreen)}
              className={`relative bg-white p-4 rounded-3xl shadow-inner cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${isQRFullscreen ? 'w-[min(80vh,80vw)] h-[min(80vh,80vw)]' : ''}`}
            >
              <QRCodeSVG 
                value={migrationQR} 
                size={isQRFullscreen ? undefined : 256} 
                className={isQRFullscreen ? 'w-full h-full' : ''}
                level="M"
                includeMargin={true}
              />
            </div>
            
            {!isQRFullscreen && (
              <>
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={handleCopy}
                    className="flex-1 py-3 bg-theme-muted hover:bg-theme-border rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    {copySuccess ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    {copySuccess ? "コピーしました" : "データをコピー"}
                  </button>
                  <button 
                    onClick={() => setMigrationQR(null)}
                    className="px-6 py-3 bg-theme-border text-theme-text-muted rounded-xl font-bold hover:bg-theme-border-strong transition-all"
                  >
                    戻る
                  </button>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <AlertCircle className="text-amber-500 shrink-0" size={20} />
                  <p className="text-[10px] text-amber-700 leading-relaxed">
                    ※データ量が多い場合、QRコードが細かくなり読み取りにくくなることがあります。その場合は「全画面表示」にするか、「データをコピー」してメール等で送ってください。
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {isScanning && (
          <div className="space-y-6">
            <div id="qr-reader" className="w-full overflow-hidden rounded-3xl border-2 border-theme-accent bg-black aspect-square" />
            <button 
              onClick={() => setIsScanning(false)}
              className="w-full py-4 bg-theme-border text-theme-text-muted rounded-2xl font-bold hover:bg-theme-border-strong transition-all"
            >
              キャンセル
            </button>
          </div>
        )}

        {pendingMigrationData && (
          <div className="space-y-6">
            <div className="p-6 bg-theme-muted rounded-3xl border-2 border-theme-accent/30 space-y-4">
              <h3 className="font-bold text-lg text-center">以下のデータを読み込みますか？</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-theme-text-muted text-[10px] uppercase">ユーザー名</div>
                  <div className="font-bold">{pendingMigrationData.userName}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-theme-text-muted text-[10px] uppercase">レベル</div>
                  <div className="font-bold">Lv.{Math.floor(pendingMigrationData.quizCount / 10) + 1}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-theme-text-muted text-[10px] uppercase">カード収集</div>
                  <div className="font-bold">{Object.keys(pendingMigrationData.ownedCards).length} 枚</div>
                </div>
                <div className="space-y-1">
                  <div className="text-theme-text-muted text-[10px] uppercase">連続ログイン</div>
                  <div className="font-bold">{pendingMigrationData.dailyStreak} 日</div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[10px] text-amber-700 font-medium">
                ※現在のデバイスに保存されているデータは上書きされます。
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => onConfirmMigration(pendingMigrationData)}
                className="flex-1 py-4 bg-theme-accent text-white rounded-2xl font-bold shadow-lg shadow-theme-accent/20 hover:bg-black transition-all"
              >
                データを上書きして開始
              </button>
              <button 
                onClick={() => setPendingMigrationData(null)}
                className="px-6 py-4 bg-theme-border text-theme-text-muted rounded-2xl font-bold hover:bg-theme-border-strong transition-all"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {migrationError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center gap-3">
            <AlertCircle size={20} />
            {migrationError}
          </div>
        )}
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
};
