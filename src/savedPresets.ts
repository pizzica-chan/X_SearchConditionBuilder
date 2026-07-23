import { defaultConditions, type SearchConditions } from "./types";

export interface SavedPreset {
  id: string;
  name: string;
  conditions: SearchConditions;
  savedAt: number;
}

const PRESETS_KEY = "x-scb:presets";
const DRAFT_KEY = "x-scb:draft";

export function normalizeConditions(raw: unknown): SearchConditions {
  if (!raw || typeof raw !== "object") {
    return { ...defaultConditions };
  }
  return { ...defaultConditions, ...(raw as Partial<SearchConditions>) };
}

function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded などは無視
  }
}

export function loadDraft(): SearchConditions | null {
  const draft = readStorage<unknown>(DRAFT_KEY);
  if (!draft) return null;
  return normalizeConditions(draft);
}

export function saveDraft(conditions: SearchConditions): void {
  writeStorage(DRAFT_KEY, conditions);
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}

export function loadPresets(): SavedPreset[] {
  const presets = readStorage<unknown[]>(PRESETS_KEY);
  if (!Array.isArray(presets)) return [];

  return presets
    .filter(
      (p): p is SavedPreset =>
        !!p &&
        typeof p === "object" &&
        typeof (p as SavedPreset).id === "string" &&
        typeof (p as SavedPreset).name === "string" &&
        typeof (p as SavedPreset).savedAt === "number",
    )
    .map((p) => ({
      ...p,
      conditions: normalizeConditions(p.conditions),
    }))
    .sort((a, b) => b.savedAt - a.savedAt);
}

export function persistPresets(presets: SavedPreset[]): void {
  writeStorage(PRESETS_KEY, presets);
}

export function createPreset(name: string, conditions: SearchConditions): SavedPreset {
  return {
    id: crypto.randomUUID(),
    name: name.trim() || "無題",
    conditions: { ...conditions },
    savedAt: Date.now(),
  };
}
