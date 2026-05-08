import * as fs from 'fs';

const practicalFile = 'src/data/practicalQuestions.ts';
let content = fs.readFileSync(practicalFile, 'utf8');

const missingQs = [
  {
    id: 'p-new84',
    categoryId: '3-c',
    description: '現状の「強み」「弱み」「機会」「脅威」の4つの外部・内部環境を分析し、戦略を立てる手法を何というか。',
    options: ['SWOT分析', 'ABC分析', '3C分析', 'PEST分析'],
    correctAnswer: 'SWOT分析',
    displayType: 'single'
  },
  {
    id: 'p-new94',
    categoryId: '3-c',
    description: '複数の条件の組み合わせによって、どのような動作（処理）を行うべきかを整理した表を何というか。',
    options: ['デシジョンテーブル（決定表）', '特性要因図', 'フローチャート', '状態遷移図'],
    correctAnswer: 'デシジョンテーブル（決定表）',
    displayType: 'single'
  },
  {
    id: 'p-new160',
    categoryId: '3-c',
    description: 'ロジカルシンキングにおいて、情報の「抜け」や「漏れ」がなく、かつ「ダブり」がない分類の状態を表す言葉はどれか。',
    options: ['MECE（ミーシー）', 'PDCA', 'KJ法', 'ABC分析'],
    correctAnswer: 'MECE（ミーシー）',
    displayType: 'single'
  },
  {
    id: 'p-new108',
    categoryId: '3-c',
    description: '問題（結果）とその要因を魚の骨のような図で整理し、原因を追求する手法を何というか。',
    options: ['特性要因図（フィッシュボーンチャート）', 'パレート図', 'デシジョンテーブル', 'ロジックツリー'],
    correctAnswer: '特性要因図（フィッシュボーンチャート）',
    displayType: 'single'
  },
  {
    id: 'p-new134',
    categoryId: '3-c',
    description: 'SWOT分析を用いて戦略を導き出すため、自社の「強み」と外部環境の「機会」を掛け合わせて考える分析を「クロスSWOT分析」という。この目的に最も近いものはどれか。',
    options: ['自社にとってのビジネスチャンスを最大化する。', '弱みを克服してピンチを切り抜ける。', '脅威が去るのを待つ。', '競合他社を吸収合併する。'],
    correctAnswer: '自社にとってのビジネスチャンスを最大化する。',
    displayType: 'single'
  }
];

function formatQuestion(q: any): string {
    let qStr = `  {\n    id: '${q.id}',\n    categoryId: '${q.categoryId}',\n    description: '${q.description}',\n`;
    qStr += `    options: [\n      ${q.options.map((o: string) => `'${o}'`).join(',\n      ')}\n    ],\n`;
    qStr += `    correctAnswer: '${q.correctAnswer}',\n`;
    qStr += `    displayType: '${q.displayType}'\n  }`;
    return qStr;
}

// Check if IDs already exist to avoid duplicates
const existingIds = content.match(/id:\s*'([^']+)'/g)?.map(m => m.match(/'([^']+)'/)?.[1]) || [];

for (const q of missingQs) {
    if (existingIds.includes(q.id)) {
        console.log(`ID ${q.id} already exists. Skipping.`);
        continue;
    }
    const qStr = formatQuestion(q);
    content = content.replace(/\n];\n?$/, `,\n${qStr}\n];\n`);
    console.log(`Added missing question ${q.id}`);
}

fs.writeFileSync(practicalFile, content);
console.log('Final missing business questions added.');
