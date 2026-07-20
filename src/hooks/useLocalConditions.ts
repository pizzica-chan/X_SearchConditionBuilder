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
import { defaultConditions, type SearchConditions } from "../types";

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

  return {
    conditions,
    presets,
    handleChange,
    handleReset,
    savePreset,
    loadPreset,
    deletePreset,
    updatePreset,
  };
}
