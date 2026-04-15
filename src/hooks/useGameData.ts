import { useState, useEffect, useCallback, useMemo } from 'react';
import { storage } from '../lib/storage';
import { allTermsMap, GameStats, TermStat, TermStats, UnitStats } from '../data/quizData';
import { calculateLevel, calculateLevelProgress } from '../lib/level';
import { MigrationData } from '../lib/migration';

const idToNameMap: Record<number, string> = {};
Object.values(allTermsMap).forEach(t => idToNameMap[t.id] = t.name);

export const useGameData = (showToast?: (message: string, type?: any) => void) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ grade: string; classNum: string; attendanceNum: string } | null>(null);
  const [stats, setStats] = useState<GameStats>({});
  const [ownedCards, setOwnedCards] = useState<Record<string, number>>({});
  const [termStats, setTermStats] = useState<TermStats>({});
  const [hasBonusTicket, setHasBonusTicket] = useState(false);
  const [quizCount, setQuizCount] = useState(0);
  const [speedStarMaxCombo, setSpeedStarMaxCombo] = useState(0);
  const [speedStarMaxCorrect, setSpeedStarMaxCorrect] = useState(0);
  const [speedStarChallenges, setSpeedStarChallenges] = useState(0);
  const [lastDailyChallengeId, setLastDailyChallengeId] = useState<string | null>(null);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedName = storage.getItem('it_quiz_username');
    const savedProfile = storage.getItem('it_quiz_user_profile');
    if (savedName) setUserName(savedName);
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }

    const savedStats = storage.getItem('it_quiz_stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Failed to parse stats", e);
      }
    }

    const savedTicket = storage.getItem('it_quiz_bonus_ticket');
    if (savedTicket) setHasBonusTicket(savedTicket === 'true');

    const savedQuizCount = storage.getItem('it_quiz_count');
    if (savedQuizCount) setQuizCount(parseInt(savedQuizCount, 10));

    const savedSpeedStarStats = storage.getItem('it_quiz_speed_star_stats');
    if (savedSpeedStarStats) {
      try {
        const parsed = JSON.parse(savedSpeedStarStats);
        setSpeedStarMaxCombo(parsed.maxCombo || 0);
        setSpeedStarMaxCorrect(parsed.maxCorrect || 0);
        setSpeedStarChallenges(parsed.challenges || 0);
      } catch (e) {
        console.error("Failed to parse speed star stats", e);
      }
    }

    const savedCollection = storage.getItem('it_quiz_collection');
    if (savedCollection) {
      try {
        const parsed = JSON.parse(savedCollection);
        const nameBasedCollection: Record<string, number> = {};
        Object.entries(parsed).forEach(([key, value]) => {
          if (isNaN(Number(key))) {
            nameBasedCollection[key] = value as number;
          } else {
            const termId = Number(key);
            const termName = idToNameMap[termId];
            if (termName) nameBasedCollection[termName] = value as number;
          }
        });
        setOwnedCards(nameBasedCollection);
      } catch (e) {
        console.error("Failed to parse collection", e);
      }
    }

    const savedTermStats = storage.getItem('it_quiz_term_stats');
    if (savedTermStats) {
      try {
        const parsed = JSON.parse(savedTermStats);
        const nameBasedStats: TermStats = {};
        Object.entries(parsed).forEach(([key, value]) => {
          if (isNaN(Number(key))) {
            nameBasedStats[key] = value as TermStat;
          } else {
            const termId = Number(key);
            const termName = idToNameMap[termId];
            if (termName) nameBasedStats[termName] = value as TermStat;
          }
        });
        setTermStats(nameBasedStats);
      } catch (e) {
        console.error("Failed to parse term stats", e);
      }
    }

    const savedDailyId = storage.getItem('it_quiz_last_daily_id');
    if (savedDailyId) setLastDailyChallengeId(savedDailyId);

    const savedDailyStreak = storage.getItem('it_quiz_daily_streak');
    if (savedDailyStreak) setDailyStreak(parseInt(savedDailyStreak, 10));

    setIsLoaded(true);
  }, []);

  // Save stats
  useEffect(() => {
    if (!isLoaded) return;
    storage.setItem('it_quiz_stats', JSON.stringify(stats));
  }, [stats, isLoaded]);

  // Save collection
  useEffect(() => {
    if (!isLoaded) return;
    const idBasedCollection: Record<number, number> = {};
    Object.entries(ownedCards).forEach(([termName, count]) => {
      const term = allTermsMap[termName];
      if (term) idBasedCollection[term.id] = count;
    });
    storage.setItem('it_quiz_collection', JSON.stringify(idBasedCollection));
  }, [ownedCards, isLoaded]);

  // Save term stats
  useEffect(() => {
    if (!isLoaded) return;
    const idBasedStats: Record<number, TermStat> = {};
    Object.entries(termStats).forEach(([termName, stat]) => {
      const t = allTermsMap[termName];
      if (t) idBasedStats[t.id] = stat;
    });
    storage.setItem('it_quiz_term_stats', JSON.stringify(idBasedStats));
  }, [termStats, isLoaded]);

  // Save speed star stats
  useEffect(() => {
    if (!isLoaded) return;
    const speedStats = {
      maxCombo: speedStarMaxCombo,
      maxCorrect: speedStarMaxCorrect,
      challenges: speedStarChallenges
    };
    storage.setItem('it_quiz_speed_star_stats', JSON.stringify(speedStats));
  }, [speedStarMaxCombo, speedStarMaxCorrect, speedStarChallenges, isLoaded]);

  // Save daily challenge info
  useEffect(() => {
    if (!isLoaded) return;
    if (lastDailyChallengeId) storage.setItem('it_quiz_last_daily_id', lastDailyChallengeId);
    storage.setItem('it_quiz_daily_streak', dailyStreak.toString());
  }, [lastDailyChallengeId, dailyStreak, isLoaded]);

  // Save quiz count
  useEffect(() => {
    if (!isLoaded) return;
    storage.setItem('it_quiz_count', quizCount.toString());
  }, [quizCount, isLoaded]);

  // Save bonus ticket
  useEffect(() => {
    if (!isLoaded) return;
    storage.setItem('it_quiz_bonus_ticket', hasBonusTicket.toString());
  }, [hasBonusTicket, isLoaded]);

  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
  }, []);

  const saveUserProfile = useCallback((profile: { grade: string; classNum: string; attendanceNum: string; userName: string }) => {
    setUserName(profile.userName);
    setUserProfile({ grade: profile.grade, classNum: profile.classNum, attendanceNum: profile.attendanceNum });
    storage.setItem('it_quiz_username', profile.userName);
    storage.setItem('it_quiz_user_profile', JSON.stringify({ grade: profile.grade, classNum: profile.classNum, attendanceNum: profile.attendanceNum }));
  }, []);

  const updateTermStats = useCallback((term: string, isCorrect: boolean) => {
    if (!term || term === 'undefined' || term === 'null') return;
    setTermStats(prev => {
      const current = prev[term] || { correct: 0, total: 0 };
      return {
        ...prev,
        [term]: {
          correct: Math.min(255, current.correct + (isCorrect ? 1 : 0)),
          total: Math.min(255, current.total + 1)
        }
      };
    });
  }, []);

  const updateStats = useCallback((id: string, newScore: number) => {
    setStats(prev => {
      const currentStats = { ...prev };
      const unitStats = currentStats[id] || { highScore: 0, attempts: 0, totalScore: 0 };
      
      currentStats[id] = {
        highScore: Math.max(unitStats.highScore, newScore),
        attempts: unitStats.attempts + 1,
        totalScore: unitStats.totalScore + newScore
      };
      
      return currentStats;
    });
  }, []);

  const saveCollection = useCallback((newCollection: Record<string, number>) => {
    const cappedCollection: Record<string, number> = {};
    Object.entries(newCollection).forEach(([term, count]) => {
      cappedCollection[term] = Math.min(255, count);
    });
    setOwnedCards(cappedCollection);
  }, []);

  const userLevel = useMemo(() => calculateLevel(ownedCards), [ownedCards]);
  const userLevelProgress = useMemo(() => calculateLevelProgress(ownedCards, userLevel), [ownedCards, userLevel]);

  const weakPoints = useMemo(() => {
    const statsArray = Object.entries(termStats)
      .filter(([name, data]) => name !== 'undefined' && name !== 'null' && (data as TermStat).total > 0)
      .map(([name, data]) => {
        const d = data as TermStat;
        return {
          name,
          rate: (d.correct / d.total) * 100,
          ...d
        };
      });
    
    return statsArray
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 10);
  }, [termStats]);

  const getStatsFor = useCallback((id: string) => {
    return stats[id] || { highScore: 0, attempts: 0, totalScore: 0 };
  }, [stats]);

  const resetAllData = useCallback(() => {
    storage.clear();
    setUserName(null);
    setUserProfile(null);
    setStats({});
    setOwnedCards({});
    setTermStats({});
    setHasBonusTicket(false);
    setQuizCount(0);
    setSpeedStarMaxCombo(0);
    setSpeedStarMaxCorrect(0);
    setSpeedStarChallenges(0);
    setLastDailyChallengeId(null);
    setDailyStreak(0);
  }, []);

  const getMigrationData = useCallback((): MigrationData => {
    return {
      userName,
      userProfile,
      stats,
      ownedCards,
      termStats,
      hasBonusTicket,
      quizCount,
      speedStarStats: {
        maxCombo: speedStarMaxCombo,
        maxCorrect: speedStarMaxCorrect,
        challenges: speedStarChallenges
      },
      dailyStreak,
      lastDailyChallengeId
    };
  }, [userName, userProfile, stats, ownedCards, termStats, hasBonusTicket, quizCount, speedStarMaxCombo, speedStarMaxCorrect, speedStarChallenges, dailyStreak, lastDailyChallengeId]);

  const confirmMigration = useCallback((data: any) => {
    if (data) {
      setUserName(data.userName);
      setUserProfile(data.userProfile);
      setStats(data.stats);
      setOwnedCards(data.ownedCards);
      setTermStats(data.termStats || {});
      setHasBonusTicket(!!data.hasBonusTicket);
      setQuizCount(data.quizCount || 0);
      
      if (data.speedStarStats) {
        setSpeedStarMaxCombo(data.speedStarStats.maxCombo || 0);
        setSpeedStarMaxCorrect(data.speedStarStats.maxCorrect || 0);
        setSpeedStarChallenges(data.speedStarStats.challenges || 0);
      }

      // Save all to storage
      storage.setItem('it_quiz_username', data.userName || '');
      storage.setItem('it_quiz_user_profile', JSON.stringify(data.userProfile || null));
      storage.setItem('it_quiz_stats', JSON.stringify(data.stats || {}));
      storage.setItem('it_quiz_bonus_ticket', (!!data.hasBonusTicket).toString());
      storage.setItem('it_quiz_count', (data.quizCount || 0).toString());
      
      const idBasedCollection: Record<number, number> = {};
      Object.entries(data.ownedCards || {}).forEach(([termName, count]) => {
        const t = allTermsMap[termName];
        if (t) idBasedCollection[t.id] = count as number;
      });
      storage.setItem('it_quiz_collection', JSON.stringify(idBasedCollection));

      if (data.termStats) {
        const idBasedStats: Record<number, TermStat> = {};
        Object.entries(data.termStats).forEach(([termName, stat]) => {
          const t = allTermsMap[termName];
          if (t) idBasedStats[t.id] = stat as TermStat;
        });
        storage.setItem('it_quiz_term_stats', JSON.stringify(idBasedStats));
      }

      if (data.speedStarStats) {
        storage.setItem('it_quiz_speed_star_stats', JSON.stringify(data.speedStarStats));
      }

      if (showToast) {
        showToast("データの移行が完了しました！", "success");
      } else {
        alert("データの移行が完了しました！");
      }
      window.location.reload();
    }
  }, []);

  const rarityStats = useMemo(() => {
    const totals = { UR: 0, SR: 0, R: 0, C: 0 };
    const owned = { UR: 0, SR: 0, R: 0, C: 0 };
    const totalCopies = { UR: 0, SR: 0, R: 0, C: 0 };
    const ownedCopies = { UR: 0, SR: 0, R: 0, C: 0 };
    let hasAnyDuplicate = false;

    Object.keys(allTermsMap).forEach(term => {
      const r = (allTermsMap[term]?.rarity || 'C') as 'UR' | 'SR' | 'R' | 'C';
      if (totals[r] !== undefined) {
        totals[r]++;
        totalCopies[r] += 3;
      }
      if (ownedCards[term]) {
        owned[r]++;
        ownedCopies[r] += Math.min(ownedCards[term], 3);
        if (ownedCards[term] > 1) hasAnyDuplicate = true;
      }
    });

    return { rarityOwned: owned, rarityTotals: totals, rarityOwnedCopies: ownedCopies, rarityTotalCopies: totalCopies, hasAnyDuplicate };
  }, [ownedCards]);

  return {
    userName, setUserName,
    userProfile, setUserProfile,
    stats, setStats,
    ownedCards, setOwnedCards,
    termStats, setTermStats,
    hasBonusTicket, setHasBonusTicket,
    quizCount, setQuizCount,
    speedStarMaxCombo, setSpeedStarMaxCombo,
    speedStarMaxCorrect, setSpeedStarMaxCorrect,
    speedStarChallenges, setSpeedStarChallenges,
    lastDailyChallengeId, setLastDailyChallengeId,
    dailyStreak, setDailyStreak,
    isLoaded,
    userLevel,
    userLevelProgress,
    weakPoints,
    rarityStats,
    saveStats,
    saveUserProfile,
    updateTermStats,
    updateStats,
    saveCollection,
    getStatsFor,
    resetAllData,
    getMigrationData,
    confirmMigration
  };
};
