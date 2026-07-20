import type {
  MediaFilter,
  RetweetsFilter,
  SearchConditions,
  TriStateFilter,
  VerifiedFilter,
} from "./types";

function splitTokens(input: string): string[] {
  return input
    .split(/[\s,、]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeUsername(raw: string): string {
  return raw.replace(/^@/, "").trim();
}

function quoteIfNeeded(word: string): string {
  if (word.includes(" ") && !word.startsWith('"')) {
    return `"${word}"`;
  }
  return word;
}

function applyTriStateFilter(
  parts: string[],
  filter: TriStateFilter,
  includeToken: string,
  excludeToken: string,
): void {
  if (filter === "only") parts.push(includeToken);
  if (filter === "exclude") parts.push(excludeToken);
}

function applyAccounts(
  parts: string[],
  input: string,
  prefix: "from" | "to",
): void {
  for (const raw of splitTokens(input)) {
    const user = normalizeUsername(raw);
    if (user) parts.push(`${prefix}:${user}`);
  }
}

function applyExcludeAccounts(parts: string[], input: string): void {
  for (const raw of splitTokens(input)) {
    const user = normalizeUsername(raw);
    if (user) parts.push(`-from:${user}`);
  }
}

function applyMentions(parts: string[], input: string): void {
  for (const raw of splitTokens(input)) {
    const user = normalizeUsername(raw);
    if (user) parts.push(`@${user}`);
  }
}

function applyUrls(parts: string[], input: string): void {
  for (const raw of splitTokens(input)) {
    const url = raw.replace(/^url:/i, "").trim();
    if (!url) continue;
    const value = url.includes(" ") ? `"${url}"` : url;
    parts.push(`url:${value}`);
  }
}

function applyHashtags(parts: string[], input: string): void {
  for (const raw of splitTokens(input)) {
    const tag = raw.replace(/^#/, "");
    if (tag) parts.push(`#${tag}`);
  }
}

function applyCashtags(parts: string[], input: string): void {
  for (const raw of splitTokens(input)) {
    const tag = raw.replace(/^\$/, "");
    if (tag) parts.push(`$${tag}`);
  }
}

function applyEngagement(
  parts: string[],
  value: string,
  operator: "min_replies" | "min_faves" | "min_retweets",
): void {
  const num = parseInt(value, 10);
  if (!Number.isNaN(num) && num > 0) {
    parts.push(`${operator}:${num}`);
  }
}

function applyRetweetsFilter(parts: string[], filter: RetweetsFilter): void {
  if (filter === "exclude") {
    parts.push("-filter:retweets");
  }
}

function applyMediaFilter(parts: string[], filter: MediaFilter): void {
  const map: Record<Exclude<MediaFilter, "all">, string> = {
    media: "filter:media",
    images: "filter:images",
    videos: "filter:videos",
  };
  if (filter !== "all") parts.push(map[filter]);
}

function applyVerifiedFilter(parts: string[], filter: VerifiedFilter): void {
  if (filter === "verified") parts.push("filter:verified");
  if (filter === "blue_verified") parts.push("filter:blue_verified");
}

function applyGeoFilter(
  parts: string[],
  city: string,
  radius: string,
): void {
  const trimmedCity = city.trim();
  if (!trimmedCity) return;

  const quoted = trimmedCity.includes(" ") ? `"${trimmedCity}"` : trimmedCity;
  parts.push(`near:${quoted}`);

  const radiusNum = parseInt(radius, 10);
  if (!Number.isNaN(radiusNum) && radiusNum > 0) {
    parts.push(`within:${radiusNum}mi`);
  }
}

export function buildQuery(conditions: SearchConditions): string {
  const parts: string[] = [];

  const allWords = splitTokens(conditions.allWords);
  for (const word of allWords) {
    parts.push(quoteIfNeeded(word));
  }

  const phrase = conditions.exactPhrase.trim();
  if (phrase) {
    parts.push(phrase.includes(" ") ? `"${phrase}"` : phrase);
  }

  const anyWords = splitTokens(conditions.anyWords);
  if (anyWords.length === 1) {
    parts.push(quoteIfNeeded(anyWords[0]));
  } else if (anyWords.length > 1) {
    parts.push(anyWords.map(quoteIfNeeded).join(" OR "));
  }

  for (const word of splitTokens(conditions.noneWords)) {
    parts.push(`-${quoteIfNeeded(word)}`);
  }

  applyHashtags(parts, conditions.hashtags);
  applyCashtags(parts, conditions.cashtags);
  applyAccounts(parts, conditions.fromAccounts, "from");
  applyAccounts(parts, conditions.toAccounts, "to");
  applyMentions(parts, conditions.mentionAccounts);
  applyUrls(parts, conditions.urls);
  applyExcludeAccounts(parts, conditions.excludeFromAccounts);

  if (conditions.listId.trim()) {
    parts.push(`list:${conditions.listId.trim()}`);
  }

  if (conditions.language) {
    parts.push(`lang:${conditions.language}`);
  }

  applyTriStateFilter(parts, conditions.repliesFilter, "filter:replies", "-filter:replies");
  applyTriStateFilter(parts, conditions.mentionsFilter, "filter:mentions", "-filter:mentions");
  applyTriStateFilter(parts, conditions.linksFilter, "filter:links", "-filter:links");
  applyTriStateFilter(parts, conditions.quoteFilter, "filter:quote", "-filter:quote");
  applyRetweetsFilter(parts, conditions.retweetsFilter);
  applyMediaFilter(parts, conditions.mediaFilter);
  applyVerifiedFilter(parts, conditions.verifiedFilter);

  if (conditions.followsOnly) {
    parts.push("filter:follows");
  }

  applyEngagement(parts, conditions.minReplies, "min_replies");
  applyEngagement(parts, conditions.minLikes, "min_faves");
  applyEngagement(parts, conditions.minRetweets, "min_retweets");

  if (conditions.since) {
    parts.push(`since:${conditions.since}`);
  }
  if (conditions.until) {
    parts.push(`until:${conditions.until}`);
  }
  if (conditions.withinTime) {
    parts.push(`within_time:${conditions.withinTime}`);
  }

  applyGeoFilter(parts, conditions.nearCity, conditions.withinRadius);

  return parts.join(" ").trim();
}

export function buildXSearchLatestUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://x.com/search?q=${encoded}&src=typed_query&f=live`;
}

export function buildXSearchTopUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://x.com/search?q=${encoded}&src=typed_query`;
}
