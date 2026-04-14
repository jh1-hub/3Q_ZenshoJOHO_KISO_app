import { useState, useEffect, useMemo } from 'react';
import { storage } from '../lib/storage';
import { allTermsMap } from '../data/quizData';

const idToNameMap: Record<number, string> = {};
Object.values(allTermsMap).forEach(t => idToNameMap[t.id] = t.name);

interface UnitStats {
  highScore: number;
  attempts: number;
  totalScore: number;
}

interface TermStat {
  correct: number;
  total: number;
}

interface TermStats {
  [termName: string]: TermStat;
}

interface GameStats {
  [key: string]: UnitStats;
}

export function useUserData() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ grade: string; classNum: string; attendanceNum: string } | null>(null);
  
  const [termStats, setTermStats] = useState<TermStats>(() => {
    const saved = storage.getItem('it_quiz_term_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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
        return nameBasedStats;
      } catch (e) {
        console.error("Failed to parse term stats", e);
        return {};
      }
    }
    return {};
  });

  const [stats, setStats] = useState<GameStats>({});
  const [ownedCards, setOwnedCards] = useState<Record<string, number>>({});
  
  const [lastDailyChallengeId, setLastDailyChallengeId] = useState<string>(() => {
    return storage.getItem('it_quiz_last_daily_id') || '';
  });
  
  const [dailyStreak, setDailyStreak] = useState<number>(() => {
    const saved = storage.getItem('it_quiz_daily_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [hasBonusTicket, setHasBonusTicket] = useState(false);
  const [quizCount, setQuizCount] = useState(0);
  
  const [speedStarMaxCombo, setSpeedStarMaxCombo] = useState(0);
  const [speedStarMaxCorrect, setSpeedStarMaxCorrect] = useState(0);
  const [speedStarChallenges, setSpeedStarChallenges] = useState(0);

  const [isLoaded, setIsLoaded] = useState(false);

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
    setIsLoaded(true);
  }, []);

  const saveCollection = (newCollection: Record<string, number>) => {
    const cappedCollection: Record<string, number> = {};
    Object.entries(newCollection).forEach(([term, count]) => {
      cappedCollection[term] = Math.min(255, count);
    });
    setOwnedCards(cappedCollection);
    
    const idBasedCollection: Record<number, number> = {};
    Object.entries(cappedCollection).forEach(([termName, count]) => {
      const term = Object.values(allTermsMap).find(t => t.name === termName);
      if (term) {
        idBasedCollection[term.id] = count;
      }
    });
    storage.setItem('it_quiz_collection', JSON.stringify(idBasedCollection));
  };

  const saveTermStats = (newStats: TermStats) => {
    setTermStats(newStats);
    const idBasedStats: Record<number, TermStat> = {};
    Object.entries(newStats).forEach(([termName, stat]) => {
      const term = Object.values(allTermsMap).find(t => t.name === termName);
      if (term) {
        idBasedStats[term.id] = stat;
      }
    });
    storage.setItem('it_quiz_term_stats', JSON.stringify(idBasedStats));
  };

  const userLevel = useMemo(() => {
    const totalCards = Object.values(ownedCards).reduce((sum, count) => sum + count, 0);
    const uniqueCards = Object.keys(ownedCards).length;
    const totalCorrect = Object.values(termStats).reduce((sum, stat) => sum + stat.correct, 0);
    const scorePoints = Object.values(stats).reduce((sum, stat) => sum + stat.highScore, 0) / 1000;
    
    let level = 1 + Math.floor(
      (totalCards * 0.5) + 
      (uniqueCards * 2) + 
      (totalCorrect * 0.1) + 
      (scorePoints * 0.5) +
      (speedStarMaxCorrect * 2) +
      (speedStarMaxCombo * 1) +
      (dailyStreak * 5)
    );
    
    return Math.min(level, 100);
  }, [ownedCards, termStats, stats, speedStarMaxCorrect, speedStarMaxCombo, dailyStreak]);

  return {
    userName, setUserName,
    userProfile, setUserProfile,
    termStats, saveTermStats,
    stats, setStats,
    ownedCards, saveCollection,
    lastDailyChallengeId, setLastDailyChallengeId,
    dailyStreak, setDailyStreak,
    hasBonusTicket, setHasBonusTicket,
    quizCount, setQuizCount,
    speedStarMaxCombo, setSpeedStarMaxCombo,
    speedStarMaxCorrect, setSpeedStarMaxCorrect,
    speedStarChallenges, setSpeedStarChallenges,
    isLoaded,
    userLevel
  };
}
