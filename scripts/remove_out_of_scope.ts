import fs from 'fs';
import path from 'path';

const practicalFile = path.join(process.cwd(), 'src/data/practicalQuestions.ts');

let content = fs.readFileSync(practicalFile, 'utf8');

const idsToRemove = [
  'p-new84', 'p-new86', 'p-new87', 'p-new94', 'p-new95', 'p-new96', 'p-new105', 'p-new106',
  'p-new107', 'p-new108', 'p-new109', 'p-new116', 'p-new117', 'p-new126', 'p-new134', 'p-new135',
  'p-new140', 'p-new160', 'p-new161', 'p-new162', 'p-new164', 'p-new165',
  'p-new250', 'p-new291', 'p-new293', 'p-new295', 'p-new297', 'p-new298', 'p-new299',
  'p-new300', 'p-new319', 'p-new337', 'p-new365', 'p-new366', 'p-new367', 'p-new370',
  'p-new377', 'p-new378', 'p-new440', 'p-new441', 'p-new715', 'p-new716'
];

idsToRemove.forEach(id => {
  const regex = new RegExp(`\\s*\\{\\s*id:\\s*'${id}'[\\s\\S]*?\\}(,|(?=\\]))`, 'g');
  const count = (content.match(regex) || []).length;
  if(count > 0) {
    content = content.replace(regex, '');
    console.log(`Removed ${id}`);
  }
});

// String replacements for spread sheet options
content = content.replace(/表計算ソフトウェアを使って、家計簿や売上管理表を作成する。/g, 'プレゼンテーションソフトウェアを使って、発表用の資料を作成する。');
content = content.replace(/データをカンマ区切りで保存した、表計算ソフトウェアなどで読み込めるファイル/g, 'データをカンマ区切りで保存した、様々なアプリケーションで読み込めるファイル');
content = content.replace(/'表計算ソフトウェア'/g, "'プレゼンテーションソフトウェア'");
content = content.replace(/イ 表計算ソフト/g, "イ プレゼンテーションソフト");
content = content.replace(/ワープロや表計算などの具体的な業務処理を専門に行う。/g, 'ワープロや画像編集などの具体的な業務処理を専門に行う。');

// Check for any remaining '表計算'
if(content.includes('表計算')) {
  console.log('WARNING: Still found 表計算 in the file');
}

// Remove trailing commas if any left before closing brackets
content = content.replace(/,\\s*\\]/g, '\n]');

fs.writeFileSync(practicalFile, content, 'utf8');
console.log('Cleanup completed.');
