import { allTermsMap } from "../data/quizData";
import { Question, QuestionType } from "../types";

// 関連性の高い単位や同ジャンル用語の優先グループ
const RELATED_UNIT_GROUPS: string[][] = [
  // データ容量単位
  ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'],
  // 時間単位
  ['s', 'ms', 'μs', 'ns', 'ps', 'fs'],
  // 通信速度単位
  ['bps', 'Kbps', 'Mbps', 'Gbps'],
  // 論理演算
  ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'],
  // メモリ・記憶媒体
  ['RAM', 'ROM', 'DRAM', 'SRAM', 'SDRAM', 'フラッシュメモリ', 'SSD', 'HDD'],
  // インタフェース / 規格
  ['CUI', 'GUI'],
  ['IPv4', 'IPv6'],
  ['LAN', 'WAN'],
  ['SaaS', 'PaaS', 'IaaS']
];

/**
 * Generates a question from static data.
 * Prioritizes distractors from unit groups and the same subcategory/pool.
 */
export async function generateQuestion(
  term: string, 
  relatedTerms: string[], 
  fallbackTerms?: string[],
  forcedType?: QuestionType,
  optionCount: number = 5
): Promise<Question> {
  // 1. 同一単位・ジャンルグループの用語があれば優先的にダミープールへ追加
  let priorityDistractors: string[] = [];
  const group = RELATED_UNIT_GROUPS.find(g => g.includes(term));
  if (group) {
    const siblingUnits = group.filter(u => u !== term);
    priorityDistractors = [...siblingUnits].sort(() => 0.5 - Math.random());
  }

  // 2. 残りのディストラクター候補（関連用語およびフォールバック用語）
  let remainingPool = relatedTerms.filter(t => t !== term && !priorityDistractors.includes(t));
  if (fallbackTerms) {
    const additionalTerms = fallbackTerms.filter(t => t !== term && !priorityDistractors.includes(t) && !remainingPool.includes(t));
    remainingPool = [...remainingPool, ...additionalTerms];
  }
  remainingPool.sort(() => 0.5 - Math.random());

  // 優先ダミー（単位仲間等）を先頭に配置
  const distractorPool = [...priorityDistractors, ...remainingPool];

  // 1/3 probability: Question is Term, Options are Descriptions (4 choices)
  // Or forced by parameter
  const isTermQuestion = forcedType ? forcedType === 'TERM_TO_DESC' : Math.random() < 0.33;

  // If options are descriptions, limit to 4 choices. Otherwise use the requested optionCount.
  const actualOptionCount = isTermQuestion ? Math.min(4, optionCount) : optionCount;

  const termData = allTermsMap[term];

  if (isTermQuestion && termData) {
    const patterns = termData.descriptions;
    const correctDescription = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Get distractors (descriptions of other terms)
    const distractors = distractorPool
      .slice(0, actualOptionCount - 1)
      .map(t => {
        const tData = allTermsMap[t];
        const descPatterns = tData ? tData.descriptions : ["説明がありません。"];
        return descPatterns[Math.floor(Math.random() * descPatterns.length)];
      });

    const options = [correctDescription, ...distractors].sort(() => 0.5 - Math.random());

    return {
      term: term,
      description: `${term} の説明として最も適切なものはどれか。`,
      correctAnswer: correctDescription,
      options: options,
      type: 'TERM_TO_DESC',
      displayType: 'single'
    };
  }

  // Standard pattern: Question is Description, Options are Terms
  const otherOptions = distractorPool.slice(0, actualOptionCount - 1); 

  const options = [term, ...otherOptions].sort(() => 0.5 - Math.random());

  // Check if static descriptions exist for this term
  if (termData) {
    const patterns = termData.descriptions;
    const randomDescription = patterns[Math.floor(Math.random() * patterns.length)];
    
    return {
      term: term,
      description: randomDescription,
      correctAnswer: term,
      options: options,
      type: 'DESC_TO_TERM',
      displayType: 'single'
    };
  }

  // Fallback if no static description is found (should not happen with complete data)
  return {
    term: term,
    description: `${term}に関する説明文が見つかりませんでした。`,
    correctAnswer: term,
    options: options,
    type: 'DESC_TO_TERM',
    displayType: 'single'
  };
}

