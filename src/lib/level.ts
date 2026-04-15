import { allTerms } from '../data/quizData';

/**
 * Calculates the user level based on the collection of cards.
 * @param collection Record of term names to the number of copies owned.
 * @returns User level (1-99).
 */
export const calculateLevel = (collection: Record<string, number>): number => {
  const totalPoints = Object.values(collection).reduce((sum: number, count: number) => sum + Math.min(3, count), 0);
  // Max points = allTerms.length * 3
  const maxPoints = allTerms.length * 3;
  
  if (totalPoints === 0) return 1;
  // Level = 1 + floor(98 * (points / maxPoints)^0.68)
  const level = 1 + Math.floor(98 * Math.pow(totalPoints / maxPoints, 0.68));
  return Math.min(99, level);
};

/**
 * Calculates the progress towards the next level.
 * @param collection Record of term names to the number of copies owned.
 * @param currentLevel The current user level.
 * @returns Progress value (0-1).
 */
export const calculateLevelProgress = (collection: Record<string, number>, currentLevel: number): number => {
  const totalPoints = Object.values(collection).reduce((sum: number, count: number) => sum + Math.min(3, count), 0);
  const maxPoints = allTerms.length * 3;
  
  if (totalPoints === 0) return 0;
  if (currentLevel >= 99) return 1;

  const getPointsForLevel = (L: number): number => {
    if (L <= 1) return 0;
    return Math.ceil(maxPoints * Math.pow((L - 1) / 98, 1 / 0.68));
  };

  const currentLevelPoints = getPointsForLevel(currentLevel);
  const nextLevelPoints = getPointsForLevel(currentLevel + 1);
  
  const progress = (totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints);
  return Math.max(0, Math.min(1, progress));
};
