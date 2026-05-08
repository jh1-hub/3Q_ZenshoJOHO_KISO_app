import * as fs from 'fs';

let content = fs.readFileSync('src/data/practicalQuestions.ts', 'utf-8');

const endMarker = "\n];";
const endIndex = content.lastIndexOf(endMarker);
if (endIndex !== -1) {
   content = content.substring(0, endIndex);
}

const moreQs = [
  // --- 1-a (10 questions) ---
  { id: 'p-new370', categoryId: '1-a', description: 'POSシステムから得られたデータを活用する目的として、最も不適切なものはどれか。', options: ['天候や曜日ごとの売上傾向を分析し、仕入れの量を調整する。', '売れ筋商品を把握し、目立つ場所に陳列する。', 'どの商品が全く売れていないか（死に筋商品）を把握し、取り扱いをやめる。', '従業員のタイムカードの代わりとして、出退勤の管理のみに使用する。'], correctAnswer: '従業員のタイムカードの代わりとして、出退勤の管理のみに使用する。', displayType: 'single' },
  { id: 'p-new371', categoryId: '1-a', description: '企業がインターネットを利用して消費者向けに商品を販売する電子商取引の形態を何というか。', options: ['B to C (Business to Consumer)', 'B to B (Business to Business)', 'C to C (Consumer to Consumer)', 'G to C (Government to Consumer)'], correctAnswer: 'B to C (Business to Consumer)', displayType: 'single' },
  { id: 'p-new372', categoryId: '1-a', description: '消費者同士がインターネット上のオークションサイトやフリマアプリを利用して取引を行う形態を何というか。', options: ['C to C (Consumer to Consumer)', 'B to C (Business to Consumer)', 'B to B (Business to Business)', 'O2O (Online to Offline)'], correctAnswer: 'C to C (Consumer to Consumer)', displayType: 'single' },
  { id: 'p-new373', categoryId: '1-a', description: '電子マネーの支払い方式のうち、クレジットカードのように後からまとめて料金が請求される方式を何というか。', options: ['ポストペイ方式', 'プリペイド方式', 'デビット方式', 'キャッシュ・オン・デリバリー方式'], correctAnswer: 'ポストペイ方式', displayType: 'single' },
  { id: 'p-new374', categoryId: '1-a', description: '買い物をした瞬間に、自分の銀行口座から即座に代金が引き落とされるカード決済の仕組みを何というか。', options: ['デビットカード', 'クレジットカード', 'プリペイドカード', 'ポイントカード'], correctAnswer: 'デビットカード', displayType: 'single' },
  { id: 'p-new375', categoryId: '1-a', description: '「キャッシュレス決済」が普及することによる店舗側のメリットとして適切な組み合わせを選びなさい。', subDescriptions: ['ア レジでの釣銭の受け渡しミスがなくなり、会計にかかる時間を短縮できる。', 'イ 売上金として手元に現金が多く残るため、銀行に預けに行く手間が増える。', 'ウ 顧客の購買データがデジタル化され、マーケティングに活用しやすくなる。'], options: ['ア、イ', 'ア、ウ', 'イ、ウ', 'ア、イ、ウ'], correctAnswer: 'ア、ウ', displayType: 'single' },
  { id: 'p-new376', categoryId: '1-a', description: 'ICチップが搭載されたクレジットカードのセキュリティ上の利点として正しいものはどれか。', options: ['磁気ストライプカードに比べてデータの偽造やスキミングが困難である。', '暗証番号の入力が一切不要になり、サインだけで必ず決済できる。', '紛失した場合でも、他人が使うことは物理的に絶対に不可能である。', '有効期限が過ぎても自動的に更新され、永遠に使い続けることができる。'], correctAnswer: '磁気ストライプカードに比べてデータの偽造やスキミングが困難である。', displayType: 'single' },
  { id: 'p-new377', categoryId: '1-a', description: '企業間でインターネットを利用して受発注などの取引を行う電子商取引の形態を何というか。', options: ['B to B', 'B to C', 'C to C', 'G to B'], correctAnswer: 'B to B', displayType: 'single' },
  { id: 'p-new378', categoryId: '1-a', description: 'インターネット上で商品の注文や決済を行い、実店舗に足を運ぶきっかけを作るようなマーケティング手法（またはその逆）を何というか。', options: ['O2O (Online to Offline)', 'B to B', 'C to C', 'P2P (Peer to Peer)'], correctAnswer: 'O2O (Online to Offline)', displayType: 'single' },
  { id: 'p-new379', categoryId: '1-a', description: '場所や時間にとらわれず、ICTを活用して柔軟に働く「テレワーク（リモートワーク）」のメリットとして不適切なものはどれか。', options: ['通勤による時間や疲労を軽減でき、育児や介護との両立がしやすくなる。', '全社員が常に同じオフィスに集まる必要がなくなるため、交通費やオフィス維持費を削減できる。', 'オフィスにいる時以上に上司が部下の行動を分刻みで監視しやすくなる。', '災害時でも、インターネット環境があれば事業を継続しやすい。'], correctAnswer: 'オフィスにいる時以上に上司が部下の行動を分刻みで監視しやすくなる。', displayType: 'single' },

  // --- 1-b (10 questions) ---
  { id: 'p-new380', categoryId: '1-b', description: '情報の受け手に正しく意味を伝えるための「情報の構造化」として適切なものはどれか。', options: ['文章を見出し、本文、箇条書きなどに明確に分けて整理する。', '全て同じ大きさの文字で、改行せずに長文を書く。', '関連のない画像をたくさん配置して画面を賑やかにする。', '重要な言葉もそうでない言葉も、全て赤字で強調する。'], correctAnswer: '文章を見出し、本文、箇条書きなどに明確に分けて整理する。', displayType: 'single' },
  { id: 'p-new381', categoryId: '1-b', description: '異なる文化や言語を持つ人でも直感的に理解できるように作られた「図記号」を何というか。', options: ['ピクトグラム', 'タイポグラフィ', 'フローチャート', 'アルゴリズム'], correctAnswer: 'ピクトグラム', displayType: 'single' },
  { id: 'p-new382', categoryId: '1-b', description: '色覚の多様性に配慮したデザイン（カラーユニバーサルデザイン）の工夫として、適切な組み合わせを選びなさい。', subDescriptions: ['ア．赤と緑など、特定の色覚を持つ人にとって見分けにくい色の組み合わせを避ける。', 'イ．グラフなどは色だけでなく、網掛け（模様）や文字による説明を併用する。', 'ウ．文字とその背景色には、明暗の差（コントラスト）をつけないようにする。'], options: ['ア、イ', 'ア、ウ', 'イ、ウ', 'ア、イ、ウ'], correctAnswer: 'ア、イ', displayType: 'single' },
  { id: 'p-new383', categoryId: '1-b', description: 'ポスターなどで、情報を「そろえて（整列させて）」配置する目的として最も適切なものはどれか。', options: ['情報同士の関連性やまとまりが視覚的にわかりやすくなり、すっきりと読みやすくなるため。', '読む人にパズルを解くような楽しさを感じさせるため。', '印刷する際のインクの量を節約するため。', 'コンピューターの処理速度を上げるため。'], correctAnswer: '情報同士の関連性やまとまりが視覚的にわかりやすくなり、すっきりと読みやすくなるため。', displayType: 'single' },
  { id: 'p-new384', categoryId: '1-b', description: '目立たせたい文字や図形がある場合、他の要素との違いを大きくして強調する手法を何というか。', options: ['コントラスト（対比）を強める', 'グルーピング（近接）する', '整列させる', '反復させる'], correctAnswer: 'コントラスト（対比）を強める', displayType: 'single' },
  { id: 'p-new385', categoryId: '1-b', description: '情報デザインの法則の１つで、関連する情報を「近づけて（近接）」配置する効果として正しいものはどれか。', options: ['それらが同じグループや仲間であることが瞬時に伝わる。', '文字が大きく見えるようになる。', '色が鮮やかに見えるようになる。', '情報が重要であると錯覚させることができる。'], correctAnswer: 'それらが同じグループや仲間であることが瞬時に伝わる。', displayType: 'single' },
  { id: 'p-new386', categoryId: '1-b', description: 'フォント（書体）の選び方として、一般的な組み合わせで正しいものを選びなさい。', subDescriptions: ['ア．ゴシック体は、線の太さが一定で見やすいため、見出しやプレゼンのスライドに向いている。', 'イ．明朝体は、筆書きのような「とめ・はね・はらい」があり、長文でも目が疲れにくいため本文に向いている。', 'ウ．ポップ体などの装飾的なフォントは、公式なビジネス文書の本文全てに使うのがふさわしい。'], options: ['ア、イ', 'ア、ウ', 'イ、ウ', 'ア、イ、ウ'], correctAnswer: 'ア、イ', displayType: 'single' },
  { id: 'p-new387', categoryId: '1-b', description: 'Webサイトのレイアウトで、ユーザーが迷わずに目的のページにたどり着けるようにするための仕組みの総称を何というか。', options: ['ナビゲーション', 'アニメーション', 'プログラミング', 'シミュレーション'], correctAnswer: 'ナビゲーション', displayType: 'single' },
  { id: 'p-new388', categoryId: '1-b', description: '図形やイラスト、グラフなどを組み合わせて、データや情報を視覚的にわかりやすく表現したものを何というか。', options: ['インフォグラフィックス', 'ユーザビリティ', 'アクセシビリティ', 'データベース'], correctAnswer: 'インフォグラフィックス', displayType: 'single' },
  { id: 'p-new389', categoryId: '1-b', description: '製品やサービスを利用する上で、高齢者や障害者を含む誰もが利用しやすい状態であることを表す言葉はどれか。', options: ['アクセシビリティ', 'セキュリティ', 'コンプライアンス', 'リテラシー'], correctAnswer: 'アクセシビリティ', displayType: 'single' },

  // --- 2-b (10 questions) ---
  { id: 'p-new390', categoryId: '2-b', description: 'インターネット上で、ドメイン名（例: www.example.com）とIPアドレス（例: 192.0.2.1）を相互に変換する仕組み（システム）を何というか。', options: ['DNS (Domain Name System)', 'DHCP', 'HTTP', 'FTP'], correctAnswer: 'DNS (Domain Name System)', displayType: 'single' },
  { id: 'p-new391', categoryId: '2-b', description: 'ネットワーク上でコンピュータを識別するために、各コンピュータに割り当てられる重複のない番号を何というか。', options: ['IPアドレス', 'MACアドレス', 'ドメイン名', 'プロトコル'], correctAnswer: 'IPアドレス', displayType: 'single' },
  { id: 'p-new392', categoryId: '2-b', description: '電子メールを送信するときに使われるプロトコルはどれか。', options: ['SMTP', 'POP3', 'IMAP', 'HTTP'], correctAnswer: 'SMTP', displayType: 'single' },
  { id: 'p-new393', categoryId: '2-b', description: '電子メールを受信サーバから受け取るときに使われる代表的なプロトコルはどれか。', options: ['POP3', 'SMTP', 'FTP', 'NTP'], correctAnswer: 'POP3', displayType: 'single' },
  { id: 'p-new394', categoryId: '2-b', description: 'インターネットでWebページ（HTMLファイルなど）を送受信するときに使われるプロトコルはどれか。', options: ['HTTP', 'SMTP', 'POP3', 'DNS'], correctAnswer: 'HTTP', displayType: 'single' },
  { id: 'p-new395', categoryId: '2-b', description: 'ネットワーク機器の中で、異なるネットワーク同士（例：家庭内LANとインターネット）を接続し、データの最適な通り道（経路）を選択して中継する機器を何というか。', options: ['ルータ', 'ハブ (HUB)', 'モデム', 'サーバー'], correctAnswer: 'ルータ', displayType: 'single' },
  { id: 'p-new396', categoryId: '2-b', description: '世界中のネットワーク同士が相互に接続され、地球規模で広がっている巨大なコンピュータネットワークを何というか。', options: ['インターネット', 'LAN', 'イントラネット', 'エクストラネット'], correctAnswer: 'インターネット', displayType: 'single' },
  { id: 'p-new397', categoryId: '2-b', description: '企業や学校などが、インターネットに接続するために契約する接続業者のことを何というか。', options: ['プロバイダ (ISP)', '検索エンジン', 'ドメイン', 'キャリア'], correctAnswer: 'プロバイダ (ISP)', displayType: 'single' },
  { id: 'p-new398', categoryId: '2-b', description: 'Webサイトを表示するソフトウェア（ChromeやEdge、Safariなど）を何というか。', options: ['Webブラウザ', 'メーラー', 'エディタ', 'サーチエンジン'], correctAnswer: 'Webブラウザ', displayType: 'single' },
  { id: 'p-new399', categoryId: '2-b', description: 'データを送受信する際、データを小さなかたまりに分割して送る方式を何というか。', options: ['パケット交換方式', '回線交換方式', 'アナログ通信方式', '直接通信方式'], correctAnswer: 'パケット交換方式', displayType: 'single' },

  // --- 2-d (10 questions) ---
  { id: 'p-new400', categoryId: '2-d', description: 'コンピュータウイルスの「潜伏機能」の説明として正しいものはどれか。', options: ['感染後、特定の日時や条件が満たされるまで活動を行わず、ユーザーに気付かれないようにする機能。', '感染したコンピュータの画面に、警告メッセージを常に表示し続ける機能。', 'インターネットを通じて、自身のコピーを他のコンピュータに送信する機能。', 'コンピュータ内のファイルを勝手に暗号化する機能。'], correctAnswer: '感染後、特定の日時や条件が満たされるまで活動を行わず、ユーザーに気付かれないようにする機能。', displayType: 'single' },
  { id: 'p-new401', categoryId: '2-d', description: '情報セキュリティの「完全性」を脅かす事象はどれか。', options: ['Webサイトが何者かに改ざんされ、全く違う内容に書き換えられた。', '顧客のメールアドレスリストが外部に漏えいした。', 'システム障害が発生し、1日中サービスを利用できなかった。', '退職した社員が、競合他社に企画書を渡した。'], correctAnswer: 'Webサイトが何者かに改ざんされ、全く違う内容に書き換えられた。', displayType: 'single' },
  { id: 'p-new402', categoryId: '2-d', description: '社内のネットワークを外部の不正なアクセスから守るために、インターネットと社内ネットワークの境界に設置される「防火壁」の役割を果たすシステムを何というか。', options: ['ファイアウォール', 'ルータ', 'ハブ', 'バックアップ'], correctAnswer: 'ファイアウォール', displayType: 'single' },
  { id: 'p-new403', categoryId: '2-d', description: 'スマートフォンやSNSのログインで、パスワードを入力した後に、SMSで送られてきた確認コードをさらに入力させる仕組みを何というか。', options: ['二段階認証（または多要素認証）', '生体認証', 'シングルサインオン', '暗号化通信'], correctAnswer: '二段階認証（または多要素認証）', displayType: 'single' },
  { id: 'p-new404', categoryId: '2-d', description: 'マルウェアの一種で、一見すると便利なソフトウェアや無害なファイルのように装ってコンピュータに侵入し、後から破壊活動や情報流出を行うものを何というか。', options: ['トロイの木馬', 'ワーム', 'スパイウェア', 'マクロウイルス'], correctAnswer: 'トロイの木馬', displayType: 'single' },
  { id: 'p-new405', categoryId: '2-d', description: '利用者が気付かないうちに、パソコンやスマホから個人情報や利用履歴などを収集し、外部に送信するマルウェアを何というか。', options: ['スパイウェア', 'ワーム', 'ボット', 'ランサムウェア'], correctAnswer: 'スパイウェア', displayType: 'single' },
  { id: 'p-new406', categoryId: '2-d', description: 'システムの運用を妨害することを目的として、大量のデータやリクエストを標的のサーバに送りつけ、サーバをパンク（ダウン）させる攻撃を何というか。', options: ['DoS攻撃（またはDDoS攻撃）', 'フィッシング', 'SQLインジェクション', '総当たり攻撃'], correctAnswer: 'DoS攻撃（またはDDoS攻撃）', displayType: 'single' },
  { id: 'p-new407', categoryId: '2-d', description: '社外にノートパソコンを持ち出す際のセキュリティ対策として、最も適切なものはどれか。', options: ['紛失してもデータを見られないように、パソコンに起動パスワードを設定し、ハードディスクを暗号化する。', '誰に拾われても連絡が来るように、パスワードを書いた付箋を貼っておく。', '会社の重要データはすべてデスクトップ上に保存しておく。', 'ウイルス対策ソフトは重くなるので持ち出し中はオフにする。'], correctAnswer: '紛失してもデータを見られないように、パソコンに起動パスワードを設定し、ハードディスクを暗号化する。', displayType: 'single' },
  { id: 'p-new408', categoryId: '2-d', description: '個人情報保護法において「要配慮個人情報」として、特に慎重な取り扱いが求められるものはどれか。', options: ['病歴や犯罪歴などの情報', '氏名と生年月日', 'メールアドレス', '会社の部署名と内線番号'], correctAnswer: '病歴や犯罪歴などの情報', displayType: 'single' },
  { id: 'p-new409', categoryId: '2-d', description: '特定の企業や組織を狙い、業務関連を装ったウイルス付きメールを送りつけて情報を盗み出そうとする攻撃を何というか。', options: ['標的型攻撃', '総当たり攻撃', 'DoS攻撃', '踏み台攻撃'], correctAnswer: '標的型攻撃', displayType: 'single' },

  // --- 3-a (10 questions) ---
  { id: 'p-new410', categoryId: '3-a', description: '1年間の毎月の売上データを集計した。「月平均」を求めるための正しい計算方法はどれか。', options: ['12ヶ月の売上の合計を12で割る', '12ヶ月の売上の合計を2で割る', '一番売上の多かった月と少なかった月の平均を求める', '12ヶ月の売上の合計を365で割る'], correctAnswer: '12ヶ月の売上の合計を12で割る', displayType: 'single' },
  { id: 'p-new411', categoryId: '3-a', description: 'ある靴屋の1日の販売データを調べたところ、23.5cmの靴が最も多く売れていた。このとき、「23.5cm」は統計学の用語で何と呼ばれるか。', options: ['最頻値', '中央値', '平均値', '最大値'], correctAnswer: '最頻値', displayType: 'single' },
  { id: 'p-new412', categoryId: '3-a', description: 'データを見えやすく整理するため、データをいくつかの区間（階級）に分け、それぞれの区間に当てはまるデータの個数（度数）をまとめた表を何というか。', options: ['度数分布表', 'パレート図', '散布図', '相関表'], correctAnswer: '度数分布表', displayType: 'single' },
  { id: 'p-new413', categoryId: '3-a', description: '度数分布表をグラフにしたもので、横軸に階級、縦軸に度数をとり、柱（長方形）を隙間なく並べたグラフを何というか。', options: ['ヒストグラム', '円グラフ', '折れ線グラフ', 'レーダーチャート'], correctAnswer: 'ヒストグラム', displayType: 'single' },
  { id: 'p-new414', categoryId: '3-a', description: 'あるデータの集団について、データが平均値の周りにどのくらい散らばっているか（ばらつき）を示す基本統計量は「分散」や「標準偏差」のほかに何があるか。', options: ['範囲（レンジ）', '最頻値', '中央値', '度数'], correctAnswer: '範囲（レンジ）', displayType: 'single' },
  { id: 'p-new415', categoryId: '3-a', description: 'データを小さい順に並べ、4等分したときの区切りの値を「四分位数」という。下から25%に位置する値は「第1四分位数」と呼ばれるが、下から50%に位置する値（第2四分位数）は何と同じか。', options: ['中央値', '平均値', '最頻値', '最大値'], correctAnswer: '中央値', displayType: 'single' },
  { id: 'p-new416', categoryId: '3-a', description: '「平均値」「中央値」「最頻値」を総称して、データ全体の特徴（分布の中心）を表す値を何というか。', options: ['代表値', '分散', 'ばらつき', '偏差'], correctAnswer: '代表値', displayType: 'single' },
  { id: 'p-new417', categoryId: '3-a', description: 'A班(5人)とB班(5人)でテストを行った。両班の平均は同じ60点だったが、A班は全員が55〜65点、B班は20〜100点と点がバラバラだった。このとき、どちらの班の方が「分散」が大きいか。', options: ['B班', 'A班', 'どちらも同じ', '分散では比較できない'], correctAnswer: 'B班', displayType: 'single' },
  { id: 'p-new418', categoryId: '3-a', description: '工場で生産した製品から100個を無作為に抜き取って不良品の割合を調べ、その結果から全体の不良品の割合を推定した。この調査方法を何というか。', options: ['標本調査', '全数調査', '国勢調査', '相関分析'], correctAnswer: '標本調査', displayType: 'single' },
  { id: 'p-new419', categoryId: '3-a', description: 'アンケートの自由記述など、数値ではない文章などのデータを収集・分類・分析して意味を見出す調査方法を何というか。', options: ['定性的調査（質的調査）', '定量的調査（量的調査）', '国勢調査', '全数調査'], correctAnswer: '定性的調査（質的調査）', displayType: 'single' }
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
console.log('Appended 50 MORE questions (batch 1).');

