import { termDescriptions } from "../data/termDescriptions";

export interface Question {
  description: string;
  correctAnswer: string;
  options: string[];
}

/**
 * Generates a question from static data.
 * External API dependency has been removed.
 */
export async function generateQuestion(term: string, allTerms: string[]): Promise<Question> {
  const otherOptions = allTerms
    .filter(t => t !== term)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const options = [term, ...otherOptions].sort(() => 0.5 - Math.random());

  // Check if static descriptions exist for this term
  if (termDescriptions[term]) {
    const patterns = termDescriptions[term];
    const randomDescription = patterns[Math.floor(Math.random() * patterns.length)];
    
    return {
      description: randomDescription,
      correctAnswer: term,
      options: options
    };
  }

  // Fallback if no static description is found (should not happen with complete data)
  return {
    description: `${term}に関する説明文が見つかりませんでした。`,
    correctAnswer: term,
    options: options
  };
}
