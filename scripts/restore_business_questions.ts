import * as fs from 'fs';

const batches = [
  'scripts/add_batch_1.ts',
  'scripts/add_batch_2.ts',
  'scripts/add_batch_3.ts',
  'scripts/add_batch_4.ts',
  'scripts/add_batch_5.ts',
  'scripts/add_batch_6.ts'
];

function extractQuestions(filename: string): any[] {
  if (!fs.existsSync(filename)) return [];
  const data = fs.readFileSync(filename, 'utf8');
  const match = data.match(/const\s+[a-zA-Z0-9_]+\s*=\s*(\[[\s\S]*?\n\]);/);
  if (!match) return [];
  try {
     return eval(match[1]);
  } catch (e) {
     return [];
  }
}

// 復元したい問題のキーワード
const keywords = [
  'ABC分析', 'パレート図', 'Zグラフ', '移動合計', 'PDCA', 
  'KJ法', 'デシジョンテーブル', 'SWOT分析', 'POSシステム',
  'ストラテジ', '経営', 'マーケティング', 'ロジカルシンキング', 'MECE', '意思決定', '業務改善', 'ブレインストーミング'
];

// 除外したいキーワード（表計算の特定操作など）
const excludeKeywords = [
  '相対参照', '絶対参照', 'セル', '範囲', 'SUM関数', 'VLOOKUP', 'IF関数', 'オートフィル'
];

let allQs: any[] = [];
for (const b of batches) {
  allQs.push(...extractQuestions(b));
}

let existingContent = fs.readFileSync('src/data/practicalQuestions.ts', 'utf8');

// すでにファイル内にあるIDを取得
const existingIds = new Set();
const idMatches = existingContent.match(/id:\s*'([^']+)'/g);
if (idMatches) {
  idMatches.forEach(m => {
    const id = m.match(/'([^']+)'/)?.[1];
    if (id) existingIds.add(id);
  });
}

let restoredCount = 0;
const questionsToRestore = allQs.filter(q => {
  if (existingIds.has(q.id)) return false;
  
  const qStr = JSON.stringify(q);
  // キーワードが含まれているかチェック
  const hasKeyword = keywords.some(k => qStr.includes(k));
  // 除外キーワードが含まれていないかチェック
  const isExcluded = excludeKeywords.some(k => qStr.includes(k));
  
  return hasKeyword && !isExcluded;
});

function formatQuestion(q: any): string {
    let qStr = `  {\n    id: '${q.id}',\n    categoryId: '${q.categoryId}',\n    description: '${q.description.replace(/'/g, "\\'")}',\n`;
    if (q.subDescriptions) {
        qStr += `    subDescriptions: [\n      ${q.subDescriptions.map((s: string) => `'${s.replace(/'/g, "\\'")}'`).join(',\n      ')}\n    ],\n`;
    }
    qStr += `    options: [\n      ${q.options.map((o: string) => `'${o.replace(/'/g, "\\'")}'`).join(',\n      ')}\n    ],\n`;
    
    if (Array.isArray(q.correctAnswer)) {
         qStr += `    correctAnswer: [${q.correctAnswer.map((c: string) => `'${c.replace(/'/g, "\\'")}'`).join(', ')}],\n`;
    } else {
         qStr += `    correctAnswer: '${q.correctAnswer.replace(/'/g, "\\'")}',\n`;
    }
    qStr += `    displayType: '${q.displayType}'\n  }`;
    return qStr;
}

for (const q of questionsToRestore) {
    const qStr = formatQuestion(q);
    existingContent = existingContent.replace(/\n];\n?$/, `,\n${qStr}\n];\n`);
    restoredCount++;
}

fs.writeFileSync('src/data/practicalQuestions.ts', existingContent);
console.log(`Restored ${restoredCount} business/data analysis questions.`);
