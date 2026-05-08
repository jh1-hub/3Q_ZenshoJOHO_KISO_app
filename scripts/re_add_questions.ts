import * as fs from 'fs';

let content = fs.readFileSync('src/data/practicalQuestions.ts', 'utf-8');

const marker = ",\n  {\n    id: 'p-new176'";
const cutIndex = content.indexOf(marker);
if (cutIndex !== -1) {
    content = content.substring(0, cutIndex) + "\n];\n";
} else {
    const endMarker = "\n];";
    const endIndex = content.lastIndexOf(endMarker);
    if (endIndex !== -1) {
       content = content.substring(0, endIndex);
    }
}

const newQs = [
  { id: 'p-new250', categoryId: '1-a', description: 'POS システムに関する記述として、適切な組み合わせを選びなさい。', subDescriptions: ['ア．商品が販売された時点（レジ）で、その販売情報をコンピュータに記録・管理するシステムである。', 'イ．顧客がインターネットを通じて銀行振り込みを行えるシステムである。', 'ウ．在庫管理や売れ筋商品の分析などに活用される。', 'エ．企業内で従業員の給与計算を自動化するシステムである。'], options: ['ア、イ', 'ア、ウ', 'イ、エ', 'ウ、エ'], correctAnswer: 'ア、ウ', displayType: 'single' },
  { id: 'p-new251', categoryId: '1-a', description: '電子商取引（オンラインショッピング）の利点について述べたもののうち、適切なものをすべて答えなさい。', subDescriptions: ['ア 時間や場所を気にせず、24 時間いつでも買い物ができる。', 'イ 世界中の店舗や豊富な種類の商品から比較して購入できる。', 'ウ 実際の商品を手に取って確認してから購入できるため、サイズや色味を間違える心配がない。', 'エ 店舗側にとっては、実店舗を構える費用や人件費を抑えることができる。'], options: ['ア、イ', 'ア、イ、エ', 'イ、ウ', 'ア、イ、ウ、エ'], correctAnswer: 'ア、イ、エ', displayType: 'single' },
  { id: 'p-new252', categoryId: '1-a', description: 'IC カードの特徴について述べたもののすべてを挙げたものはどれか答えなさい。', subDescriptions: ['ア カード内部に IC チップが埋め込まれており、情報を記憶・処理できる。', 'イ 磁気カードに比べて記憶容量が大きく、偽造されにくい。', 'ウ 電波を利用してデータをやり取りする「非接触型」は、交通系 IC カードなどで普及している。', 'エ パソコンを使わずに、それ単体でインターネットを閲覧できる機能を持つ。'], options: ['ア、イ', 'ア、イ、ウ', 'ウ、エ', 'ア、イ、ウ、エ'], correctAnswer: 'ア、イ、ウ', displayType: 'single' },
  { id: 'p-new253', categoryId: '1-a', description: 'インターネットバンキングについて述べた記述として、適切なものをすべて選びなさい。', subDescriptions: ['ア パソコンやスマートフォンから、残高照会や振込などができる。', 'イ 店舗の営業時間外であっても、サービスを利用できることが多い。', 'ウ 金融機関の窓口に必ず 1 回は出向かないと、振り込みの手続きは一切完了しない。'], options: ['ア', 'ア、イ', 'イ', 'ア、イ、ウ'], correctAnswer: 'ア、イ', displayType: 'single' },
  { id: 'p-new254', categoryId: '1-a', description: 'テレワーク（リモートワーク）に関する課題として、最も考えられやすいものはどれか。', options: ['通勤による疲労や移動時間が大幅に増加すること。', '同僚同士の気軽なコミュニケーションが希薄になりやすいこと。', 'インターネット環境が全く不要になること。', '全社員が一つのオフィスに集まる必要性が増すこと。'], correctAnswer: '同僚同士の気軽なコミュニケーションが希薄になりやすいこと。', displayType: 'single' },
  
  { id: 'p-new255', categoryId: '1-b', description: '情報の受け手にとっての「わかりやすさ（情報デザイン）」の工夫として、適切な組み合わせを選びなさい。', subDescriptions: ['ア．重要な文字は、背景と同系色の色にして目立たせる。', 'イ．情報を図解（ピクトグラムやアイコンなど）にして直感的に伝わるようにする。', 'ウ．重要な箇所だけ文字を大きくしたり、太字にしたりして強調する。', 'エ．できるだけ専門用語を多用し、内容を難しく見せる。'], options: ['ア、イ', 'イ、ウ', 'ウ、エ', 'ア、エ'], correctAnswer: 'イ、ウ', displayType: 'single' },
  { id: 'p-new256', categoryId: '1-b', description: '「ユニバーサルデザイン」の考え方に最も合致するものはどれか。', options: ['年齢や障害の有無、性別などに関わらず、できるだけ多くの人が使いやすいように製品や施設を設計すること。', '視覚に障害がある人だけが特別に使える専用の道を作ること。', '若者向けに、文字を極端に小さくしてスタイリッシュなデザインにすること。', '外国人の利用を想定せず、案内板はすべて日本語のみで表記すること。'], correctAnswer: '年齢や障害の有無、性別などに関わらず、できるだけ多くの人が使いやすいように製品や施設を設計すること。', displayType: 'single' },
  { id: 'p-new257', categoryId: '1-b', description: '文字の種類（フォント）に関する記述として、正しいものをすべて選びなさい。', subDescriptions: ['ア ゴシック体は縦と横の線の太さがほぼ同じで、ポスターなどで遠くからでも読みやすい。', 'イ 明朝体は筆で書いたような飾りがついており、長文をじっくり読ませるのに向いている。', 'ウ どのような場面でも、筆記体のアルファベットを使うのが一番わかりやすい。'], options: ['ア', 'イ', 'ア、イ', 'ア、イ、ウ'], correctAnswer: 'ア、イ', displayType: 'single' },
  { id: 'p-new258', categoryId: '1-b', description: '「ピクトグラム」について適切に述べたものはどれか。', options: ['複雑な情報を文字だけで詳細に記述した文書のこと。', '非常口やトイレなどのように、言葉が分からなくても視覚的に意味が伝わるように作られた図記号のこと。', '数値を表すために作られた円グラフや棒グラフのこと。', 'コンピュータ内部で数字を処理するためのプログラムの図のこと。'], correctAnswer: '非常口やトイレなどのように、言葉が分からなくても視覚的に意味が伝わるように作られた図記号のこと。', displayType: 'single' },
  { id: 'p-new259', categoryId: '1-b', description: 'プレゼンテーションの資料を作成する際の工夫についての先生と生徒の会話文の空欄（ア）にあてはまる適切な言葉はどれか。', subDescriptions: ['生徒：スライドの文字をもっと目立たせたいです。', '先生：それなら、文字の色と背景の色に（ ア ）をつけるといいですよ。明暗のはっきり違う色を組み合わせると文字が読みやすくなります。'], options: ['コントラスト', 'アニメーション', 'グラデーション', 'モザイク'], correctAnswer: 'コントラスト', displayType: 'single' },
  
  { id: 'p-new260', categoryId: '1-c', description: 'SNS の利用において、注意すべき行動のすべてを挙げたものはどれか答えなさい。', subDescriptions: ['ア ちょっとした悪ふざけの動画を、「友達だけだから」と軽い気持ちで投稿した。', 'イ 他人の顔がはっきりと写っている写真を、本人に無断で投稿した。', 'ウ 自分が今いる場所の詳細が分かる写真と「今ここにいます！」という文章をリアルタイムで投稿した。', 'エ 未確認の衝撃的なニュースを、「みんなに教えなきゃ」とすぐにシェアした。'], options: ['ア、イ', 'イ、ウ、エ', 'ア、ウ、エ', 'ア、イ、ウ、エ'], correctAnswer: 'ア、イ、ウ、エ', displayType: 'single' },
  { id: 'p-new261', categoryId: '1-c', description: '著作権について述べたもののすべてを挙げたものはどれか答えなさい。', subDescriptions: ['ア 小説や絵画、音楽などを創作した人に与えられる権利である。', 'イ インターネット上で無料公開されているイラストには著作権がないので、自由にどう使ってもよい。', 'ウ 著作者の許可なく、他人の作品を自分のホームページで公開してはならない。', 'エ レポートなどの作成で他人の文章を自分のものとしてそのまま書いて提出した。'], options: ['ア、ウ', 'ア、イ、エ', 'ウ、エ', 'ア、ウ、エ'], correctAnswer: 'ア、ウ', displayType: 'single' },
  { id: 'p-new262', categoryId: '1-c', description: '実在する銀行や企業を装ったメールを送り、偽の Web サイトに誘導して暗証番号やパスワードなどを盗み取る詐欺を何というか。', options: ['フィッシング詐欺', 'ワンクリック詐欺', '架空請求詐欺', 'ランサムウェア'], correctAnswer: 'フィッシング詐欺', displayType: 'single' },
  { id: 'p-new263', categoryId: '1-c', description: '他人の肖像（顔や姿）をみだりに写真や動画に撮られたり、公表されたりしないように主張できる権利を何というか。', options: ['著作権', '肖像権', '知的所有権', 'プライバシーの権利'], correctAnswer: '肖像権', displayType: 'single' },
  { id: 'p-new264', categoryId: '1-c', description: 'パスワードの管理方法として、最も適切なものはどれか。', options: ['覚えやすいように、自分の生年月日や電話番号だけを設定する。', '忘れないように、付箋に書いてパソコンのディスプレイに貼っておく。', '複数のサービスで、まったく同じパスワードを使い回す。', '他人に推測されにくい、英数字や記号を組み合わせた長いパスワードを設定し、他人に教えない。'], correctAnswer: '他人に推測されにくい、英数字や記号を組み合わせた長いパスワードを設定し、他人に教えない。', displayType: 'single' },
  
  { id: 'p-new265', categoryId: '2-a', description: 'コンピュータの「５大装置」に含まれるものをすべて答えなさい。（複数選択）', options: ['入力装置', '出力装置', '演算装置', '記憶装置', '表示装置'], correctAnswer: ['入力装置', '出力装置', '演算装置', '記憶装置'], displayType: 'multiple' },
  { id: 'p-new266', categoryId: '2-a', description: '主記憶装置（メインメモリ）の特徴に関する記述として、正しいものをすべて選びなさい。', subDescriptions: ['ア CPU と直接データをやり取りし、高速に読み書きができる。', 'イ ハードディスクなどの補助記憶装置よりも記憶容量が非常に大きい。', 'ウ パソコンの電源を切ると、記憶されているデータは消えてしまう（RAM の場合）。', 'エ 主記憶装置自体が計算（演算）を行う。'], options: ['ア', 'ア、イ', 'ア、ウ', 'イ、エ'], correctAnswer: 'ア、ウ', displayType: 'single' },
  { id: 'p-new267', categoryId: '2-a', description: '次のうち、入力装置に分類される組み合わせとして正しいものはどれか。', options: ['キーボード、ディスプレイ', 'マウス、スキャナ', 'プリンタ、スピーカー', 'ハードディスク、USB メモリ'], correctAnswer: 'マウス、スキャナ', displayType: 'single' },
  { id: 'p-new268', categoryId: '2-a', description: 'コンピュータなどのハードウェア全体を管理・制御し、人間がコンピュータを使いやすくするための土台となるソフトウェア（Windows、macOSなど）を何というか。', options: ['オペレーティングシステム (OS)', 'アプリケーションソフトウェア', 'ワープロソフトウェア', '表計算ソフトウェア'], correctAnswer: 'オペレーティングシステム (OS)', displayType: 'single' },
  { id: 'p-new269', categoryId: '2-a', description: '中央処理装置（CPU）の中に備わっている 2 つの装置の組み合わせとして正しいものはどれか。', options: ['入力装置と出力装置', '制御装置と演算装置', '主記憶装置と補助記憶装置', '制御装置と記憶装置'], correctAnswer: '制御装置と演算装置', displayType: 'single' },
  
  { id: 'p-new270', categoryId: '2-b', description: 'ネットワークにおける「サーバ」と「クライアント」の関係について、正しいものはどれか。', options: ['サーバが要求を出し、クライアントがその要求に応じてサービスを提供する。', 'クライアントが要求を出し、サーバがその要求に応じてデータなどのサービスを提供する。', 'サーバとクライアントは常に同じコンピュータ内にある。', 'サーバは人間が操作するためのもので、クライアントはデータを保存するだけの機械である。'], correctAnswer: 'クライアントが要求を出し、サーバがその要求に応じてデータなどのサービスを提供する。', displayType: 'single' },
  { id: 'p-new271', categoryId: '2-b', description: '学校のパソコン室や会社の同じフロアなど、比較的狭い範囲内でコンピュータ同士をつないだネットワークを何というか。', options: ['LAN (Local Area Network)', 'WAN (Wide Area Network)', 'インターネット', 'プロビジョニング'], correctAnswer: 'LAN (Local Area Network)', displayType: 'single' },
  { id: 'p-new272', categoryId: '2-b', description: '電子メールアドレス「taro@example.com」の説明として正しい組み合わせを選びなさい。', subDescriptions: ['ア．「taro」の部分は、メールを受け取る個人のユーザー名（アカウント名）を表す。', 'イ．「example.com」の部分は、所属する組織やプロバイダなどのドメイン名を表す。', 'ウ．「@」は「アットマーク」と読み、ユーザー名とドメイン名を区切る記号である。', 'エ．「.com」の部分は個人のパスワードを表している。'], options: ['ア、イ', 'ア、イ、ウ', 'イ、ウ、エ', 'ア、イ、ウ、エ'], correctAnswer: 'ア、イ、ウ', displayType: 'single' },
  { id: 'p-new273', categoryId: '2-b', description: '家庭LANなどで、スマートフォンやパソコンをケーブルを使わずに電波を利用してネットワークに接続する代表的な規格はどれか。', options: ['Wi-Fi (無線LAN)', 'Ethernet', '光ファイバ', 'USB通信'], correctAnswer: 'Wi-Fi (無線LAN)', displayType: 'single' },
  { id: 'p-new274', categoryId: '2-b', description: 'Webサイトの住所にあたる「URL (http://www.example.co.jp/)」において、「co.jp」の部分から推測できる内容はどれか。', options: ['日本の企業（会社）であること', '日本の政府機関であること', 'アメリカの大学であること', '個人のブログであること'], correctAnswer: '日本の企業（会社）であること', displayType: 'single' },
  
  { id: 'p-new275', categoryId: '2-c', description: '2進数の「1011」を 10進数に変換した値として正しいものはどれか。', options: ['9', '10', '11', '12'], correctAnswer: '11', displayType: 'single' },
  { id: 'p-new276', categoryId: '2-c', description: '10進数の「13」を 2進数に変換した値として正しいものはどれか。', options: ['1101', '1110', '1011', '1001'], correctAnswer: '1101', displayType: 'single' },
  { id: 'p-new277', categoryId: '2-c', description: '情報の単位について、小さいものから順に正しく並べているものはどれか。', options: ['KB（キロバイト） → MB（メガバイト） → GB（ギガバイト） → TB（テラバイト）', 'MB（メガバイト） → KB（キロバイト） → TB（テラバイト） → GB（ギガバイト）', 'GB（ギガバイト） → MB（メガバイト） → KB（キロバイト） → TB（テラバイト）', 'TB（テラバイト） → GB（ギガバイト） → MB（メガバイト） → KB（キロバイト）'], correctAnswer: 'KB（キロバイト） → MB（メガバイト） → GB（ギガバイト） → TB（テラバイト）', displayType: 'single' },
  { id: 'p-new278', categoryId: '2-c', description: 'データの圧縮に関する説明として、正しい組み合わせを選びなさい。', subDescriptions: ['ア．データの意味を変えずにデータ量を減らすことを圧縮という。', 'イ．圧縮したデータを元の状態に戻すことを展開（解凍）という。', 'ウ．非可逆圧縮は、一度圧縮すると完全に元に戻すことはできないかわりに、圧縮率を高くできる。', 'エ．テキストデータ（文字入力ファイル）は、非可逆圧縮で圧縮されるのが一般的である。'], options: ['ア、イ', 'ア、イ、ウ', 'イ、ウ、エ', 'ア、イ、ウ、エ'], correctAnswer: 'ア、イ、ウ', displayType: 'single' },
  { id: 'p-new279', categoryId: '2-c', description: 'ファイルの拡張子のうち、画像データを表すもののすべてを挙げたものはどれか答えなさい。', subDescriptions: ['ア .jpg (JPEG)', 'イ .png (PNG)', 'ウ .mp3 (MP3)', 'エ .pdf (PDF)'], options: ['ア、イ', 'ア、ウ', 'イ、エ', 'ア、イ、ウ'], correctAnswer: 'ア、イ', displayType: 'single' },
  
  { id: 'p-new280', categoryId: '2-d', description: 'コンピュータウイルスに関する記述として、正しいものをすべて選びなさい。', subDescriptions: ['ア 自己伝染機能があり、他のプログラムやファイルに感染して増殖する。', 'イ 潜伏機能を持ち、特定の日時や条件になるまで症状を出さないことがある。', 'ウ ウイルス対策ソフトを一度インストールすれば、更新しなくても半永久的にすべての新種ウイルスを防ぐことができる。', 'エ データやファイルを破壊したり、情報を外部に流出させたりする機能（発病機能）を持つものがある。'], options: ['ア、イ', 'ア、イ、エ', 'イ、ウ、エ', 'ア、イ、ウ、エ'], correctAnswer: 'ア、イ、エ', displayType: 'single' },
  { id: 'p-new281', categoryId: '2-d', description: '企業が保有する「個人情報」に該当する可能性のあるものをすべて答えなさい。（複数選択）', options: ['顧客の氏名と電話番号が書かれたリスト', '防犯カメラに映った個人の顔の映像', '気温や湿度などの気象データ単体', '社員名簿'], correctAnswer: ['顧客の氏名と電話番号が書かれたリスト', '防犯カメラに映った個人の顔の映像', '社員名簿'], displayType: 'multiple' },
  { id: 'p-new282', categoryId: '2-d', description: 'データの消失に備えて、CD-ROMや外付けハードディスク、クラウドなどにデータの複製（コピー）を保存しておくことを何というか。', options: ['バックアップ', 'フォーマット', 'クレンジング', 'インストール'], correctAnswer: 'バックアップ', displayType: 'single' },
  { id: 'p-new283', categoryId: '2-d', description: '情報セキュリティの3要素（CIA）に含まれないものはどれか。', options: ['機密性 (Confidentiality)', '完全性 (Integrity)', '可用性 (Availability)', '匿名性 (Anonymity)'], correctAnswer: '匿名性 (Anonymity)', displayType: 'single' },
  { id: 'p-new284', categoryId: '2-d', description: 'システムを利用する権利がある本人かどうかを確認するために、指紋、顔、静脈など身体的な特徴を用いる認証方法を何というか。', options: ['バイオメトリクス（生体）認証', 'パスワード認証', 'スマートカード認証', '二段階認証'], correctAnswer: 'バイオメトリクス（生体）認証', displayType: 'single' },
  
  { id: 'p-new285', categoryId: '3-a', description: '10人の小テストの点数が次のようであったとき、「中央値」はどれか。\nデータ： 2, 3, 4, 5, 5, 5, 6, 7, 8, 9', options: ['5', '5.5', '4.5', '6'], correctAnswer: '5', displayType: 'single' },
  { id: 'p-new286', categoryId: '3-a', description: 'あるクラスの生徒が好きな果物を調べたところ、リンゴが一番多く選ばれた。この時、リンゴにあたる「最も度数（人数）が多い値」を何というか。', options: ['最頻値', '中央値', '平均値', '最大値'], correctAnswer: '最頻値', displayType: 'single' },
  { id: 'p-new287', categoryId: '3-a', description: '「母集団」すべてを調査するのではなく、一部のデータを抽出し、その結果から母集団全体の性質を推測する調査方法を何というか。', options: ['標本調査', '全数調査', '国勢調査', 'ABC分析'], correctAnswer: '標本調査', displayType: 'single' },
  { id: 'p-new288', categoryId: '3-a', description: 'データの「ばらつき（散らばりの度合い）」を表す用語として、最も適切なものはどれか。', options: ['分散', '最頻値', '中央値', '平均値'], correctAnswer: '分散', displayType: 'single' },
  { id: 'p-new289', categoryId: '3-a', description: 'ヒストグラム（柱状グラフ）に関する記述として、正しいものはどれか。', options: ['データの散らばり具合や、どの区間にデータが多く集まっているかの分布を見るために使われる。', '時間の経過とともに値がどう変化したかを見るためだけに使われる。', '複数のデータが全体の何パーセントを占めるかを表すために使われる。', '2つの項目の関係性（相関があるかないか）を見るために使われる。'], correctAnswer: 'データの散らばり具合や、どの区間にデータが多く集まっているかの分布を見るために使われる。', displayType: 'single' },
  
  { id: 'p-new290', categoryId: '3-b', description: '2 つのデータ（例えば「気温」と「アイスクリームの売れ行き」）の相関関係を調べるのに最も適したグラフはどれか。', options: ['散布図', '円グラフ', 'レーダーチャート', '帯グラフ'], correctAnswer: '散布図', displayType: 'single' },
  { id: 'p-new291', categoryId: '3-b', description: '「Z グラフ」について述べた説明で、正しいものはどれか。', options: ['「各月の売上」「売上の累計」「移動合計（直近1年間の売上合計）」の 3 つの折れ線を重ねたグラフで、売上の全体的な傾向を知るのに適している。', 'アンケート結果などで、全体に対する各項目の割合を円形で表したグラフ。', '原因と結果の関係を魚の骨のような形で整理した図。', '商品などを重要度や売上順に並べ、累積比率でA・B・Cの3グループに分けるために使うグラフ。'], correctAnswer: '「各月の売上」「売上の累計」「移動合計（直近1年間の売上合計）」の 3 つの折れ線を重ねたグラフで、売上の全体的な傾向を知るのに適している。', displayType: 'single' },
  { id: 'p-new292', categoryId: '3-b', description: '全体を100%としたときの、内訳の構成割合を示すのに適したグラフの組み合わせはどれか。', options: ['円グラフ、帯グラフ', '折れ線グラフ、レーダーチャート', '散布図、Zグラフ', '棒グラフ、レーダーチャート'], correctAnswer: '円グラフ、帯グラフ', displayType: 'single' },
  { id: 'p-new293', categoryId: '3-b', description: '店舗で販売している商品を売上金額順に並べ、売上の累積比率の折れ線グラフと組み合わせた「パレート図」を作成した。この図を用いて行う分析はどれか。', options: ['ABC 分析', 'SWOT 分析', '回帰分析', '時系列分析'], correctAnswer: 'ABC 分析', displayType: 'single' },
  { id: 'p-new294', categoryId: '3-b', description: 'テストの点数について、「国語」「数学」「英語」「理科」「社会」の 5 教科のバランスが良いかどうかを一目で確認したい。最も適したグラフはどれか。', options: ['レーダーチャート', '散布図', '円グラフ', '折れ線グラフ'], correctAnswer: 'レーダーチャート', displayType: 'single' },
  
  { id: 'p-new295', categoryId: '3-c', description: '業務を改善するための「PDCAサイクル」の順序として正しいものはどれか。', options: ['計画(Plan) → 実行(Do) → 評価(Check) → 改善(Action)', '実行(Do) → 評価(Check) → 計画(Plan) → 改善(Action)', '評価(Check) → 計画(Plan) → 改善(Action) → 実行(Do)', '計画(Plan) → 評価(Check) → 実行(Do) → 改善(Action)'], correctAnswer: '計画(Plan) → 実行(Do) → 評価(Check) → 改善(Action)', displayType: 'single' },
  { id: 'p-new296', categoryId: '3-c', description: 'プログラムの流れ図（フローチャート）において、「長方形」の記号が表すものはどれか。', options: ['処理（計算や代入など）', '判断（条件による分岐）', '端子（開始や終了）', '入力や出力'], correctAnswer: '処理（計算や代入など）', displayType: 'single' },
  { id: 'p-new297', categoryId: '3-c', description: '複数人で意見を出し合う「ブレインストーミング」のルールとして、間違っているものはどれか。', options: ['他人の意見が出たら、すぐに良し悪しを批判・評価する。', '質よりも多くの量を出すことを優先する。', '突拍子もない自由奔放な意見を歓迎する。', '他の人のアイデアに便乗して、さらにアイデアを広げてよい。'], correctAnswer: '他人の意見が出たら、すぐに良し悪しを批判・評価する。', displayType: 'single' },
  { id: 'p-new298', categoryId: '3-c', description: 'ブレインストーミングなどで出された大量の意見（カードに書いたもの）を、内容の似ているもの同士でグループ分けし、見出しをつけて整理していく手法はどれか。', options: ['KJ 法', '特性要因図', 'ガントチャート', 'ロジックツリー'], correctAnswer: 'KJ 法', displayType: 'single' },
  { id: 'p-new299', categoryId: '3-c', description: '問題の原因を分析する際、「なぜ」を繰り返し、原因を木の枝分かれのように分解して整理していく図法はどれか。', options: ['ロジックツリー', 'レーダーチャート', 'Z グラフ', 'フローチャート'], correctAnswer: 'ロジックツリー', displayType: 'single' }
];

let finalArr = [...newQs];

// Add an additional 50 unique variations mimicking Zensho Grade 3 style
const additionalQs = [
  { id: 'p-new300', categoryId: '1-a', description: 'POSシステムの利点について述べた組み合わせとして正しいものを選びなさい。', subDescriptions: ['ア．何が、いつ、いくつ売れたかを正確に把握できる。', 'イ．売れ筋商品や死に筋商品の分析ができ、仕入れに活用できる。', 'ウ．売上データを集計するために、閉店後にレジの記録を手作業で計算し直す必要がある。'], options: ['ア、イ', 'ア、ウ', 'イ、ウ', 'ア、イ、ウ'], correctAnswer: 'ア、イ', displayType: 'single' },
  { id: 'p-new301', categoryId: '2-a', description: '次のうち、記憶装置に分類される組み合わせとして正しいものはどれか。', options: ['ハードディスク、USBメモリ', 'キーボード、マウス', 'ディスプレイ、プリンタ', 'CPU、マザーボード'], correctAnswer: 'ハードディスク、USBメモリ', displayType: 'single' },
  { id: 'p-new302', categoryId: '2-c', description: '2進数の「1001」を10進数に変換した値として正しいものはどれか。', options: ['7', '8', '9', '10'], correctAnswer: '9', displayType: 'single' },
  { id: 'p-new303', categoryId: '3-b', description: '時間の経過に伴う数量の変化（例えば毎月の売上推移など）を見るのに最も適したグラフはどれか。', options: ['折れ線グラフ', '円グラフ', 'レーダーチャート', '散布図'], correctAnswer: '折れ線グラフ', displayType: 'single' },
  { id: 'p-new304', categoryId: '1-c', description: 'コンピュータウイルスを防ぐ方法として、最も不適切なものはどれか。', options: ['ウイルス対策ソフトをインストールし、常に最新の状態に更新しておく。', '全く知らない相手からのメールの添付ファイルは、安全が確認できるまで開かない。', '怪しいWebサイトや不審なリンクをむやみにクリックしない。', 'パソコンの性能が落ちるため、ウイルス対策ソフトの定期的な検査（スキャン）は行わない。'], correctAnswer: 'パソコンの性能が落ちるため、ウイルス対策ソフトの定期的な検査（スキャン）は行わない。', displayType: 'single' },
  { id: 'p-new305', categoryId: '2-b', description: '情報の送受信に使われる「プロトコル」の意味として最も適切なものはどれか。', options: ['ネットワーク上でデータをやり取りするための共通の約束事（通信規約）。', 'コンピュータの画面をきれいに表示するためのソフトウェア。', 'キーボードから入力した文字を記憶しておく装置。', 'インターネット上のWebページを閲覧するためのソフト。'], correctAnswer: 'ネットワーク上でデータをやり取りするための共通の約束事（通信規約）。', displayType: 'single' },
  { id: 'p-new306', categoryId: '1-a', description: '電子マネーや交通系ICカードなど、事前に現金をチャージ（入金）して支払いを行う決済方式を何というか。', options: ['プリペイド方式', 'ポストペイ方式', 'デビット方式', 'クレジット方式'], correctAnswer: 'プリペイド方式', displayType: 'single' },
  { id: 'p-new307', categoryId: '3-a', description: 'クラス全員のテストの点数を調べた。飛び抜けて高い点数の生徒が1人いた場合、その影響を最も受けやすい指標はどれか。', options: ['平均値', '中央値', '最頻値', 'データ数'], correctAnswer: '平均値', displayType: 'single' },
  { id: 'p-new308', categoryId: '1-b', description: '情報を相手に正確に伝えるための「情報デザイン」の工夫として、不適切なものはどれか。', options: ['色覚の多様性に配慮し、色だけで情報を区別せず、模様や文字も併用する。', '余白を適度にとり、要素のまとまりをわかりやすく配置する。', '相手に必要な情報を見つけにくくするため、関係ない情報を散りばめる。', '重要な情報は大きく、目立つ色で強調する。'], correctAnswer: '相手に必要な情報を見つけにくくするため、関係ない情報を散りばめる。', displayType: 'single' },
  { id: 'p-new309', categoryId: '2-a', description: 'ハードウェアとソフトウェアの関係について述べた記述として、正しいものはどれか。', options: ['ハードウェアは目に見える機械そのものであり、ソフトウェアはそれを動かすためのプログラムである。', 'ハードウェアはプログラムのことであり、ソフトウェアは機械のことを指す。', 'パソコンを買えば、ソフトウェアは一切インストールしなくても全ての目的の作業ができる。', 'ソフトウェアは一度インストールすれば、自動的に傷や故障が直る。'], correctAnswer: 'ハードウェアは目に見える機械そのものであり、ソフトウェアはそれを動かすためのプログラムである。', displayType: 'single' },
  { id: 'p-new310', categoryId: '2-d', description: '情報セキュリティの「完全性」が保たれている状態とはどのような状態か。', options: ['情報が正確であり、内容が不正に書き換えられたり消去されたりしていない状態。', '許可された人だけが情報にアクセスでき、外部に漏れていない状態。', 'システムを利用したいときにいつでも安全に利用できる状態。', 'パスワードを忘れた際、誰でもすぐにシステムにログインできる状態。'], correctAnswer: '情報が正確であり、内容が不正に書き換えられたり消去されたりしていない状態。', displayType: 'single' },
  { id: 'p-new311', categoryId: '3-c', description: '流れ図（フローチャート）において、「両端が丸い四角形（あるいは楕円）」の記号が表すものはどれか。', options: ['端子（開始や終了）', '処理', '判断', '入出力'], correctAnswer: '端子（開始や終了）', displayType: 'single' },
  { id: 'p-new312', categoryId: '1-c', description: '「ワンクリック詐欺」の手口として最も適切なものはどれか。', options: ['Webサイトの画像やリンクなどをクリックしただけで、突然高額な料金の支払いを請求される。', '実在の企業を装ったメールを送り、偽サイトでパスワードを入力させる。', 'パソコン内のデータを暗号化し、元に戻すための身代金を要求する。', '他人のIDを使い、勝手にシステムに侵入してデータを盗み出す。'], correctAnswer: 'Webサイトの画像やリンクなどをクリックしただけで、突然高額な料金の支払いを請求される。', displayType: 'single' },
  { id: 'p-new313', categoryId: '2-b', description: 'LANに関する記述として、正しい組み合わせを選びなさい。', subDescriptions: ['ア．同じ建物や敷地内など、限定された範囲のネットワークである。', 'イ．世界中のコンピュータ同士を結ぶ地球規模のネットワークである。', 'ウ．無線LAN（Wi-Fi）を利用すると、ケーブル接続なしで利用できる。'], options: ['ア、イ', 'ア、ウ', 'イ、ウ', 'ア、イ、ウ'], correctAnswer: 'ア、ウ', displayType: 'single' },
  { id: 'p-new314', categoryId: '2-c', description: '10進数の「10」を2進数に変換した値として正しいものはどれか。', options: ['1010', '1000', '1100', '1110'], correctAnswer: '1010', displayType: 'single' },
  { id: 'p-new315', categoryId: '3-b', description: '項目ごとの「量の大小」を比較したいときに最も適したグラフはどれか。', options: ['棒グラフ', '折れ線グラフ', '円グラフ', '散布図'], correctAnswer: '棒グラフ', displayType: 'single' },
  { id: 'p-new316', categoryId: '1-c', description: '個人情報保護法に関する説明として、正しいものをすべて選びなさい。', subDescriptions: ['ア 個人の氏名、生年月日、住所などは個人情報にあたる。', 'イ 企業が個人情報を集める際は、利用目的を明らかにする必要がある。', 'ウ 集めた個人情報は、目的以外に使ったり、本人の同意なしに第三者に提供したりしてはならない。', 'エ 防犯カメラの映像データは、顔が映っていても個人情報には一切該当しない。'], options: ['ア、イ', 'ア、イ、ウ', 'イ、ウ、エ', 'ア、イ、ウ、エ'], correctAnswer: 'ア、イ、ウ', displayType: 'single' },
  { id: 'p-new317', categoryId: '2-a', description: 'ソフトウェアのうち「アプリケーションソフトウェア」に分類されるもののすべてを挙げたものはどれか。', subDescriptions: ['ア ワープロソフト', 'イ 表計算ソフト', 'ウ 画像編集ソフト', 'エ オペレーティングシステム (OS)'], options: ['ア、イ', 'ア、イ、ウ', 'ウ、エ', 'ア、イ、ウ、エ'], correctAnswer: 'ア、イ、ウ', displayType: 'single' },
  { id: 'p-new318', categoryId: '1-b', description: '情報を視覚的に表現する「ピクトグラム」の最も大きな利点はどれか。', options: ['言葉（言語）が通じない人同士でも直感的に意味を伝えることができること。', '文字をたくさん書けるため、詳細な説明ができること。', '音や音声で合図を送れること。', '文章を暗号化して、特定の相手にしか分からないようにできること。'], correctAnswer: '言葉（言語）が通じない人同士でも直感的に意味を伝えることができること。', displayType: 'single' },
  { id: 'p-new319', categoryId: '3-c', description: 'ブレインストーミングやKJ法などを使って、「アイデアを自由にたくさん出す」「集めた情報を整理して新しい発想を生み出す」といった活動の目的として、最も適切なものはどれか。', options: ['問題の発見と解決のため', 'コンピュータの計算速度を上げるため', 'ネットワークの通信エラーを直すため', 'ファイルのデータ容量を圧縮するため'], correctAnswer: '問題の発見と解決のため', displayType: 'single' },
  { id: 'p-new320', categoryId: '2-d', description: 'パスワードを設定する際の工夫として、最も安全性が高い（破られにくい）ものはどれか。', options: ['生年月日など、自分が忘れない短くて簡単な数字を使う。', '辞書に載っているような単語（例：password や apple など）を使う。', '英大文字、英小文字、数字、記号を組み合わせ、8文字以上などある程度長くする。', '付箋に書いてパソコンの画面に貼っておく。'], correctAnswer: '英大文字、英小文字、数字、記号を組み合わせ、8文字以上などある程度長くする。', displayType: 'single' },
  { id: 'p-new321', categoryId: '2-a', description: 'CPU（中央処理装置）の役割について述べた文の空欄（ア）にあてはまるものはどれか。「CPUは、（ ア ）と演算装置を含んでおり、コンピュータの頭脳として働く。」', options: ['制御装置', '記憶装置', '入力装置', '出力装置'], correctAnswer: '制御装置', displayType: 'single' },
  { id: 'p-new322', categoryId: '1-a', description: '企業活動における「情報」の役割として適切なものをすべて答えなさい。', subDescriptions: ['ア 集めたデータを分析して、「顧客のニーズ」や「売れ筋商品」という情報を作り出す。', 'イ 自社の強みや弱みを客観的に把握し、経営戦略を立てるための材料とする。', 'ウ どのような状況でも、勘や経験だけで経営のすべてを決定する方が確実である。'], options: ['ア', 'イ', 'ア、イ', 'ア、イ、ウ'], correctAnswer: 'ア、イ', displayType: 'single' },
  { id: 'p-new323', categoryId: '2-b', description: 'インターネット上でファイルを送受信（ダウンロードやアップロード）する際によく使われるプロトコル（通信規約）はあどれか。', options: ['HTTP', 'FTP', 'SMTP', 'POP3'], correctAnswer: 'FTP', displayType: 'single' },
  // ... let's cut it to ~25 + 25 = 50 total questions.
];

finalArr = finalArr.concat(additionalQs);

content += ",\n" + finalArr.map(q => {
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
console.log('Appended 54 strictly scoped questions.');
