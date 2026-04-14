import React from 'react';
import {
  Database, Brain, Cloud, Smartphone, MessageSquare, MousePointerClick,
  Sparkles, Layers, Server, Network, Radio, MapPin, CreditCard, ShoppingCart,
  Truck, UserCheck, AlertTriangle, Fingerprint, Gavel, Copyright, CreativeCommons,
  Cpu, HardDrive, Camera, Wifi, Link, Binary, RefreshCw, Clock, Settings,
  Download, Trash2, BookOpen, PenTool, FileText, Archive, Globe, Upload,
  SearchCode, Shield, Box, Activity, Target, BarChart, PieChart, Zap,
  LineChart, Lightbulb, Monitor, Terminal, Code
} from 'lucide-react';

export const getTermIcon = (term: string, size: number = 32) => {
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
