import { useCallback, useEffect, useState } from "react";
import {
  clearDraft,
  createPreset,
  loadDraft,
  loadPresets,
  persistPresets,
  saveDraft,
  type SavedPreset,
} from "../savedPresets";
import { downloadPresetsCsv, importPresetsFromCsv } from "../presetCsv";
import { defaultConditions, type SearchConditions } from "../types";

export type PresetImportFeedback = {
  kind: "success" | "error";
  message: string;
};

export function useLocalConditions() {
  const [conditions, setConditions] = useState<SearchConditions>(
    () => loadDraft() ?? defaultConditions,
  );
  const [presets, setPresets] = useState<SavedPreset[]>(() => loadPresets());

  useEffect(() => {
    const timer = setTimeout(() => saveDraft(conditions), 400);
    return () => clearTimeout(timer);
  }, [conditions]);

  const handleChange = useCallback((patch: Partial<SearchConditions>) => {
    setConditions((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleReset = useCallback(() => {
    setConditions(defaultConditions);
    clearDraft();
  }, []);

  const savePreset = useCallback(
    (name: string) => {
      const preset = createPreset(name, conditions);
      setPresets((prev) => {
        const next = [preset, ...prev];
        persistPresets(next);
        return next;
      });
      return preset;
    },
    [conditions],
  );

  const loadPreset = useCallback((id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setConditions({ ...preset.conditions });
  }, [presets]);

  const deletePreset = useCallback((id: string) => {
    setPresets((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persistPresets(next);
      return next;
    });
  }, []);

  const updatePreset = useCallback(
    (id: string) => {
      setPresets((prev) => {
        const next = prev.map((p) =>
          p.id === id
            ? { ...p, conditions: { ...conditions }, savedAt: Date.now() }
            : p,
        );
        persistPresets(next);
        return next;
      });
    },
    [conditions],
  );

  const exportPresetsCsv = useCallback(() => {
    if (presets.length === 0) return;
    downloadPresetsCsv(presets);
  }, [presets]);

  const importPresetsCsv = useCallback(async (file: File): Promise<PresetImportFeedback> => {
    try {
      const text = await file.text();
      const { presets: imported, errors } = importPresetsFromCsv(text);

      if (imported.length === 0) {
        return {
          kind: "error",
          message: errors[0] ?? "インポートに失敗しました",
        };
      }

      setPresets((prev) => {
        const next = [...imported, ...prev].sort((a, b) => b.savedAt - a.savedAt);
        persistPresets(next);
        return next;
      });

      const errorNote =
        errors.length > 0 ? `（${errors.length} 行はスキップ）` : "";
      return {
        kind: "success",
        message: `${imported.length} 件をインポートしました${errorNote}`,
      };
    } catch {
      return {
        kind: "error",
        message: "CSV ファイルの読み込みに失敗しました",
      };
    }
  }, []);

  return {
    conditions,
    presets,
    handleChange,
    handleReset,
    savePreset,
    loadPreset,
    deletePreset,
    updatePreset,
    exportPresetsCsv,
    importPresetsCsv,
  };
}
