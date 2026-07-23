import { normalizeConditions, type SavedPreset } from "./savedPresets";
import {
  type MediaFilter,
  type RetweetsFilter,
  type SearchConditions,
  type TriStateFilter,
  type VerifiedFilter,
} from "./types";

export const CSV_FORMAT_MARKER = "# x-search-condition-builder-presets-v1";

const CONDITION_COLUMNS = [
  "allWords",
  "exactPhrase",
  "anyWords",
  "noneWords",
  "hashtags",
  "cashtags",
  "language",
  "fromAccounts",
  "toAccounts",
  "mentionAccounts",
  "urls",
  "excludeFromAccounts",
  "listId",
  "repliesFilter",
  "mentionsFilter",
  "linksFilter",
  "retweetsFilter",
  "mediaFilter",
  "quoteFilter",
  "verifiedFilter",
  "followsOnly",
  "minReplies",
  "minLikes",
  "minRetweets",
  "since",
  "until",
  "withinTime",
  "nearCity",
  "withinRadius",
] as const satisfies readonly (keyof SearchConditions)[];

const CSV_HEADERS = ["name", "savedAt", ...CONDITION_COLUMNS] as const;

const CSV_HEADER_SET = new Set<string>(CSV_HEADERS);

const EXCEL_TEXT_COLUMNS = new Set<string>([
  "listId",
  "minReplies",
  "minLikes",
  "minRetweets",
  "withinRadius",
]);

const TRI_STATE_VALUES = new Set<TriStateFilter>(["all", "only", "exclude"]);
const RETWEETS_VALUES = new Set<RetweetsFilter>(["include", "exclude"]);
const MEDIA_VALUES = new Set<MediaFilter>(["all", "media", "images", "videos"]);
const VERIFIED_VALUES = new Set<VerifiedFilter>([
  "all",
  "verified",
  "blue_verified",
]);

export interface PresetImportResult {
  presets: SavedPreset[];
  errors: string[];
}

function escapeCsvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function normalizeHeaderName(value: string): string {
  return stripBom(value).trim().toLowerCase();
}

function formatCellForExport(column: string, value: string): string {
  let formatted = value;

  if (EXCEL_TEXT_COLUMNS.has(column) && formatted !== "") {
    formatted = `\t${formatted}`;
  } else if (/^[=+\-@]/.test(formatted)) {
    formatted = `\t${formatted}`;
  }

  return escapeCsvField(formatted);
}

function normalizeImportedCell(value: string): string {
  if (value.startsWith("\t")) {
    return value.slice(1);
  }
  return value;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\r") {
      if (next === "\n") {
        i++;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function parseBoolean(value: string): boolean {
  const normalized = normalizeImportedCell(value).trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function parseSavedAt(value: string): number {
  const trimmed = normalizeImportedCell(value).trim();
  if (!trimmed) return Date.now();

  const asNumber = Number(trimmed);
  if (!Number.isNaN(asNumber) && asNumber > 0) {
    return asNumber;
  }

  const asDate = Date.parse(trimmed);
  return Number.isNaN(asDate) ? Date.now() : asDate;
}

function sanitizeConditions(raw: Partial<SearchConditions>): SearchConditions {
  const conditions = normalizeConditions(raw);

  if (!TRI_STATE_VALUES.has(conditions.repliesFilter)) {
    conditions.repliesFilter = "all";
  }
  if (!TRI_STATE_VALUES.has(conditions.mentionsFilter)) {
    conditions.mentionsFilter = "all";
  }
  if (!TRI_STATE_VALUES.has(conditions.linksFilter)) {
    conditions.linksFilter = "all";
  }
  if (!TRI_STATE_VALUES.has(conditions.quoteFilter)) {
    conditions.quoteFilter = "all";
  }
  if (!RETWEETS_VALUES.has(conditions.retweetsFilter)) {
    conditions.retweetsFilter = "include";
  }
  if (!MEDIA_VALUES.has(conditions.mediaFilter)) {
    conditions.mediaFilter = "all";
  }
  if (!VERIFIED_VALUES.has(conditions.verifiedFilter)) {
    conditions.verifiedFilter = "all";
  }

  return conditions;
}

function presetToRow(preset: SavedPreset): string[] {
  return [
    preset.name,
    String(preset.savedAt),
    ...CONDITION_COLUMNS.map((column) => {
      const value = preset.conditions[column];
      if (typeof value === "boolean") {
        return value ? "true" : "false";
      }
      return value;
    }),
  ];
}

export function exportPresetsToCsv(presets: SavedPreset[]): string {
  const lines = [
    CSV_FORMAT_MARKER,
    CSV_HEADERS.map((header) => escapeCsvField(header)).join(","),
    ...presets.map((preset) =>
      presetToRow(preset)
        .map((value, index) =>
          formatCellForExport(CSV_HEADERS[index], value),
        )
        .join(","),
    ),
  ];
  return lines.join("\r\n");
}

function isFormatMarkerRow(cells: string[]): boolean {
  const first = stripBom(cells[0] ?? "").trim();
  return first === CSV_FORMAT_MARKER || first.startsWith("# x-search-condition-builder-presets-");
}

function buildHeaderIndex(cells: string[]): Map<string, number> | null {
  if (normalizeHeaderName(cells[0] ?? "") !== "name") {
    return null;
  }

  const index = new Map<string, number>();
  cells.forEach((cell, cellIndex) => {
    const header = normalizeHeaderName(cell);
    if (CSV_HEADER_SET.has(header)) {
      index.set(header, cellIndex);
    }
  });

  return index.has("name") ? index : null;
}

function cellsToRecord(
  cells: string[],
  headerIndex: Map<string, number> | null,
): Record<string, string> {
  const record: Record<string, string> = {};

  if (headerIndex) {
    for (const header of CSV_HEADERS) {
      const cellIndex = headerIndex.get(header);
      record[header] =
        cellIndex !== undefined
          ? normalizeImportedCell(cells[cellIndex] ?? "")
          : "";
    }
    return record;
  }

  CSV_HEADERS.forEach((header, index) => {
    record[header] = normalizeImportedCell(cells[index] ?? "");
  });
  return record;
}

function recordToPreset(
  record: Record<string, string>,
  rowNumber: number,
): { preset: SavedPreset | null; error: string | null } {
  const name = record.name?.trim();
  if (!name) {
    return { preset: null, error: `${rowNumber}行目: 条件名（name）が空です` };
  }

  const partial: Partial<SearchConditions> = {
    followsOnly: parseBoolean(record.followsOnly ?? ""),
  };

  for (const column of CONDITION_COLUMNS) {
    if (column === "followsOnly") continue;
    (partial as Record<string, string>)[column] = record[column] ?? "";
  }

  return {
    preset: {
      id: crypto.randomUUID(),
      name,
      conditions: sanitizeConditions(partial),
      savedAt: parseSavedAt(record.savedAt ?? ""),
    },
    error: null,
  };
}

function isEmptyRow(cells: string[]): boolean {
  return cells.every((cell) => !normalizeImportedCell(cell).trim());
}

export function importPresetsFromCsv(text: string): PresetImportResult {
  const rows = parseCsv(stripBom(text.trim()));
  if (rows.length === 0) {
    return { presets: [], errors: ["CSV にデータがありません"] };
  }

  let cursor = 0;
  if (isFormatMarkerRow(rows[0])) {
    cursor = 1;
  }

  const headerIndex = buildHeaderIndex(rows[cursor] ?? []);
  if (headerIndex) {
    cursor += 1;
  }

  const presets: SavedPreset[] = [];
  const errors: string[] = [];

  rows.slice(cursor).forEach((cells, index) => {
    if (isEmptyRow(cells)) return;

    const rowNumber = cursor + index + 1;
    const { preset, error } = recordToPreset(cellsToRecord(cells, headerIndex), rowNumber);
    if (error) {
      errors.push(error);
      return;
    }
    if (preset) presets.push(preset);
  });

  if (presets.length === 0 && errors.length === 0) {
    errors.push("読み込める検索条件がありませんでした");
  }

  return { presets, errors };
}

export function downloadPresetsCsv(presets: SavedPreset[]): void {
  const csv = exportPresetsToCsv(presets);
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `x-search-presets-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
