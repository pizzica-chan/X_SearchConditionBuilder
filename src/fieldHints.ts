export const FIELD_HINTS = {
  allWords:
    "投稿に含まれる語句です。スペース区切りで複数指定すると、すべての語を含む投稿に絞ります。",
  exactPhrase:
    "語順どおりに一致するフレーズです。複数語の場合は自動で引用符付きの検索になります。",
  anyWords:
    "いずれかの語を含む投稿に絞ります。スペース区切りで複数指定すると OR 条件になります。",
  noneWords:
    "指定した語を含まない投稿に絞ります。スペース区切りで複数指定できます。",
  hashtags:
    "ハッシュタグで絞り込みます。# は省略できます。スペースまたはカンマ区切り。",
  language: "投稿の言語で絞り込みます。",

  fromAccounts:
    "特定アカウントの投稿のみに絞ります。@ は省略可。スペースまたはカンマ区切り。",
  toAccounts:
    "特定アカウントへの返信のみに絞ります。@ は省略可。スペースまたはカンマ区切り。",
  mentionAccounts:
    "特定アカウントへのメンション（@ユーザー名）を含む投稿に絞ります。@ は省略可。スペースまたはカンマ区切り。「メンション付き (filter:mentions)」は誰かへのメンションがあるかどうかの絞り込みで、こちらは宛先を指定します。",
  urls:
    "投稿に含まれるリンクの URL やドメインで絞り込みます。例: example.com、github.com。スペースまたはカンマ区切りで複数指定できます。「リンク」は URL の有無、「URL」は特定のリンク先を探す条件です。",

  repliesFilter:
    "返信投稿の有無で絞り込みます。「のみ」は返信だけ、「除外」は返信を除きます。",
  mentionsFilter:
    "誰かへのメンション（@）を含む投稿の有無で絞り込みます。「のみ」はメンション付きのみ、「除外」はメンションなし。「特定のメンション (@)」は誰をメンションしたかを指定する条件で、こちらとは別物です。",
  linksFilter:
    "URL リンクの有無で絞り込みます。「のみ」はリンク付き、「除外」はリンクなし。特定の URL やドメインを探す場合は「URL (url:)」を使います。",
  retweetsFilter: "リツイートを結果に含めるかどうかを指定します。",
  minLikes: "いいね数がこの値以上の投稿に絞ります。空欄の場合は条件なし。",
  minReplies: "返信数がこの値以上の投稿に絞ります。空欄の場合は条件なし。",
  minRetweets: "リツイート数がこの値以上の投稿に絞ります。空欄の場合は条件なし。",

  since: "この日付以降（当日を含む）の投稿に絞ります。",
  until: "この日付より前（当日は含まない）の投稿に絞ります。",
  withinTime:
    "現在からさかのぼった期間で絞ります。開始日・終了日とは別の指定方法です。",

  mediaFilter: "画像や動画の有無・種類で絞り込みます。",
  verifiedFilter:
    "認証バッジの種類で絞り込みます。レガシー認証は旧ブルーチェック、X Premium は有料認証です。",
  quoteFilter:
    "他の投稿を引用したツイートの有無で絞り込みます。",
  cashtags:
    "株価・暗号資産などのティッカーシンボルで絞ります。$ は省略可。スペースまたはカンマ区切り。",
  excludeFromAccounts:
    "指定アカウントの投稿を結果から除外します。@ は省略可。スペースまたはカンマ区切り。",
  listId:
    "公開リストのメンバーからの投稿のみに絞ります。リスト URL に含まれる数値 ID を入力します。",
  nearCity:
    "投稿場所が指定地域の近くのものに絞ります。英語の地名が無難です。動作が不安定な場合があります。",
  withinRadius:
    "場所と併用します。半径の単位はマイルです。空欄の場合は距離条件なし。",
  followsOnly:
    "自分がフォローしているアカウントの投稿のみに絞ります。X にログインしている必要があります。",

  presetName:
    "名前を付けて検索条件をブラウザに保存します。一覧の名前をタップすると読み込めます。",
  presetOverwrite: "現在フォームの内容で、この保存済み条件を更新します。",
  presetDelete: "この保存済み条件をブラウザから削除します。",
} as const;

export const FIELD_PLACEHOLDERS = {
  allWords: "語句1 語句2",
  exactPhrase: "語順どおりのフレーズ",
  anyWords: "猫 犬",
  noneWords: "除外する語句",
  hashtags: "プログラミング",
  fromAccounts: "username",
  toAccounts: "username",
  mentionAccounts: "username",
  urls: "example.com",
  minLikes: "100",
  minReplies: "10",
  minRetweets: "10",
  cashtags: "AAPL",
  excludeFromAccounts: "username",
  listId: "1234567890",
  nearCity: "Tokyo",
  withinRadius: "15",
  presetName: "条件名を入力",
} as const;
