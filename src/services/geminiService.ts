import { allTermsMap } from "../data/quizData";

export type QuestionType = 'TERM_TO_DESC' | 'DESC_TO_TERM';

export interface Question {
  description: string;
  correctAnswer: string;
  options: string[];
  type: QuestionType;
}

/**
 * Generates a question from static data.
 * Prioritizes distractors from the same subcategory/pool if provided.
 */
export async function generateQuestion(
  term: string, 
  relatedTerms: string[], 
  fallbackTerms?: string[],
  forcedType?: QuestionType,
  optionCount: number = 5
): Promise<Question> {
  // Try to get distractors from related terms first
  let distractorPool = relatedTerms.filter(t => t !== term);
  
  // If not enough related terms, use fallback terms
  if (distractorPool.length < optionCount && fallbackTerms) {
    const additionalTerms = fallbackTerms.filter(t => t !== term && !distractorPool.includes(t));
    distractorPool = [...distractorPool, ...additionalTerms];
  }

  // 1/3 probability: Question is Term, Options are Descriptions (4 choices)
  // Or forced by parameter
  const isTermQuestion = forcedType ? forcedType === 'TERM_TO_DESC' : Math.random() < 0.33;

  const termData = allTermsMap[term];

  if (isTermQuestion && termData) {
    const patterns = termData.descriptions;
    const correctDescription = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Get distractors (descriptions of other terms)
    const distractors = distractorPool
      .sort(() => 0.5 - Math.random())
      .slice(0, optionCount - 1)
      .map(t => {
        const tData = allTermsMap[t];
        const descPatterns = tData ? tData.descriptions : ["説明がありません。"];
        return descPatterns[Math.floor(Math.random() * descPatterns.length)];
      });

    const options = [correctDescription, ...distractors].sort(() => 0.5 - Math.random());

    return {
      description: `${term} の説明として最も適切なものはどれか。`,
      correctAnswer: correctDescription,
      options: options,
      type: 'TERM_TO_DESC'
    };
  }

  // Standard pattern: Question is Description, Options are Terms
  const otherOptions = distractorPool
    .sort(() => 0.5 - Math.random())
    .slice(0, optionCount - 1); 

  const options = [term, ...otherOptions].sort(() => 0.5 - Math.random());

  // Check if static descriptions exist for this term
  if (termData) {
    const patterns = termData.descriptions;
    const randomDescription = patterns[Math.floor(Math.random() * patterns.length)];
    
    return {
      description: randomDescription,
      correctAnswer: term,
      options: options,
      type: 'DESC_TO_TERM'
    };
  }

  // Fallback if no static description is found (should not happen with complete data)
  return {
    description: `${term}に関する説明文が見つかりませんでした。`,
    correctAnswer: term,
    options: options,
    type: 'DESC_TO_TERM'
  };
}
