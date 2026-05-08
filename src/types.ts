export type Rarity = 'C' | 'R' | 'SR' | 'UR';

export interface TermData {
  id: number;
  name: string;
  descriptions: string[];
  rarity: Rarity;
  flavorTexts: string[];
}

export interface Subcategory {
  id: string;
  title: string;
  terms: TermData[];
}

export interface Category {
  id: string;
  title: string;
  subcategories: Subcategory[];
}

export type QuestionType = 'TERM_TO_DESC' | 'DESC_TO_TERM' | 'PRACTICAL';

export type QuestionDisplayType = 'single' | 'multiple';

export interface Question {
  id?: string;
  term: string; // For practical questions, this might be a category or a representative term
  description: string;
  subDescriptions?: string[]; // For items like "ア", "イ", "ウ"
  correctAnswer: string | string[]; // String for single, Array for multiple
  options: string[];
  type: 'TERM_TO_DESC' | 'DESC_TO_TERM' | 'PRACTICAL';
  displayType: QuestionDisplayType;
}

export interface PracticalQuestion {
  id: string;
  categoryId: string;
  description: string;
  subDescriptions?: string[];
  options: string[];
  correctAnswer: string | string[];
  displayType: QuestionDisplayType;
}

export interface UnitStats {
  highScore: number;
  attempts: number;
  totalScore: number;
}

export type GameStats = Record<string, UnitStats>;

export interface TermStat {
  correct: number;
  total: number;
}

export type TermStats = Record<string, TermStat>;
