import * as fs from 'fs';

let content = fs.readFileSync('src/data/practicalQuestions.ts', 'utf8');

const targetIds = [
  'p-new442', 'p-new443', 'p-new444', 'p-new445', 'p-new446',
  'p-new447', 'p-new449', 'p-new458', 'p-new459', 'p-new497',
  'p-new545', 'p-new546', 'p-new646', 'p-new649'
];

const newQuestions = [
  { id: 'p-new442', categoryId: '3-c', description: 'システム開発における「要件定義」の目的として、最も適切なものはどれか。', options: ['利用者がシステムに求める機能や性能を明確にし、開発側と合意すること。', '完成したシステムが正しく動作するかテストすること。', 'プログラムのソースコードを実際に記述すること。', 'システムの画面デザインを詳細に決定すること。'], correctAnswer: '利用者がシステムに求める機能や性能を明確にし、開発側と合意すること。', displayType: 'single' },
  { id: 'p-new443', categoryId: '3-c', description: 'プログラミングにおける「変数」の役割として、最も適切なものはどれか。', options: ['データ（数値や文字）を一時的に記憶しておく「箱」のような役割。', 'インターネット上の別のページに移動するリンクの役割。', 'コンピュータの電源を安全に切るための命令。', '画面の明るさを自動調整する機能。'], correctAnswer: 'データ（数値や文字）を一時的に記憶しておく「箱」のような役割。', displayType: 'single' },
  { id: 'p-new444', categoryId: '3-c', description: 'アルゴリズムにおける「繰り返し処理（ループ）」を説明したものはどれか。', options: ['特定の条件を満たすまで、同じ処理を何度も連続して実行すること。', 'プログラムの中で一度だけ呼び出される特別な処理のこと。', 'データを小さい順や大きい順に並べ替えること。', 'ネットワーク経由で他のコンピュータにデータを送信すること。'], correctAnswer: '特定の条件を満たすまで、同じ処理を何度も連続して実行すること。', displayType: 'single' },
  { id: 'p-new445', categoryId: '3-c', description: 'アルゴリズムにおける「条件分岐」を説明したものはどれか。', options: ['「もしAならばBを実行し、そうでなければCを実行する」というように、状況によって処理を変えること。', 'すべてのデータを順番に最初から最後まで無条件で処理すること。', '2つの別々のプログラムを同時に並行して動かすこと。', '発生したエラーを隠してプログラムを強制終了させること。'], correctAnswer: '「もしAならばBを実行し、そうでなければCを実行する」というように、状況によって処理を変えること。', displayType: 'single' },
  { id: 'p-new446', categoryId: '3-c', description: 'システムテストの手法の一つである「ブラックボックステスト」の説明として、最も適切なものはどれか。', options: ['プログラムの内部構造を気にせず、外部から与えた入力に対して正しい出力が得られるかを確認するテスト。', 'プログラムのソースコードの1行1行を確認し、すべての分岐を通るか検証するテスト。', 'システムを利用する実際の環境を完全に再現して行う最終テスト。', 'システムに意図的に高い負荷をかけ、どこまで耐えられるか限界を調べるテスト。'], correctAnswer: 'プログラムの内部構造を気にせず、外部から与えた入力に対して正しい出力が得られるかを確認するテスト。', displayType: 'single' },
  { id: 'p-new447', categoryId: '3-c', description: '「フローチャート（流れ図）」で使用される「ひし形（◇）」の記号が意味する処理はどれか。', options: ['条件判断（条件による分岐）', '処理の開始・終了', '入力・出力', '一連の処理プロセス'], correctAnswer: '条件判断（条件による分岐）', displayType: 'single' },
  { id: 'p-new449', categoryId: '3-c', description: '情報システム開発で用いられる「アジャイル開発」の特徴として、最も適切なものはどれか。', options: ['短い期間で機能ごとの開発とテストを繰り返し、柔軟に仕様変更に対応する開発手法。', '最初にすべての要件を完全に確定させてから、設計、実装、テストと順番に進める手法。', '一切のテストを行わず、最速でプログラムを完成させる手法。', '外部の企業に開発作業のすべてを丸投げする委託手法。'], correctAnswer: '短い期間で機能ごとの開発とテストを繰り返し、柔軟に仕様変更に対応する開発手法。', displayType: 'single' },
  { id: 'p-new458', categoryId: '3-c', description: '論理演算における「AND（論理積）」の結果が「真（1）」となる条件はどれか。', options: ['入力された値が「すべて」真である場合。', '入力された値の「いずれか一つ」でも真である場合。', '入力された値が「すべて」偽である場合。', '入力された値が真と偽「半分ずつ」である場合。'], correctAnswer: '入力された値が「すべて」真である場合。', displayType: 'single' },
  { id: 'p-new459', categoryId: '3-c', description: '論理演算における「OR（論理和）」の結果が「真（1）」となる条件はどれか。', options: ['入力された値の「いずれか一つ以上」が真である場合。', '入力された値が「すべて」真である場合のみ。', '入力された値が「すべて」偽である場合。', '入力された値がちょうど半分ずつ真と偽である場合。'], correctAnswer: '入力された値の「いずれか一つ以上」が真である場合。', displayType: 'single' },
  { id: 'p-new497', categoryId: '3-c', description: 'モデル化とシミュレーションの目的に関する組み合わせとして、適切なものを選びなさい。', subDescriptions: ['ア. 現実世界の複雑な事象から、重要な要素だけを抜き出して単純化する（モデル化）。', 'イ. コンピュータ上に作成したモデルを用いて、条件を変化させながら実験を行う（シミュレーション）。', 'ウ. シミュレーションを行えば、どのような未曾有の災害でも必ず被害をゼロにできる。'], options: ['ア、イ', 'ア、ウ', 'イ、ウ', 'ア、イ、ウ'], correctAnswer: 'ア、イ', displayType: 'single' },
  { id: 'p-new545', categoryId: '3-c', description: 'システム開発の各工程と内容の組み合わせとして、適切なものを選びなさい。', subDescriptions: ['ア. 要件定義：システムが備えるべき機能や性能を決定する。', 'イ. プログラミング（実装）：設計書をもとに、コンピュータが実行できるプログラム言語で記述する。', 'ウ. テスト：プログラミングされたものが、要求通りに正しく動作するか確認する。'], options: ['ア、イ', 'ア、ウ', 'イ、ウ', 'ア、イ、ウ'], correctAnswer: 'ア、イ、ウ', displayType: 'single' },
  { id: 'p-new546', categoryId: '3-c', description: 'データベースの検索において利用される論理演算の特徴に該当するものをすべて選びなさい。', options: ['AND検索：「キーワードA」かつ「キーワードB」の両方を含むものを絞り込む。', 'OR検索：「キーワードA」または「キーワードB」のどちらか一方でも含むものを広く探す。', 'NOT検索：「キーワードA」を含むが、「キーワードB」は含まないものを除外して探す。', 'XOR検索：すべての検索結果を無作為にシャッフルする。'], correctAnswer: ['AND検索：「キーワードA」かつ「キーワードB」の両方を含むものを絞り込む。', 'OR検索：「キーワードA」または「キーワードB」のどちらか一方でも含むものを広く探す。', 'NOT検索：「キーワードA」を含むが、「キーワードB」は含まないものを除外して探す。'], displayType: 'multiple' },
  { id: 'p-new646', categoryId: '3-c', description: 'プログラミング言語の分類に該当するものをすべて選びなさい。', options: ['機械語（マシン語）：コンピュータ（CPU）が直接理解して実行できる「0と1」の数値だけで構成された言語。', '高水準言語（高級言語）：人間にとって読み書きしやすいように、英語などの自然言語に近い命令語を用いた言語（C言語、Pythonなど）。', 'アセンブリ言語：機械語の命令と一対一に対応する記号（ニーモニック）を用いて記述し、人間にとっての可読性を少し高めた言語。', 'テレパシー言語：キーボードを使わず、人間の脳波を直接読み取ってプログラムを生成する言語。'], correctAnswer: ['機械語（マシン語）：コンピュータ（CPU）が直接理解して実行できる「0と1」の数値だけで構成された言語。', '高水準言語（高級言語）：人間にとって読み書きしやすいように、英語などの自然言語に近い命令語を用いた言語（C言語、Pythonなど）。', 'アセンブリ言語：機械語の命令と一対一に対応する記号（ニーモニック）を用いて記述し、人間にとっての可読性を少し高めた言語。'], displayType: 'multiple' },
  { id: 'p-new649', categoryId: '3-c', description: 'アルゴリズムの代表的な探索処理に該当する組み合わせとして、適切なものを選びなさい。', subDescriptions: ['ア. 線形探索：データの先頭から順番に、目的のデータが見つかるまで一つずつ比較していく方法。', 'イ. 二分探索：あらかじめデータが大小の順に並んでいる配列を対象に、探索範囲を半分に絞り込みながら高速に探す方法。', 'ウ. 乱数探索：データをでたらめに選び続け、偶然目的のデータが当たるのを待つ効率的な一般的な手法。'], options: ['ア、イ', 'ア、ウ', 'イ、ウ', 'ア、イ、ウ'], correctAnswer: 'ア、イ', displayType: 'single' }
];

let updatedContent = content;

for (const newQ of newQuestions) {
  // We need to replace the old block with the new block
  // find the block in practicalQuestions starting with `id: '${newQ.id}'` up to the next `},` or `  }`
  const regex = new RegExp(`{\\s*id:\\s*'${newQ.id}'[\\s\\S]*?(?=}, {\\s*id:|\\}\\s*\\];)`, 'g');
  
  let qStr = `{\n    id: '${newQ.id}',\n    categoryId: '${newQ.categoryId}',\n    description: '${newQ.description}',\n`;
  if (newQ.subDescriptions) {
      qStr += `    subDescriptions: [\n      ${newQ.subDescriptions.map((s: string) => `'${s}'`).join(',\n      ')}\n    ],\n`;
  }
  qStr += `    options: [\n      ${newQ.options.map((o: string) => `'${o}'`).join(',\n      ')}\n    ],\n`;
  
  if (Array.isArray(newQ.correctAnswer)) {
       qStr += `    correctAnswer: [${newQ.correctAnswer.map((c: string) => `'${c}'`).join(', ')}],\n`;
  } else {
       qStr += `    correctAnswer: '${newQ.correctAnswer}',\n`;
  }
  qStr += `    displayType: '${newQ.displayType}'\n  }`;
  
  updatedContent = updatedContent.replace(regex, qStr);
}

fs.writeFileSync('src/data/practicalQuestions.ts', updatedContent);
console.log('Replaced ' + newQuestions.length + ' Excel function questions with general CS/IT questions.');
