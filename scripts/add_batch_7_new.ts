import * as fs from 'fs';

let existingContent = fs.readFileSync('src/data/practicalQuestions.ts', 'utf8');

const newIdStart = 700; // Safe offset
const newQs = [
  // Category 1
  { id: `p-new${newIdStart}`, categoryId: '1-a', description: 'インターネット上で商品の売買を行うにあたり、安全性を高めるための手段として最も適切なものはどれか。', options: ['パスワードを短い数字だけにして覚えやすくする', '通信内容を暗号化するSSL/TLSを導入する', 'すべての顧客データを誰でも閲覧できるように公開する', 'ウイルス対策ソフトをアンインストールする'], correctAnswer: '通信内容を暗号化するSSL/TLSを導入する', displayType: 'single' },
  { id: `p-new${newIdStart+1}`, categoryId: '1-a', description: 'オンラインショッピングにおいて、消費者が商品の評価やレビューを投稿できる仕組みがもたらす効果として、誤っているものはどれか。', options: ['他の消費者が購入を検討する際の参考情報となる。', '販売者が製品やサービスの改善点を見つける手がかりとなる。', '評価の低い商品は、システムによって自動的に法的な罰則が与えられる。', '悪意のある虚偽のレビュー（サクラ）による情報操作のリスクがある。'], correctAnswer: '評価の低い商品は、システムによって自動的に法的な罰則が与えられる。', displayType: 'single' },
  { id: `p-new${newIdStart+2}`, categoryId: '1-b', description: 'Webサイトの「ユーザビリティ（使いやすさ）」を高める工夫として、適切なものをすべて選びなさい。', options: ['リンクであることが一目でわかるように、文字色を変えたり下線を引いたりする。', 'スマートフォンでも見やすいように、画面幅に合わせてレイアウトが変化するデザイン（レスポンシブデザイン）を採用する。', 'デザイン性を高めるため、文字色と背景色の差をなくして読みにくくする。', '現在自分がサイト内のどこにいるかが分かるように「パンくずリスト」を設置する。'], correctAnswer: ['リンクであることが一目でわかるように、文字色を変えたり下線を引いたりする。', 'スマートフォンでも見やすいように、画面幅に合わせてレイアウトが変化するデザイン（レスポンシブデザイン）を採用する。', '現在自分がサイト内のどこにいるかが分かるように「パンくずリスト」を設置する。'], displayType: 'multiple' },
  { id: `p-new${newIdStart+3}`, categoryId: '1-b', description: '情報を視覚的に分かりやすく表現する「インフォグラフィック」のメリットとして、最も適切なものはどれか。', options: ['長文のテキストよりも、直感的にデータの傾向や関係性を把握しやすい。', '文字情報を完全に排除するため、細かいニュアンスが正確に伝わる。', '視覚に障害がある人に対して、最も情報を伝えやすい手段である。', '作成するのにコンピュータやソフトウェアが一切必要ない。'], correctAnswer: '長文のテキストよりも、直感的にデータの傾向や関係性を把握しやすい。', displayType: 'single' },
  { id: `p-new${newIdStart+4}`, categoryId: '1-c', description: 'SNSでの「炎上」を防ぐための心構えとして、適切なものをすべて選びなさい。', options: ['事実かどうか分からない情報は、むやみに拡散（シェアやリツイート）しない。', '感情的になっている時は、すぐに投稿せず少し時間を置いて冷静に見直す。', '公開範囲を「友人限定」にしていれば、何を書いても絶対に流出しないと過信しない。', '匿名のアカウントからであれば、他人の悪口を書いても法的に問われることはない。'], correctAnswer: ['事実かどうか分からない情報は、むやみに拡散（シェアやリツイート）しない。', '感情的になっている時は、すぐに投稿せず少し時間を置いて冷静に見直す。', '公開範囲を「友人限定」にしていれば、何を書いても絶対に流出しないと過信しない。'], displayType: 'multiple' },
  // Category 2
  { id: `p-new${newIdStart+5}`, categoryId: '2-a', description: 'コンピュータの五大装置のうち、キーボードからの入力やメモリからのデータを読み込み、プログラムの命令を解釈して計算や制御を行う中枢の装置（CPU）はどれか。', options: ['演算装置と制御装置', '記憶装置と入力装置', '出力装置と記憶装置', '入力装置と出力装置'], correctAnswer: '演算装置と制御装置', displayType: 'single' },
  { id: `p-new${newIdStart+6}`, categoryId: '2-a', description: 'パソコンの電源を切ると記憶していたデータが消えてしまう（揮発性を持つ）メモリはどれか。', options: ['ROM（リードオンリーメモリ）', 'RAM（ランダムアクセスメモリ）', 'フラッシュメモリ', 'ハードディスク'], correctAnswer: 'RAM（ランダムアクセスメモリ）', displayType: 'single' },
  { id: `p-new${newIdStart+7}`, categoryId: '2-b', description: '複数のコンピュータや機器をつなぎ、それぞれの役割に応じて処理を分担するネットワーク形態のうち、サービスを提供する側と要求する側に役割が分かれているものはどれか。', options: ['クライアントサーバシステム', 'ピアツーピアシステム', 'スタンドアロンシステム', 'メインフレームシステム'], correctAnswer: 'クライアントサーバシステム', displayType: 'single' },
  { id: `p-new${newIdStart+8}`, categoryId: '2-b', description: '無線LAN（Wi-Fi）を利用する際のセキュリティ対策として、最も適切なものはどれか。', options: ['誰でも接続できるように、暗号化設定を無効にしておく。', '通信を暗号化するために、WPA2やWPA3などの強固なセキュリティ規格を設定する。', 'パスワード（暗号化キー）をルーターの側面に大きく書いて誰でも見えるようにしておく。', '有線LANケーブルを使用する。'], correctAnswer: '通信を暗号化するために、WPA2やWPA3などの強固なセキュリティ規格を設定する。', displayType: 'single' },
  { id: `p-new${newIdStart+9}`, categoryId: '2-c', description: 'コンピュータウイルスなどのマルウェアからシステムを守るための対策として、該当するものをすべて選びなさい。', options: ['OSやソフトウェアを常に最新のバージョン（アップデート）に保つ。', '信頼できない送信元からのメールの添付ファイルを安易に開かない。', 'セキュリティ対策ソフト（アンチウイルスソフト）を導入し、定義ファイルを最新にする。', 'ウイルスに感染した疑いがある場合は、他の機器にも感染を広げるためネットワークに接続し続ける。'], correctAnswer: ['OSやソフトウェアを常に最新のバージョン（アップデート）に保つ。', '信頼できない送信元からのメールの添付ファイルを安易に開かない。', 'セキュリティ対策ソフト（アンチウイルスソフト）を導入し、定義ファイルを最新にする。'], displayType: 'multiple' },
  { id: `p-new${newIdStart+10}`, categoryId: '2-c', description: 'インターネット上でパスワードを安全に管理する方法として、適切なものをすべて選びなさい。', options: ['複数のサービスで同じパスワードを使い回さない。', '名前や生年月日など、他人に推測されやすい文字列を避ける。', '英大文字、小文字、数字、記号を組み合わせ、十分な長さ（桁数）にする。', '忘れないように、スマートフォンのケースの裏に付箋で貼っておく。'], correctAnswer: ['複数のサービスで同じパスワードを使い回さない。', '名前や生年月日など、他人に推測されやすい文字列を避ける。', '英大文字、小文字、数字、記号を組み合わせ、十分な長さ（桁数）にする。'], displayType: 'multiple' },
  // Category 3
  { id: `p-new${newIdStart+11}`, categoryId: '3-a', description: '「10進数の 10」を、2進数で表現したものはどれか。', options: ['0110', '1000', '1010', '1100'], correctAnswer: '1010', displayType: 'single' },
  { id: `p-new${newIdStart+12}`, categoryId: '3-a', description: 'アナログデータとデジタルデータの違いについて、正しいものはどれか。', options: ['アナログデータは連続した変化をそのまま表現し、デジタルデータは一定間隔で区切って数値化したものである。', 'アナログデータは劣化がなく、デジタルデータはコピーするたびに劣化する。', 'アナログデータはコンピュータで直接計算でき、デジタルデータはできない。', 'アナログデータは「0と1」だけで表される。'], correctAnswer: 'アナログデータは連続した変化をそのまま表現し、デジタルデータは一定間隔で区切って数値化したものである。', displayType: 'single' },
  { id: `p-new${newIdStart+13}`, categoryId: '3-b', description: '膨大なデータ（ビッグデータ）を分析して、人間の目では気づかない隠れた規則性や相関関係を見つけ出す技術を何というか。', options: ['データマイニング', 'クラウドコンピューティング', 'ブロックチェーン', '仮想現実（VR）'], correctAnswer: 'データマイニング', displayType: 'single' },
  { id: `p-new${newIdStart+14}`, categoryId: '3-b', description: '大量のデータからAI（人工知能）自身がパターンやルールを学習する技術である「機械学習」の活用例として、適切なものをすべて選びなさい。', options: ['購買履歴から、その人が次に買いそうな商品をおすすめ（レコメンド）する。', '大量の画像データから特徴を学習し、写真に写っている物体（犬や猫など）を判別する。', '過去の気象データや交通データを予測し、最適な配送ルートを算出する。', '電卓で「1+1=2」の計算をする。'], correctAnswer: ['購買履歴から、その人が次に買いそうな商品をおすすめ（レコメンド）する。', '大量の画像データから特徴を学習し、写真に写っている物体（犬や猫など）を判別する。', '過去の気象データや交通データを予測し、最適な配送ルートを算出する。'], displayType: 'multiple' },
  { id: `p-new${newIdStart+15}`, categoryId: '3-c', description: 'システム開発の手法において、ウォーターフォールモデルの問題点を補うために、プログラムを小さく分割して「設計・実装・テスト」を短いサイクルで繰り返す手法を何というか。', options: ['アジャイル開発', '順次開発', 'トップダウン手法', 'ブラックボックステスト'], correctAnswer: 'アジャイル開発', displayType: 'single' },
  { id: `p-new${newIdStart+16}`, categoryId: '3-c', description: 'データベースに蓄積されたデータを、企業が経営戦略や意思決定に活用することを指す言葉はどれか。', options: ['BI（ビジネスインテリジェンス）', 'IoT（モノのインターネット）', 'UI（ユーザーインターフェース）', 'OS（オペレーティングシステム）'], correctAnswer: 'BI（ビジネスインテリジェンス）', displayType: 'single' },
  { id: `p-new${newIdStart+17}`, categoryId: '3-c', description: 'システム障害が発生した際に、被害や影響を最小限にとどめ、安全な状態に移行させる設計思想を何というか。', options: ['フェイルセーフ', 'フェールソフト', 'フォールトトレラント', 'フールプルーフ'], correctAnswer: 'フェイルセーフ', displayType: 'single' },
  { id: `p-new${newIdStart+18}`, categoryId: '3-c', description: '利用者が誤った操作をしても、危険な状態にならない（または誤操作させない）ように配慮する設計思想を何というか。', options: ['フールプルーフ', 'フェイルセーフ', 'フェールソフト', 'バックアップ'], correctAnswer: 'フールプルーフ', displayType: 'single' },
  { id: `p-new${newIdStart+19}`, categoryId: '3-c', description: 'プログラムの著作権に関する記述として、最も適切なものはどれか。', options: ['プログラムのソースコードは、著作物として著作権法で保護される。', 'アルゴリズム（計算手順）そのものも著作権法で保護される。', 'プログラム言語自体（C言語やPythonなど）も著作物として独占できる。', '個人で楽しむためであっても、他人が作ったプログラムを複製することは一切禁止されている。'], correctAnswer: 'プログラムのソースコードは、著作物として著作権法で保護される。', displayType: 'single' }
];

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

for (const q of newQs) {
    const qStr = formatQuestion(q);
    existingContent = existingContent.replace(/\n];\n?$/, `,\n${qStr}\n];\n`);
}

fs.writeFileSync('src/data/practicalQuestions.ts', existingContent);
console.log('Added ' + newQs.length + ' completely new general IT questions.');
