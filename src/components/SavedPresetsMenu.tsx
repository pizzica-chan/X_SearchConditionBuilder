import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { FieldHint } from "./FieldHint";
import { FIELD_HINTS, FIELD_PLACEHOLDERS } from "../fieldHints";
import type { PresetImportFeedback } from "../hooks/useLocalConditions";
import type { SavedPreset } from "../savedPresets";

interface SavedPresetsMenuProps {
  presets: SavedPreset[];
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
  onExportCsv: () => void;
  onImportCsv: (file: File) => Promise<PresetImportFeedback>;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SavedPresetsMenu({
  presets,
  onSave,
  onLoad,
  onUpdate,
  onDelete,
  onExportCsv,
  onImportCsv,
}: SavedPresetsMenuProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [importMessage, setImportMessage] = useState<PresetImportFeedback | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!importMessage) return;
    const timer = setTimeout(() => setImportMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [importMessage]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setName("");
  };

  const handleLoad = (id: string) => {
    onLoad(id);
    setOpen(false);
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const result = await onImportCsv(file);
    setImportMessage(result);
  };

  return (
    <div className={`presets-menu ${open ? "presets-menu--open" : ""}`} ref={menuRef}>
      <button
        type="button"
        className="btn btn-secondary btn-sm presets-menu-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="検索条件の保存と読み込み"
        title="検索条件に名前を付けて保存・読み込み"
        onClick={() => setOpen((value) => !value)}
      >
        条件を保存
        {presets.length > 0 && <span className="presets-count">{presets.length}</span>}
      </button>

      {open && (
        <div className="presets-popover" role="dialog" aria-label="検索条件の保存と読み込み">
          <div className="presets-popover-header">
            <span className="presets-popover-title">検索条件の保存・読み込み</span>
            <FieldHint text={FIELD_HINTS.presetName} />
          </div>

          <p className="presets-popover-lead">名前を付けて、現在の検索条件をブラウザに保存できます。</p>

          <div className="saved-presets-save">
            <input
              type="text"
              className="field-input"
              value={name}
              maxLength={40}
              placeholder={FIELD_PLACEHOLDERS.presetName}
              aria-label="保存する検索条件の名前"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!name.trim()}
              onClick={handleSave}
            >
              保存
            </button>
          </div>

          <div className="presets-csv">
            <p className="presets-list-label">CSV での入出力</p>
            <div className="presets-csv-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={presets.length === 0}
                title={FIELD_HINTS.presetExport}
                onClick={onExportCsv}
              >
                エクスポート
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                title={FIELD_HINTS.presetImport}
                onClick={() => fileInputRef.current?.click()}
              >
                インポート
              </button>
              <input
                id={importInputId}
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="presets-csv-input"
                onChange={handleImport}
              />
            </div>
            <p className="presets-csv-note">
              インポートした条件は既存の一覧に追加されます。
            </p>
            {importMessage && (
              <p
                className={`presets-import-message presets-import-message--${importMessage.kind}`}
                role="status"
              >
                {importMessage.message}
              </p>
            )}
          </div>

          {presets.length > 0 ? (
            <>
              <p className="presets-list-label">保存済みの検索条件</p>
              <ul className="preset-list">
                {presets.map((preset) => (
                  <li key={preset.id} className="preset-item">
                    <button
                      type="button"
                      className="preset-load"
                      title={formatDate(preset.savedAt)}
                      onClick={() => handleLoad(preset.id)}
                    >
                      {preset.name}
                    </button>
                    <div className="preset-actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-icon"
                        title={FIELD_HINTS.presetOverwrite}
                        onClick={() => onUpdate(preset.id)}
                      >
                        上書き
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-icon btn-danger"
                        title={FIELD_HINTS.presetDelete}
                        onClick={() => onDelete(preset.id)}
                      >
                        削除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="preset-empty">保存した検索条件はここに表示されます</p>
          )}
        </div>
      )}
    </div>
  );
}
