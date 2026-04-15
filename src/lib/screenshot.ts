import { Category, UnitStats, allTerms, allTermsMap, quizCategories } from '../data/quizData';

interface UserProfile {
  grade: string;
  classNum: string;
  attendanceNum: string;
}

interface TermStat {
  correct: number;
  total: number;
}

interface TermStats {
  [termName: string]: TermStat;
}

/**
 * Generates and downloads a screenshot of the user's stats.
 */
export const takeScreenshot = (
  userName: string | null,
  userProfile: UserProfile | null,
  quizCount: number,
  ownedCards: Record<string, number>,
  getStatsFor: (id: string) => UnitStats,
  speedStarMaxCorrect: number,
  speedStarChallenges: number,
  weakPoints: { name: string; rate: number }[]
) => {
  const fileName = `${userProfile?.grade || '0'}${userProfile?.classNum || '0'}${userProfile?.attendanceNum || '00'}stats.png`;
  const level = Math.floor(quizCount / 10) + 1;

  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Color palette based on level
  let color1 = '#1e1b4b'; // Default (Lv 1-5)
  let color2 = '#4c1d95';
  let accentColor = '#fbbf24';

  if (level >= 31) {
    color1 = '#0f172a'; // Legend: Slate 900
    color2 = '#334155'; // Slate 700
    accentColor = '#fcd34d'; // Bright Gold
  } else if (level >= 21) {
    color1 = '#4c1d95'; // Grandmaster: Violet
    color2 = '#db2777'; // Pink
    accentColor = '#6ee7b7'; // Emerald
  } else if (level >= 16) {
    color1 = '#7f1d1d'; // Master: Red
    color2 = '#991b1b';
    accentColor = '#fde047'; // Yellow
  } else if (level >= 11) {
    color1 = '#78350f'; // Expert: Amber
    color2 = '#92400e';
    accentColor = '#38bdf8'; // Sky Blue
  } else if (level >= 6) {
    color1 = '#064e3b'; // Apprentice: Emerald
    color2 = '#065f46';
    accentColor = '#f9a8d4'; // Pink
  }

  // Background (Gradient based on level)
  const gradient = ctx.createLinearGradient(0, 0, 1920, 1080);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1920, 1080);

  // Watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.font = 'bold 120px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('IT QUIZ STATS', 960, 540);

  // Header
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.font = 'bold 56px Arial';
  ctx.fillText('学習成績レポート', 50, 80);

  // User Info (Right side)
  ctx.font = '32px Arial';
  ctx.fillText(`ユーザー: ${userName || '未設定'}`, 1400, 60);
  ctx.fillText(`学年: ${userProfile?.grade || '0'}年 ${userProfile?.classNum || '0'}組 ${userProfile?.attendanceNum || '0'}番`, 1400, 100);
  
  // Level and Collection Status
  const collectionRate = allTerms.length > 0 ? Math.floor((Object.keys(ownedCards).length / allTerms.length) * 100) : 0;
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 36px Arial';
  ctx.fillText(`Lv. ${level} | 収集率: ${collectionRate}%`, 1400, 150);

  // Stats Data
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

  // Weak Points Ranking
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

  // Logo (Bottom right)
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
