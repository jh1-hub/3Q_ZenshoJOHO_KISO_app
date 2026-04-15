import React from 'react';
import { BarChart, Camera, UserCheck, Trophy, RotateCcw, Database } from 'lucide-react';

interface StartStatsProps {
  takeScreenshot: () => void;
  userLevel: number;
  userName: string | null;
  userProfile: { grade: string; classNum: string; attendanceNum: string } | null;
  getStatsFor: (id: string) => { highScore: number; attempts: number; totalScore: number };
  quizCategories: any[];
  getCategoryColor: (id: string) => any;
}

export const StartStats: React.FC<StartStatsProps> = ({
  takeScreenshot,
  userLevel,
  userName,
  userProfile,
  getStatsFor,
  quizCategories,
  getCategoryColor
}) => {
  const allStats = getStatsFor('all');

  return (
    <div className="mt-20 w-full max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-theme-heading font-bold flex items-center gap-3">
          <BarChart className="text-theme-accent" /> 学習状況
        </h2>
        <button 
          onClick={takeScreenshot}
          className="text-[10px] md:text-sm font-bold text-theme-accent hover:text-white hover:bg-theme-accent transition-all duration-300 flex items-center gap-2 bg-theme-accent/10 px-3 py-1.5 md:px-6 md:py-3 rounded-full border border-theme-accent/20 hover:shadow-lg"
        >
          <Camera size={14} className="md:w-4 md:h-4" /> 提出
        </button>
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
                <p className="text-3xl font-mono font-bold tracking-tight">{allStats.highScore.toLocaleString()}</p>
              </div>
              <div className="space-y-1 text-center md:text-left">
                <p className="text-sm text-theme-text-muted flex items-center justify-center md:justify-start gap-2">
                  <RotateCcw size={14} className="text-theme-accent" /> 演習回数
                </p>
                <p className="text-3xl font-mono font-bold tracking-tight">{allStats.attempts}<span className="text-sm ml-1 font-sans">回</span></p>
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
  );
};
