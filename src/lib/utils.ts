import { quizCategories } from '../data/quizData';
import { Rarity } from '../types';

/**
 * Mapping of terms to unique IDs.
 */
export const termToId = (() => {
  const map: Record<string, string> = {};
  let count = 1;
  quizCategories.forEach(cat => {
    cat.subcategories.forEach(sub => {
      sub.terms.forEach(term => {
        if (!map[term.name]) {
          map[term.name] = count.toString().padStart(3, '0');
          count++;
        }
      });
    });
  });
  return map;
})();

/**
 * Category color mapping.
 */
export const getCategoryColor = (categoryId: string) => {
  switch (categoryId) {
    case '1': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', accent: 'bg-emerald-500', light: 'bg-emerald-100/50' };
    case '2': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', accent: 'bg-blue-500', light: 'bg-blue-100/50' };
    case '3': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', accent: 'bg-amber-500', light: 'bg-amber-100/50' };
    default: return { bg: 'bg-theme-muted', text: 'text-theme-text', border: 'border-theme-border', accent: 'bg-theme-text-muted', light: 'bg-theme-border/50' };
  }
};

/**
 * Rarity styles mapping.
 */
export const getRarityStyles = (rarity: Rarity) => {
  switch (rarity) {
    case 'UR':
      return {
        border: 'border-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]',
        bg: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
        text: 'text-white',
        textColor: 'text-purple-600',
        label: 'Ultra Rare',
        accent: 'bg-theme-card/20',
        glow: 'shadow-[0_0_30px_rgba(236,72,153,0.8)]',
        pulse: 'animate-pulse',
        flash: 'bg-purple-400',
        particles: 20
      };
    case 'SR':
      return {
        border: 'border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]',
        bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        text: 'text-white',
        textColor: 'text-yellow-600',
        label: 'Super Rare',
        accent: 'bg-theme-card/20',
        glow: 'shadow-[0_0_20px_rgba(250,204,21,0.6)]',
        pulse: 'animate-pulse',
        flash: 'bg-yellow-300',
        particles: 15
      };
    case 'R':
      return {
        border: 'border-4 border-blue-400',
        bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        text: 'text-white',
        textColor: 'text-blue-600',
        label: 'Rare',
        accent: 'bg-theme-card/20',
        glow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)]',
        pulse: '',
        flash: 'bg-blue-300',
        particles: 8
      };
    default:
      return {
        border: 'border-4 border-theme-border-strong',
        bg: 'bg-theme-card',
        text: 'text-theme-text',
        textColor: 'text-theme-text-muted',
        label: 'Common',
        accent: 'bg-theme-border',
        glow: '',
        pulse: '',
        flash: 'bg-white',
        particles: 0
      };
  }
};
