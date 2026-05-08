import * as fs from 'fs';

let content = fs.readFileSync('src/data/practicalQuestions.ts', 'utf-8');

const endMarker = "\n];";
const endIndex = content.lastIndexOf(endMarker);
if (endIndex !== -1) {
   content = content.substring(0, endIndex);
}

const moreQs = [
  // --- 1-c (10 questions) ---
  { id: 'p-new420', categoryId: '1-c', description: '個人の思想や感情が表現された文章、音楽、絵画などの著作物を、著作者の許可なく勝手に使用・複製することを防ぐ目的を持つ法律はどれか。', options: ['著作権法', '特許法', '個人情報保護法', '不正アクセス禁止法'], correctAnswer: '著作権法', displayType: 'single' },
  { id: 'p-new421', categoryId: '1-c', description: '他人が撮影した写真や描いたイラストを、自分のブログなどで「引用」として合法的に使用するための条件として、不適切なものはどれか。', options: ['すでに公表されている著作物であること。', '自分の文章（主）と引用部分（従）の区別が明確であること。', '出所（引用元）を明記すること。', '引用部分だけを少し書き換えて、自分のオリジナル作品のように見せること。'], correctAnswer: '引用部分だけを少し書き換えて、自分のオリジナル作品のように見せること。', displayType: 'single' },
  { id: 'p-new422', categoryId: '1-c', description: 'インターネット上で公開されているフリーソフトウェアについての説明として正しいものはどれか。', options: ['無料で利用できるが、著作権が放棄されているとは限らないため、利用規約に従う必要がある。', '無料で利用できるものはすべて著作権が放棄されているため、自由に改造して有料で販売してよい。', '利用するためには、必ず作者に手紙を書いて許可をもらう必要がある。', '一度ダウンロードしたら、他の人にメールで添付して無制限に配らなければならない。'], correctAnswer: '無料で利用できるが、著作権が放棄されているとは限らないため、利用規約に従う必要がある。', displayType: 'single' },
  { id: 'p-new423', categoryId: '1-c', description: '特定の個人を識別できる情報（氏名、生年月日、住所など）の不適切な取り扱いから個人の権利を守るための法律はどれか。', options: ['個人情報保護法', 'プロバイダ責任制限法', '著作権法', '不正アクセス禁止法'], correctAnswer: '個人情報保護法', displayType: 'single' },
  { id: 'p-new424', categoryId: '1-c', description: 'WebサイトやSNSで、氏名が書かれていなくても「個人情報」に該当する可能性が最も高いものはどれか。', options: ['「〇〇大学の××サークルで昨日飲み会をしたA君」など、他の情報と組み合わせることで個人が特定できる書き込み。', '「今日の天気は晴れだった」という日記。', '「猫はかわいい」という一般的な感想。', '誰もが知っている有名な観光地の風景写真。'], correctAnswer: '「〇〇大学の××サークルで昨日飲み会をしたA君」など、他の情報と組み合わせることで個人が特定できる書き込み。', displayType: 'single' },
  { id: 'p-new425', categoryId: '1-c', description: '著作者に無断で音楽や動画をインターネット上にアップロードし、不特定多数の人がダウンロードできるようにする行為について、正しい説明はどれか。', options: ['著作権の侵害（公衆送信権などの侵害）にあたり、違法である。', '誰でも見られるようにしているので親切な行為であり、違法ではない。', 'お金をとっていなければ（無料で公開していれば）違法ではない。', 'アップロードした人が10代であれば違法ではない。'], correctAnswer: '著作権の侵害（公衆送信権などの侵害）にあたり、違法である。', displayType: 'single' },
  { id: 'p-new426', categoryId: '1-c', description: '他人のIDやパスワードを勝手に入力して、SNSやオンラインゲームに不正にログインする行為を禁止している法律はどれか。', options: ['不正アクセス禁止法', '著作権法', '個人情報保護法', '特定商取引法'], correctAnswer: '不正アクセス禁止法', displayType: 'single' },
  { id: 'p-new427', categoryId: '1-c', description: 'SNSでの情報発信に関する注意点として、最も不適切なものはどれか。', options: ['一度発信した情報は、すぐに消せば誰の記録にも残ることは絶対にない。', '匿名のアカウントであっても、誹謗中傷などを行えば発信者が特定され、責任を問われることがある。', '旅行中に「今〇〇にいます！」とリアルタイムで投稿し続けると、空き巣の標的になる危険性がある。', '他人の顔がはっきりと写っている写真を無断で投稿すると、肖像権やプライバシーの侵害になる可能性がある。'], correctAnswer: '一度発信した情報は、すぐに消せば誰の記録にも残ることは絶対にない。', displayType: 'single' },
  { id: 'p-new428', categoryId: '1-c', description: 'インターネット掲示板などで、他人の名誉を傷つけるようなウソの書き込みを行ったり、誹謗中傷を行ったりした場合に問われる可能性のある罪や責任として、適切な組み合わせを選びなさい。', subDescriptions: ['ア. 名誉毀損罪や侮辱罪などの刑事責任', 'イ. 損害賠償を求められるなどの民事責任', 'ウ. 警察署長賞の受賞対象'], options: ['ア、イ', 'ア、ウ', 'イ、ウ', 'ア、イ、ウ'], correctAnswer: 'ア、イ', displayType: 'single' },
  { id: 'p-new429', categoryId: '1-c', description: '新しい発明（アイデア）など技術的なアイデアや技術を保護するための法律はどれか。', options: ['特許法', '著作権法', '意匠法', '商標法'], correctAnswer: '特許法', displayType: 'single' },

  // --- 2-a (10 questions) ---
  { id: 'p-new430', categoryId: '2-a', description: 'コンピュータを構成する「五大装置」に含まれないものはどれか。', options: ['電源装置', '演算装置', '記憶装置', '入力装置'], correctAnswer: '電源装置', displayType: 'single' },
  { id: 'p-new431', categoryId: '2-a', description: 'コンピュータの五大装置のうち、プログラムやデータを一時的に、あるいは長期的に保存するための装置はどれか。', options: ['記憶装置', '制御装置', '演算装置', '出力装置'], correctAnswer: '記憶装置', displayType: 'single' },
  { id: 'p-new432', categoryId: '2-a', description: 'キーボードやマウスなど、コンピュータにデータや指示を取り込むための装置を何というか。', options: ['入力装置', '出力装置', '記憶装置', '演算装置'], correctAnswer: '入力装置', displayType: 'single' },
  { id: 'p-new433', categoryId: '2-a', description: 'ディスプレイやプリンタなど、コンピュータが処理した結果を人間の目に見える形で提示するための装置を何というか。', options: ['出力装置', '入力装置', '記憶装置', '制御装置'], correctAnswer: '出力装置', displayType: 'single' },
  { id: 'p-new434', categoryId: '2-a', description: 'CPU（中央処理装置）は、五大装置のうちのどの2つの装置の役割を担っているか。', options: ['演算装置と制御装置', '入力装置と出力装置', '記憶装置と演算装置', '制御装置と記憶装置'], correctAnswer: '演算装置と制御装置', displayType: 'single' },
  { id: 'p-new435', categoryId: '2-a', description: '現在実行中のプログラムやデータを一時的に記憶しておくための「主記憶装置」として広く使われている半導体メモリはどれか。', options: ['RAM (Random Access Memory)', 'ROM (Read Only Memory)', 'HDD (Hard Disk Drive)', 'SSD (Solid State Drive)'], correctAnswer: 'RAM (Random Access Memory)', displayType: 'single' },
  { id: 'p-new436', categoryId: '2-a', description: '電源を切ってもデータが消えない「補助記憶装置」のうち、磁気ディスクを利用して大容量のデータを安価に保存できるものはどれか。', options: ['HDD (Hard Disk Drive)', 'SSD (Solid State Drive)', 'RAM', 'CPU'], correctAnswer: 'HDD (Hard Disk Drive)', displayType: 'single' },
  { id: 'p-new437', categoryId: '2-a', description: '補助記憶装置の「SSD」の特徴として、HDDと比較した場合に不適切なものはどれか。', options: ['フラッシュメモリを使用しているため、部品の物理的な動作がなく、読み書きが非常に高速である。', '衝撃に強く、ノートパソコンなどの持ち運び用途に適している。', 'HDDと比べて消費電力が大きい。', 'HDDと比べて容量あたりの価格がやや高い傾にある。'], correctAnswer: 'HDDと比べて消費電力が大きい。', displayType: 'single' },
  { id: 'p-new438', categoryId: '2-a', description: 'OS（オペレーティングシステム）の主な役割として、最も不適切なものはどれか。', options: ['ワープロや表計算などの具体的な業務処理を専門に行う。', 'ハードウェア（メモリやCPUなど）やファイルなどの資源を管理する。', 'ユーザーとコンピュータとの仲立ち（インターフェース）を提供する。', '応用ソフトウェアが動作するための土台（プラットフォーム）となる。'], correctAnswer: 'ワープロや表計算などの具体的な業務処理を専門に行う。', displayType: 'single' },
  { id: 'p-new439', categoryId: '2-a', description: 'コンピュータを動かす基本ソフトウェアである「OS」の例として、正しいものをすべて選びなさい。', subDescriptions: ['ア Windows', 'イ macOS', 'ウ iOS', 'エ Android'], options: ['ア、イ', 'ア、ウ', 'イ、ウ', 'ア、イ、ウ、エ'], correctAnswer: 'ア、イ、ウ、エ', displayType: 'single' },

  // --- 3-c (10 questions) ---
  { id: 'p-new440', categoryId: '3-c', description: 'データを表形式で整理し、計算やグラフ作成、分析を行うのに適した応用ソフトウェアを総称して何というか。', options: ['表計算ソフトウェア', 'ワープロソフトウェア', 'プレゼンテーションソフトウェア', 'データベースソフトウェア'], correctAnswer: '表計算ソフトウェア', displayType: 'single' },
  { id: 'p-new441', categoryId: '3-c', description: '表計算ソフトで、行と列が交差する一つ一つの入力欄（マス目）のことを何というか。', options: ['セル', 'シート', 'ブック', 'テーブル'], correctAnswer: 'セル', displayType: 'single' },
  { id: 'p-new442', categoryId: '3-c', description: '表計算ソフトで、セルに入力された数値をもとに自動的に計算を行うための式を何というか。', options: ['関数', '書式', 'マクロ', 'テンプレート'], correctAnswer: '関数', displayType: 'single' },
  { id: 'p-new443', categoryId: '3-c', description: '表計算ソフトの基本関数で、指定した範囲の数値の「合計」を求める関数はどれか。', options: ['SUM関数', 'AVERAGE関数', 'MAX関数', 'COUNT関数'], correctAnswer: 'SUM関数', displayType: 'single' },
  { id: 'p-new444', categoryId: '3-c', description: '表計算ソフトの基本関数で、指定した範囲の数値の「平均値」を求める関数はどれか。', options: ['AVERAGE関数', 'SUM関数', 'MIN関数', 'IF関数'], correctAnswer: 'AVERAGE関数', displayType: 'single' },
  { id: 'p-new445', categoryId: '3-c', description: '表計算ソフトで「=A1+B1」という計算式を入力し、それを下のセルにコピー（オートフィル）したとき、次の行の計算式が「=A2+B2」へと自動的に変化する参照方式を何というか。', options: ['相対参照', '絶対参照', '複合参照', '外部参照'], correctAnswer: '相対参照', displayType: 'single' },
  { id: 'p-new446', categoryId: '3-c', description: '表計算ソフトで、計算式をコピーしても特定のセル（例：消費税率が入力されたセルなど）の参照先を固定したままにするための参照方式を何というか。', options: ['絶対参照', '相対参照', '自動参照', '循環参照'], correctAnswer: '絶対参照', displayType: 'single' },
  { id: 'p-new447', categoryId: '3-c', description: '「もし点数が80点以上なら"合格"、そうでなければ"不合格"」のように、条件によって表示する結果を変えたい場合に使用する関数はどれか。', options: ['IF関数', 'SUM関数', 'COUNT関数', 'VLOOKUP関数'], correctAnswer: 'IF関数', displayType: 'single' },
  { id: 'p-new448', categoryId: '3-c', description: '大量のデータの中から、特定の条件に当てはまるデータ（行）だけを抽出して表示する機能を何というか。', options: ['フィルタ機能', 'ソート（並べ替え）機能', 'グラフ作成機能', 'ピボットテーブル'], correctAnswer: 'フィルタ機能', displayType: 'single' },
  { id: 'p-new449', categoryId: '3-c', description: '表計算ソフトで、例えば「売上金額の多い順（大きい順）」にデータを並べ替えることを何というか。', options: ['降順にソートする', '昇順にソートする', 'ランダムに並べる', 'フィルタをかける'], correctAnswer: '降順にソートする', displayType: 'single' },
  
  // --- 1-a, 1-b, 3-a mix to balance out ---
  { id: 'p-new450', categoryId: '1-a', description: '「シェアリングエコノミー」の例として最も適切なものはどれか。', options: ['個人が使っていない部屋を旅行者に貸し出す民泊サービス。', '企業が自社工場で大量生産した製品をスーパーで販売する。', '新品のCDをレンタルビデオ店で借りる。', 'コンビニエンスストアで弁当を買う。'], correctAnswer: '個人が使っていない部屋を旅行者に貸し出す民泊サービス。', displayType: 'single' },
  { id: 'p-new451', categoryId: '1-a', description: 'インターネットを通じて、不特定多数の人から少額ずつ資金を集める仕組みを何というか。', options: ['クラウドファンディング', 'クラウドコンピューティング', '電子商取引', 'ベンチャーキャピタル'], correctAnswer: 'クラウドファンディング', displayType: 'single' },
  { id: 'p-new452', categoryId: '1-b', description: '誰もが使いやすいWebサイトを作るための指針である「Webアクセシビリティ」の具体的な対応例として、不適切なものはどれか。', options: ['画像には、内容を説明する代替テキスト（alt属性）を設定する。', 'マウス操作だけでなく、キーボードだけでも操作できるようにする。', '文字が読めない人のために、すべてのコンテンツを自動音声で再生するボタンを設ける。', '通信速度を上げるために、画像や動画の画質を限界まで低下させ、文字を一切使わない。'], correctAnswer: '通信速度を上げるために、画像や動画の画質を限界まで低下させ、文字を一切使わない。', displayType: 'single' },
  { id: 'p-new453', categoryId: '1-c', description: 'ソフトウェアやデジタルコンテンツを利用する際に、開発者や提供者が定めている「利用規約」に関する説明として正しいものはどれか。', options: ['利用を開始した時点で、原則として利用規約の内容に同意したとみなされる。', '利用規約は法律ではないので、読まなくてもまったく問題ないし、守る必要もない。', '利用規約に反しても、アカウントが停止されることは絶対にない。', '自分の都合のいいように、利用規約の内容を勝手に書き換えてもよい。'], correctAnswer: '利用を開始した時点で、原則として利用規約の内容に同意したとみなされる。', displayType: 'single' },
  { id: 'p-new454', categoryId: '2-a', description: 'パソコンの周辺機器を接続するための規格で、マウス、キーボード、プリンタ、USBメモリなど非常に多くの機器の接続に使われている標準的なインターフェースはどれか。', options: ['USB', 'HDMI', 'Bluetooth', 'Wi-Fi'], correctAnswer: 'USB', displayType: 'single' },
  { id: 'p-new455', categoryId: '2-b', description: '自宅のパソコンやスマートフォンを、無線（電波）を利用してインターネット（ルータ）に接続するためのデータ通信規格の総称はどれか。', options: ['Wi-Fi (無線LAN)', 'Bluetooth', 'USB', 'HTTP'], correctAnswer: 'Wi-Fi (無線LAN)', displayType: 'single' },
  { id: 'p-new456', categoryId: '3-a', description: 'あるデータの集まりについて、一番小さい値（最小値）、第1四分位数、中央値、第3四分位数、一番大きい値（最大値）の5つの要約統計量を用いて、データの散らばり具合を視覚的に表現したグラフを何というか。', options: ['箱ひげ図', 'ヒストグラム', '散布図', 'レーダーチャート'], correctAnswer: '箱ひげ図', displayType: 'single' },
  { id: 'p-new457', categoryId: '3-b', description: '自社の商品に対する「価格の満足度」と「機能の満足度」のアンケートを5段階評価で集計した。この2つの項目間の傾向（機能に満足している人は価格にも満足しているか等）をみるために最適なグラフはどれか。', options: ['散布図', '円グラフ', '折れ線グラフ', 'レーダーチャート'], correctAnswer: '散布図', displayType: 'single' },
  { id: 'p-new458', categoryId: '3-c', description: '表計算ソフトで、A列が「商品名」、B列が「単価」、C列が「販売数」となっている。D列に「売上（単価×販売数）」を計算させたい。D2セルに入力すべき数式はどれか。', options: ['=B2*C2', '=B2+C2', 'B2*C2', '=SUM(B2,C2)'], correctAnswer: '=B2*C2', displayType: 'single' },
  { id: 'p-new459', categoryId: '3-c', description: '表計算ソフトで、条件に合うデータの「個数」を数える関数はどれか（例：80点以上の生徒が何人いるか）。', options: ['COUNTIF関数', 'SUMIF関数', 'IF関数', 'MAX関数'], correctAnswer: 'COUNTIF関数', displayType: 'single' }
];

content += ",\n" + moreQs.map(q => {
    let qStr = `  {\n    id: '${q.id}',\n    categoryId: '${q.categoryId}',\n    description: '${q.description}',\n`;
    if (q.subDescriptions) {
        qStr += `    subDescriptions: [\n      ${q.subDescriptions.map(s => `'${s}'`).join(',\n      ')}\n    ],\n`;
    }
    qStr += `    options: [\n      ${q.options.map(o => `'${o}'`).join(',\n      ')}\n    ],\n`;
    
    if (Array.isArray(q.correctAnswer)) {
         qStr += `    correctAnswer: [${q.correctAnswer.map(c => `'${c}'`).join(', ')}],\n`;
    } else {
         qStr += `    correctAnswer: '${q.correctAnswer}',\n`;
    }
    
    qStr += `    displayType: '${q.displayType}'\n  }`;
    return qStr;
}).join(",\n") + "\n];\n";

fs.writeFileSync('src/data/practicalQuestions.ts', content);
console.log('Appended 50 MORE questions (batch 2).');

