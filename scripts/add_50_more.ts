import * as fs from 'fs';

let content = fs.readFileSync('src/data/practicalQuestions.ts', 'utf-8');

const endMarker = "\n];";
const endIndex = content.lastIndexOf(endMarker);
if (endIndex !== -1) {
   content = content.substring(0, endIndex);
}

const moreQs = [
  // --- 2-d (20 questions) ---
  { id: 'p-more01', categoryId: '2-d', description: '情報セキュリティの基本的な目的となる3つの要素（CIA）の正しい組み合わせはどれか。', options: ['機密性、完全性、可用性', '機密性、正確性、匿名性', '完全性、正確性、独自性', '可用性、匿名性、確実性'], correctAnswer: '機密性、完全性、可用性', displayType: 'single' },
  { id: 'p-more02', categoryId: '2-d', description: '情報セキュリティにおける「機密性」の説明として最も適切なものはどれか。', options: ['許可された正規の利用者だけが情報にアクセスできること。', '情報が正確であり、内容が不正に書き換えられていないこと。', 'システムを利用したいときにいつでも安全に利用できること。', 'システムが故障しても自動的に復旧するよう備えられていること。'], correctAnswer: '許可された正規の利用者だけが情報にアクセスできること。', displayType: 'single' },
  { id: 'p-more03', categoryId: '2-d', description: '情報セキュリティにおける「可用性」の説明として最も適切なものはどれか。', options: ['許可された人だけが情報を見ることができるようにすること。', '情報が不正に書き換えられず、正確な状態を維持すること。', '利用者が、必要な時にいつでもシステムやデータにアクセスして利用できる状態であること。', '通信中にデータが誰かに盗聴されないように暗号化すること。'], correctAnswer: '利用者が、必要な時にいつでもシステムやデータにアクセスして利用できる状態であること。', displayType: 'single' },
  { id: 'p-more04', categoryId: '2-d', description: 'パスワードの安全性を高めるための対策として、不適切なものはどれか。', options: ['英字（大文字・小文字）、数字、記号を組み合わせて複雑にする。', 'なるべく文字数を多く（長く）する。', '定期的にパスワードを変更しなければならないと思い込み、簡単なパスワード（1234 等）を毎月使い回す。', '複数のサービスで同じパスワードを使い回さない。'], correctAnswer: '定期的にパスワードを変更しなければならないと思い込み、簡単なパスワード（1234 等）を毎月使い回す。', displayType: 'single' },
  { id: 'p-new324', categoryId: '2-d', description: '組織の経営者が、情報セキュリティに対する基本的な考え方や方針を宣言したものを何というか。', options: ['情報セキュリティポリシー', 'プライバシーポリシー', 'コンプライアンス', 'コーポレートガバナンス'], correctAnswer: '情報セキュリティポリシー', displayType: 'single' },
  { id: 'p-new325', categoryId: '2-d', description: 'コンピュータウイルスを防ぐための「ウイルス対策ソフトウェア（アンチウイルスソフト）」に関する正しい説明はどれか。', options: ['一度インストールすれば、更新しなくても半永久的に防ぐことができる。', '日々新しいウイルスが作られるため、ウイルスの定義ファイル（パターンファイル）を常に最新の状態に更新する必要がある。', 'インストールするとコンピュータが壊れるので、使わないほうが良い。', 'すべてのメールの送信を自動的に停止する機能しか持たない。'], correctAnswer: '日々新しいウイルスが作られるため、ウイルスの定義ファイル（パターンファイル）を常に最新の状態に更新する必要がある。', displayType: 'single' },
  { id: 'p-new326', categoryId: '2-d', description: '「フィッシング詐欺」の典型的な手口はどれか。', options: ['実在する金融機関やショッピングサイトを装ったメールを送り、偽のWebサイトに誘導してクレジットカード番号などを入力させる。', 'パソコンの画面に突然「ウイルスに感染しています」と警告を表示し、偽のサポート窓口に電話させてお金を支払わせる。', 'Webサイトの画像を一度クリックしただけで、勝手に登録完了となり高額な料金を請求される。', 'パソコン内のファイルを勝手に暗号化し、元に戻すための身代金（身代金）を要求する。'], correctAnswer: '実在する金融機関やショッピングサイトを装ったメールを送り、偽のWebサイトに誘導してクレジットカード番号などを入力させる。', displayType: 'single' },
  { id: 'p-new327', categoryId: '2-d', description: '他人のネットワークのIDやパスワードを無断で使用して、システムに不正にログインする行為を禁止している法律はどれか。', options: ['不正アクセス禁止法', '著作権法', '個人情報保護法', '特定商取引法'], correctAnswer: '不正アクセス禁止法', displayType: 'single' },
  { id: 'p-new328', categoryId: '2-d', description: '「生体認証（バイオメトリクス認証）」に利用される身体的・行動的特徴として、不適切なものはどれか。', options: ['指紋', '静脈のパターン', '顔の輪郭や目鼻の位置', '暗証番号（PINコード）'], correctAnswer: '暗証番号（PINコード）', displayType: 'single' },
  { id: 'p-new329', categoryId: '2-d', description: 'システムの故障や災害などによってデータが消えてしまうことに備え、別の記憶媒体（外付けHDDなど）にデータを複製しておくことを何というか。', options: ['バックアップ', 'アーカイブ', 'リストア', 'インストール'], correctAnswer: 'バックアップ', displayType: 'single' },
  { id: 'p-new330', categoryId: '2-d', description: '個人を特定できる情報（住所、氏名、生年月日など）を保護するために、企業や団体が守るべきルールを定めた法律はどれか。', options: ['個人情報保護法', '不正アクセス禁止法', '著作権法', '情報公開法'], correctAnswer: '個人情報保護法', displayType: 'single' },
  { id: 'p-new331', categoryId: '2-d', description: '他人のコンピュータに侵入し、データを破壊したり外部に流出させたりする悪意のあるソフトウェアの総称を何というか。', options: ['マルウェア', 'フリーウェア', 'シェアウェア', 'ファームウェア'], correctAnswer: 'マルウェア', displayType: 'single' },
  { id: 'p-new332', categoryId: '2-d', description: 'ファイルの「バックアップ」に関する注意点として適切なものはどれか。', options: ['バックアップ用のデータは、元のデータと同じハードディスクの同じ場所に保存しておくのが最も安全である。', '火災などの災害に備えるため、バックアップデータはパソコン本体とは別の場所（外部やクラウドなど）に保管することが望ましい。', 'バックアップを一度取れば、その後はデータが更新されても取り直す必要は全くない。', 'バックアップは手作業でファイル名を変える以外に方法はない。'], correctAnswer: '火災などの災害に備えるため、バックアップデータはパソコン本体とは別の場所（外部やクラウドなど）に保管することが望ましい。', displayType: 'single' },
  { id: 'p-new333', categoryId: '2-d', description: 'スマホやパソコンのOSやソフトウェアで見つかったセキュリティ上の弱点（欠陥）のことを何というか。', options: ['脆弱性（ぜいじゃくせい）', '耐障害性', '保守性', '完全性'], correctAnswer: '脆弱性（ぜいじゃくせい）', displayType: 'single' },
  { id: 'p-new334', categoryId: '2-d', description: 'インターネット上でクレジットカード番号などの重要なデータを送受信する際に、データを暗号化して盗聴を防ぐための通信技術を何というか。', options: ['SSL/TLS', 'HTML', 'URL', 'Bluetooth'], correctAnswer: 'SSL/TLS', displayType: 'single' },
  { id: 'p-new335', categoryId: '2-d', description: 'ランサムウェアの特徴として適切なものはどれか。', options: ['パソコンのファイルを暗号化して使えなくし、元に戻すことと引き換えに金銭を要求する。', 'キーボードの入力履歴を記録し、パスワードを密かに盗み出す。', '便利なフリーソフトを装って侵入し、裏でこっそり破壊活動を行う。', '大量のメールを送りつけ、メールサーバをパンクさせる。'], correctAnswer: 'パソコンのファイルを暗号化して使えなくし、元に戻すことと引き換えに金銭を要求する。', displayType: 'single' },
  { id: 'p-new336', categoryId: '2-d', description: 'マルウェアの被害を防ぐための日常的な対策として、適切なものをすべて選びなさい。', subDescriptions: ['ア ＯＳやアプリケーションのアップデートをこまめに行い、常に最新の状態に保つ。', 'イ セキュリティソフト（ウイルス対策ソフト）を導入し、有効にしておく。', 'ウ 迷惑メールの添付ファイルは、差出人が不明でもとりあえず開いて確認する。'], options: ['ア、イ', 'イ', 'ア、ウ', 'ア、イ、ウ'], correctAnswer: 'ア、イ', displayType: 'single' },
  { id: 'p-new337', categoryId: '2-d', description: '情報セキュリティポリシーの運用に関するPDCAサイクルのうち、「Check（評価）」にあたる活動はどれか。', options: ['セキュリティ状況の定期的な監査（チェック）を行う。', '従業員にセキュリティ研修を実施する。', '監査結果を受けて、新たな対策を導入する。', 'どのようなセキュリティ対策を行うかの計画を立てる。'], correctAnswer: 'セキュリティ状況の定期的な監査（チェック）を行う。', displayType: 'single' },
  { id: 'p-new338', categoryId: '2-d', description: '「二段階認証（多要素認証）」の目的として最も適切なものはどれか。', options: ['パスワードが盗まれても、スマートフォンへのSMS通知など、別の手段での確認を追加することで不正ログインを防ぐ。', '2つの別々のパスワードを1つの強力なパスワードにまとめる。', 'ログインの速度を2倍にする。', 'ウイルス対策ソフトの検査回数を2回に増やす。'], correctAnswer: 'パスワードが盗まれても、スマートフォンへのSMS通知など、別の手段での確認を追加することで不正ログインを防ぐ。', displayType: 'single' },
  { id: 'p-new339', categoryId: '2-d', description: '他人のパスワードを不正に入手するため、考えうるすべての文字の組み合わせを片っ端から入力して試す攻撃手法を何というか。', options: ['総当たり攻撃（ブルートフォース攻撃）', 'フィッシング', '標的型攻撃', 'ゼロデイ攻撃'], correctAnswer: '総当たり攻撃（ブルートフォース攻撃）', displayType: 'single' },

  // --- 3-a (10 questions) ---
  { id: 'p-new340', categoryId: '3-a', description: 'データ全体を合計して、データの個数で割った値を何というか。', options: ['平均値', '中央値', '最頻値', '分散'], correctAnswer: '平均値', displayType: 'single' },
  { id: 'p-new341', categoryId: '3-a', description: 'データを小さい順（または大きい順）に並べたとき、ちょうど真ん中に位置する値を何というか。', options: ['中央値（メジアン）', '平均値', '最頻値（モード）', '最大値'], correctAnswer: '中央値（メジアン）', displayType: 'single' },
  { id: 'p-new342', categoryId: '3-a', description: 'データの中で、最も多く現れる（度数が最も高い）値を何というか。', options: ['最頻値（モード）', '平均値', '中央値（メジアン）', '分散'], correctAnswer: '最頻値（モード）', displayType: 'single' },
  { id: 'p-new343', categoryId: '3-a', description: '7人の生徒の体重が「45, 48, 50, 52, 55, 59, 65」であった。このデータの中央値はどれか。', options: ['52', '50', '55', '48'], correctAnswer: '52', displayType: 'single' },
  { id: 'p-new344', categoryId: '3-a', description: '次のデータのうち、最頻値が「4」となるのはどれか。', options: ['[1, 2, 3, 4, 4, 4, 5]', '[4, 4, 5, 5, 5, 6, 7]', '[1, 2, 3, 4, 5, 6, 7]', '[3, 3, 3, 4, 5, 6, 7]'], correctAnswer: '[1, 2, 3, 4, 4, 4, 5]', displayType: 'single' },
  { id: 'p-new345', categoryId: '3-a', description: '「国勢調査」のように、調査対象となるすべての人や物を調査する方法を何というか。', options: ['全数調査', '標本調査', '無作為抽出調査', '覆面調査'], correctAnswer: '全数調査', displayType: 'single' },
  { id: 'p-new346', categoryId: '3-a', description: 'テレビの視聴率調査のように、全体（母集団）から一部を無作為に選び出して調査し、全体を推測する方法を何というか。', options: ['標本調査', '全数調査', '悉皆（しっかい）調査', '現地調査'], correctAnswer: '標本調査', displayType: 'single' },
  { id: 'p-new347', categoryId: '3-a', description: 'データの散らばり具合を表す「分散」の説明として、関連が深い語句はどれか。', options: ['平均値からの差（偏差）', '最大値と最小値', 'データの個数', '最も多いデータ'], correctAnswer: '平均値からの差（偏差）', displayType: 'single' },
  { id: 'p-new348', categoryId: '3-a', description: 'データの「最大値」から「最小値」を引いた値を何というか。', options: ['範囲（レンジ）', '標準偏差', '平均値', '最頻値'], correctAnswer: '範囲（レンジ）', displayType: 'single' },
  { id: 'p-new349', categoryId: '3-a', description: '平均値と中央値が大きく異なる場合、どのような理由が考えられるか。', options: ['極端に大きい（または小さい）外れ値が存在している。', 'データがすべて同じ値である。', 'データの数が偶数である。', 'データが完全に左右対称に分布している。'], correctAnswer: '極端に大きい（または小さい）外れ値が存在している。', displayType: 'single' },

  // --- 2-c (10 questions) ---
  { id: 'p-new350', categoryId: '2-c', description: '2進数の「110」を10進数に変換した値はどれか。', options: ['6', '5', '7', '8'], correctAnswer: '6', displayType: 'single' },
  { id: 'p-new351', categoryId: '2-c', description: '10進数の「5」を2進数に変換した値はどれか。', options: ['101', '110', '100', '111'], correctAnswer: '101', displayType: 'single' },
  { id: 'p-new352', categoryId: '2-c', description: '情報量の最小単位で、「0か1か」の2種類の状態を表すことができるものを何というか。', options: ['ビット (bit)', 'バイト (Byte)', 'ピクセル (Pixel)', 'ヘルツ (Hz)'], correctAnswer: 'ビット (bit)', displayType: 'single' },
  { id: 'p-new353', categoryId: '2-c', description: '8ビット（bit）をまとめた情報量の単位を何というか。', options: ['1バイト (Byte)', '1キロバイト (KB)', '1メガバイト (MB)', '1ワード (Word)'], correctAnswer: '1バイト (Byte)', displayType: 'single' },
  { id: 'p-new354', categoryId: '2-c', description: '約1,000メガバイト（正確には1,024MB）に相当する単位はどれか。', options: ['1ギガバイト (GB)', '1テラバイト (TB)', '1キロバイト (KB)', '1ペタバイト (PB)'], correctAnswer: '1ギガバイト (GB)', displayType: 'single' },
  { id: 'p-new355', categoryId: '2-c', description: '2進数の「1000」を10進数に変換した値はどれか。', options: ['8', '10', '16', '4'], correctAnswer: '8', displayType: 'single' },
  { id: 'p-new356', categoryId: '2-c', description: '画像を圧縮して保存する形式のうち、不可逆圧縮（一度圧縮すると元の画質には完全に戻らない）であり、写真の保存などに広く使われるものはどれか。', options: ['JPEG (.jpg)', 'ZIP (.zip)', 'TXT (.txt)', 'CSV (.csv)'], correctAnswer: 'JPEG (.jpg)', displayType: 'single' },
  { id: 'p-new357', categoryId: '2-c', description: '音楽（音声）ファイルにおいて、人間の耳には聞こえにくい音のデータを省いてファイルサイズを小さくする圧縮形式はどれか。', options: ['MP3', 'BMP', 'PDF', 'HTML'], correctAnswer: 'MP3', displayType: 'single' },
  { id: 'p-new358', categoryId: '2-c', description: 'ファイルやフォルダをまとめて圧縮し、一つのファイルにするためによく使われる形式はどれか。', options: ['ZIP', 'JPEG', 'MP3', 'PNG'], correctAnswer: 'ZIP', displayType: 'single' },
  { id: 'p-new359', categoryId: '2-c', description: 'データの圧縮について、圧縮したデータを圧縮前の元の状態に戻す処理を何というか。', options: ['展開（解凍）', 'エンコード', 'フォーマット', 'コンパイル'], correctAnswer: '展開（解凍）', displayType: 'single' },

  // --- 3-b (10 questions) ---
  { id: 'p-new360', categoryId: '3-b', description: '複数の項目のバランス（例えば、国語、数学、英語、理科、社会の成績の偏り）を視覚的に把握するのに適したグラフはどれか。', options: ['レーダーチャート', '折れ線グラフ', '円グラフ', '帯グラフ'], correctAnswer: 'レーダーチャート', displayType: 'single' },
  { id: 'p-new361', categoryId: '3-b', description: 'あるクラスの「通学方法（徒歩、自転車、バス、電車）」の割合（構成比）を示すのに最も適したグラフはどれか。', options: ['円グラフ', '折れ線グラフ', '散布図', 'Zグラフ'], correctAnswer: '円グラフ', displayType: 'single' },
  { id: 'p-new362', categoryId: '3-b', description: '「気温の変化」と「清涼飲料水の売上」のように、2つのデータの間にどのような関連性（相関）があるかを見るためのグラフはどれか。', options: ['散布図', '棒グラフ', 'レーダーチャート', '円グラフ'], correctAnswer: '散布図', displayType: 'single' },
  { id: 'p-new363', categoryId: '3-b', description: '毎日の「気温の推移」や毎月の「売上高の推移」など、時間の経過に伴う変化を示すのに適したグラフはどれか。', options: ['折れ線グラフ', '円グラフ', '散布図', 'レーダーチャート'], correctAnswer: '折れ線グラフ', displayType: 'single' },
  { id: 'p-new364', categoryId: '3-b', description: '複数の店舗の「売上高」のように、大小を単純に比較したいときに適したグラフはどれか。', options: ['棒グラフ', '折れ線グラフ', '円グラフ', '散布図'], correctAnswer: '棒グラフ', displayType: 'single' },
  { id: 'p-new365', categoryId: '3-b', description: '商品ごとの売上高を大きい順に並べた棒グラフと、その累積比率を表す折れ線グラフを合成したグラフはどれか。', options: ['パレート図', 'Zグラフ', '散布図', 'レーダーチャート'], correctAnswer: 'パレート図', displayType: 'single' },
  { id: 'p-new366', categoryId: '3-b', description: '売上上位の商品で全体の大部分の売上を占めていることを把握し、重要度に応じて管理方法を変える「ABC分析」によく用いられるグラフはどれか。', options: ['パレート図', 'Zグラフ', 'レーダーチャート', '円グラフ'], correctAnswer: 'パレート図', displayType: 'single' },
  { id: 'p-new367', categoryId: '3-b', description: '「各月の売上」「売上累計」「移動合計（直近1年間の合計）」の3本の折れ線グラフから構成され、業績の長期的な傾向を把握するのに使われるグラフはどれか。', options: ['Zグラフ', 'パレート図', 'レーダーチャート', '散布図'], correctAnswer: 'Zグラフ', displayType: 'single' },
  { id: 'p-new368', categoryId: '3-b', description: '散布図において、一方のデータが増加すると、もう一方のデータも増加するような傾向が見られる場合、この関係を何というか。', options: ['正の相関', '負の相関', '無相関', '因果関係'], correctAnswer: '正の相関', displayType: 'single' },
  { id: 'p-new369', categoryId: '3-b', description: '散布図において、一方のデータが増加すると、もう一方のデータが減少するような傾向が見られる場合、この関係を何というか。', options: ['負の相関', '正の相関', '無相関', '因果関係'], correctAnswer: '負の相関', displayType: 'single' }
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
console.log('Appended 50 MORE strictly scoped questions.');
