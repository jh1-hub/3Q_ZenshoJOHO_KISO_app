import LZString from 'lz-string';
import { quizCategories, allTermsMap, Rarity } from '../data/quizData';

interface TermStat {
  correct: number;
  total: number;
}

export interface GameStats {
  [key: string]: {
    highScore: number;
    attempts: number;
    totalScore: number;
  };
}

export interface MigrationData {
  userName: string | null;
  userProfile: { grade: string; classNum: string; attendanceNum: string } | null;
  stats: GameStats;
  ownedCards: Record<string, number>;
  termStats: Record<string, TermStat>;
  hasBonusTicket: boolean;
  quizCount: number;
  speedStarStats: {
    maxCombo: number;
    maxCorrect: number;
    challenges: number;
    progress: number;
  };
  lastDailyChallengeId: string | null;
  dailyStreak: number;
}

const catIds = ['all', ...quizCategories.map(c => c.id), ...quizCategories.flatMap(c => c.subcategories.map(s => s.id))];

const toB64 = (num: number, padding: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let str = '';
  let n = num;
  do {
    str = chars[n % 64] + str;
    n = Math.floor(n / 64);
  } while (n > 0);
  return str.padStart(padding, 'A');
};

const fromB64 = (str: string) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    num = num * 64 + chars.indexOf(str[i]);
  }
  return num;
};

export const exportMigrationData = (data: MigrationData): string | null => {
  try {
    const filteredTermStats: Record<string, TermStat> = {};
    Object.entries(data.termStats).forEach(([term, stat]) => {
      if (stat.correct > 0 || stat.total > 0) {
        filteredTermStats[term] = stat;
      }
    });

    let compressed = "";
    
    // stats
    Object.entries(data.stats).forEach(([id, stat]) => {
      const index = catIds.indexOf(id);
      if (index !== -1 && (stat.attempts > 0 || stat.highScore > 0)) {
        compressed += `S${toB64(index, 1)}${toB64(Math.min(262143, stat.highScore), 3)}${toB64(Math.min(262143, stat.attempts), 3)}${toB64(Math.min(262143, stat.totalScore), 3)}`;
      }
    });

    // termStats
    Object.entries(filteredTermStats).forEach(([name, stat]) => {
      const term = allTermsMap[name];
      if (term) {
        const id = toB64(term.id, 2);
        const correct = toB64(Math.min(262143, stat.correct), 3);
        const total = toB64(Math.min(262143, stat.total), 3);
        compressed += `T${id}${correct}${total}`;
      }
    });

    // ownedCards
    Object.entries(data.ownedCards).forEach(([name, count]) => {
      const term = allTermsMap[name];
      if (term && count > 0) {
        const id = toB64(term.id, 2);
        const c = toB64(Math.min(63, count), 1);
        compressed += `C${id}${c}`;
      }
    });

    const payload = {
      v: 5,
      u: data.userName,
      p: data.userProfile,
      d: compressed,
      bt: data.hasBonusTicket,
      qc: data.quizCount,
      ss: {
        c: data.speedStarStats.maxCombo,
        m: data.speedStarStats.maxCorrect,
        a: data.speedStarStats.challenges,
        p: data.speedStarStats.progress
      },
      ld: data.lastDailyChallengeId,
      ds: data.dailyStreak,
      t: Date.now()
    };

    return LZString.compressToEncodedURIComponent(JSON.stringify(payload));
  } catch (err) {
    console.error("Export error:", err);
    return null;
  }
};

export const decryptMigrationData = (encryptedData: string): any => {
  try {
    const lzDecoded = LZString.decompressFromEncodedURIComponent(encryptedData);
    if (!lzDecoded) throw new Error("Invalid data");
    
    const decryptedData = JSON.parse(lzDecoded);

    if (decryptedData.v >= 4) {
      const idToName: Record<number, string> = {};
      Object.values(allTermsMap).forEach(t => idToName[t.id] = t.name);

      const parsedStats: Record<string, TermStat> = {};
      const parsedCategoryStats: Record<string, any> = {};
      const owned: Record<string, number> = {};
      const d = decryptedData.d || "";
      const version = decryptedData.v;

      let i = 0;
      while (i < d.length) {
        const type = d[i];
        if (type === 'S') {
          const index = fromB64(d.substring(i + 1, i + 2));
          const highScore = fromB64(d.substring(i + 2, i + 5));
          const attempts = fromB64(d.substring(i + 5, i + 8));
          const totalScore = fromB64(d.substring(i + 8, i + 11));
          const id = catIds[index];
          if (id) parsedCategoryStats[id] = { highScore, attempts, totalScore };
          i += 11;
        } else if (type === 'T') {
          const id = fromB64(d.substring(i + 1, i + 3));
          const correct = fromB64(d.substring(i + 3, i + 6));
          const total = fromB64(d.substring(i + 6, i + 9));
          const name = idToName[id];
          if (name) parsedStats[name] = { correct, total };
          i += 9;
        } else if (type === 'C') {
          const id = fromB64(d.substring(i + 1, i + 3));
          const count = fromB64(d.substring(i + 3, i + 4));
          const name = idToName[id];
          if (name) owned[name] = count;
          i += 4;
        } else {
          i++;
        }
      }

      return {
        userName: decryptedData.u,
        userProfile: decryptedData.p,
        stats: version >= 5 ? parsedCategoryStats : decryptedData.s,
        ownedCards: owned,
        termStats: parsedStats,
        hasBonusTicket: decryptedData.bt,
        quizCount: decryptedData.qc,
        speedStarStats: {
          maxCombo: decryptedData.ss?.c || 0,
          maxCorrect: decryptedData.ss?.m || 0,
          challenges: decryptedData.ss?.a || 0,
          progress: decryptedData.ss?.p || 0
        },
        lastDailyChallengeId: decryptedData.ld,
        dailyStreak: decryptedData.ds
      };
    }
    return decryptedData;
  } catch (e) {
    console.error("Decryption error:", e);
    throw e;
  }
};
