import * as fs from 'fs';

let existingContent = fs.readFileSync('src/data/practicalQuestions.ts', 'utf8');

const replacements: Record<string, any> = {
  'p-new441': { id: 'p-new441', categoryId: '3-c', description: 'システム開発において、要件を満たすためにプログラムの構造や画面の流れを決める工程はどれか。', options: ['外部設計', '結合テスト', 'コーディング', '運用・保守'], correctAnswer: '外部設計', displayType: 'single' },
  'p-new496': { id: 'p-new496', categoryId: '3-c', description: 'データベースにおいて、データの重複や矛盾を防ぐために、表（テーブル）を適切な形に分割・整理する作業を何というか。', options: ['正規化', '暗号化', '初期化', '最適化'], correctAnswer: '正規化', displayType: 'single' },
  'p-new549': { id: 'p-new549', categoryId: '3-c', description: '関係データベース（リレーショナルデータベース）で、複数の表を関連付けるための共通の項目を何というか。', options: ['キー（主キー・外部キー）', 'ディレクトリ', 'プロトコル', 'タグ'], correctAnswer: 'キー（主キー・外部キー）', displayType: 'single' },
  'p-new590': { id: 'p-new590', categoryId: '3-c', description: 'データベースの操作言語であるSQLにおいて、データを「検索（抽出）」するための命令はどれか。', options: ['SELECT', 'UPDATE', 'INSERT', 'DELETE'], correctAnswer: 'SELECT', displayType: 'single' },
  'p-new595': { id: 'p-new595', categoryId: '3-c', description: 'プログラムの不具合（バグ）を見つけて修正する作業を何というか。', options: ['デバッグ', 'コンパイル', 'インストール', 'バックアップ'], correctAnswer: 'デバッグ', displayType: 'single' },
  'p-new599': { id: 'p-new599', categoryId: '3-c', description: 'システム開発のV字モデルにおいて、「単体テスト」で確認する主な対象はどれか。', options: ['プログラムの最小単位（モジュールや関数）単体', '複数のプログラムを組み合わせた連携部分', 'システム全体とユーザーの要件', '開発にかかった総コスト'], correctAnswer: 'プログラムの最小単位（モジュールや関数）単体', displayType: 'single' }
};

for (const [id, q] of Object.entries(replacements)) {
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

    const regex = new RegExp(`{\\s*id:\\s*'${id}'[\\s\\S]*?(?=}, {\\s*id:|\\}\\s*\\];)`, 'g');
    existingContent = existingContent.replace(regex, qStr.trim());
}

// Ensure proper syntax closing array
fs.writeFileSync('src/data/practicalQuestions.ts', existingContent);
console.log('Replaced more spreadsheet questions.');
