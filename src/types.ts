export type TriStateFilter = "all" | "only" | "exclude";

export type RetweetsFilter = "include" | "exclude";

export type MediaFilter = "all" | "media" | "images" | "videos";

export type VerifiedFilter = "all" | "verified" | "blue_verified";

export interface SearchConditions {
  allWords: string;
  exactPhrase: string;
  anyWords: string;
  noneWords: string;
  hashtags: string;
  cashtags: string;
  language: string;
  fromAccounts: string;
  toAccounts: string;
  mentionAccounts: string;
  excludeFromAccounts: string;
  listId: string;
  repliesFilter: TriStateFilter;
  linksFilter: TriStateFilter;
  retweetsFilter: RetweetsFilter;
  mediaFilter: MediaFilter;
  quoteFilter: TriStateFilter;
  verifiedFilter: VerifiedFilter;
  followsOnly: boolean;
  minReplies: string;
  minLikes: string;
  minRetweets: string;
  since: string;
  until: string;
  withinTime: string;
  nearCity: string;
  withinRadius: string;
}

export const defaultConditions: SearchConditions = {
  allWords: "",
  exactPhrase: "",
  anyWords: "",
  noneWords: "",
  hashtags: "",
  cashtags: "",
  language: "",
  fromAccounts: "",
  toAccounts: "",
  mentionAccounts: "",
  excludeFromAccounts: "",
  listId: "",
  repliesFilter: "all",
  linksFilter: "all",
  retweetsFilter: "include",
  mediaFilter: "all",
  quoteFilter: "all",
  verifiedFilter: "all",
  followsOnly: false,
  minReplies: "",
  minLikes: "",
  minRetweets: "",
  since: "",
  until: "",
  withinTime: "",
  nearCity: "",
  withinRadius: "",
};

export const LANGUAGES: { code: string; label: string }[] = [
  { code: "", label: "指定なし" },
  { code: "ja", label: "日本語" },
  { code: "en", label: "英語" },
  { code: "ko", label: "韓国語" },
  { code: "zh", label: "中国語" },
  { code: "es", label: "スペイン語" },
  { code: "fr", label: "フランス語" },
  { code: "de", label: "ドイツ語" },
  { code: "pt", label: "ポルトガル語" },
  { code: "ar", label: "アラビア語" },
  { code: "hi", label: "ヒンディー語" },
  { code: "ru", label: "ロシア語" },
  { code: "it", label: "イタリア語" },
  { code: "nl", label: "オランダ語" },
  { code: "th", label: "タイ語" },
  { code: "id", label: "インドネシア語" },
];

export const WITHIN_TIME_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "指定なし" },
  { value: "1h", label: "直近1時間" },
  { value: "12h", label: "直近12時間" },
  { value: "24h", label: "直近24時間" },
  { value: "7d", label: "直近7日" },
  { value: "30d", label: "直近30日" },
];

export const TRI_STATE_OPTIONS = [
  { value: "all", label: "すべて" },
  { value: "only", label: "のみ" },
  { value: "exclude", label: "除外" },
] as const;
