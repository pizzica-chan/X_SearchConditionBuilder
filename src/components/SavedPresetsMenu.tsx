import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { buildQuery, buildXSearchLatestUrl, buildXSearchTopUrl } from "../buildQuery";
import { FieldHint } from "./FieldHint";
import { FIELD_HINTS, FIELD_PLACEHOLDERS } from "../fieldHints";
import type { PresetImportFeedback } from "../hooks/useLocalConditions";
import type { SavedPreset } from "../savedPresets";
import type { SearchConditions } from "../types";

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
  const [confirmAction, setConfirmAction] = useState<{
    kind: "overwrite" | "delete";
    preset: SavedPreset;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (confirmRef.current?.contains(target)) return;

      if (confirmAction) {
        setConfirmAction(null);
        return;
      }
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, confirmAction]);

  useEffect(() => {
    if (open) return;
    setConfirmAction(null);
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

  const openPresetSearch = (
    conditions: SearchConditions,
    mode: "latest" | "top",
  ) => {
    const query = buildQuery(conditions);
    if (!query) return;

    const url =
      mode === "latest"
        ? buildXSearchLatestUrl(query)
        : buildXSearchTopUrl(query);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleOverwrite = (preset: SavedPreset) => {
    setConfirmAction({ kind: "overwrite", preset });
  };

  const handleDelete = (preset: SavedPreset) => {
    setConfirmAction({ kind: "delete", preset });
  };

  const handleConfirm = () => {
    if (!confirmAction) return;

    if (confirmAction.kind === "overwrite") {
      onUpdate(confirmAction.preset.id);
    } else {
      onDelete(confirmAction.preset.id);
    }
    setConfirmAction(null);
  };

  const confirmMessage =
    confirmAction?.kind === "overwrite"
      ? `「${confirmAction.preset.name}」を、現在の検索条件で上書きしますか？`
      : confirmAction?.kind === "delete"
        ? `「${confirmAction.preset.name}」を削除しますか？この操作は取り消せません。`
        : "";

  const confirmLabel = confirmAction?.kind === "overwrite" ? "上書き" : "削除";

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
        <>
          <button
            type="button"
            className="presets-popover-backdrop"
            aria-label="閉じる"
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
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
                {presets.map((preset) => {
                  const hasQuery = buildQuery(preset.conditions).length > 0;

                  return (
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
                          className="btn btn-primary btn-sm btn-icon"
                          disabled={!hasQuery}
                          title={FIELD_HINTS.presetSearchLatest}
                          onClick={() => openPresetSearch(preset.conditions, "latest")}
                        >
                          最新
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm btn-icon"
                          disabled={!hasQuery}
                          title={FIELD_HINTS.presetSearchTop}
                          onClick={() => openPresetSearch(preset.conditions, "top")}
                        >
                          トップ
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-icon"
                          title={FIELD_HINTS.presetOverwrite}
                          onClick={() => handleOverwrite(preset)}
                        >
                          上書き
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-icon btn-danger"
                          title={FIELD_HINTS.presetDelete}
                          onClick={() => handleDelete(preset)}
                        >
                          削除
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="preset-empty">保存した検索条件はここに表示されます</p>
          )}

        </div>
        </>
      )}

      {confirmAction &&
        createPortal(
          <div
            ref={confirmRef}
            className="preset-confirm-overlay"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="preset-confirm-title"
            aria-describedby="preset-confirm-message"
            onClick={() => setConfirmAction(null)}
          >
            <div
              className="preset-confirm"
              onClick={(event) => event.stopPropagation()}
            >
              <p id="preset-confirm-title" className="preset-confirm-title">
                確認
              </p>
              <p id="preset-confirm-message" className="preset-confirm-message">
                {confirmMessage}
              </p>
              <div className="preset-confirm-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setConfirmAction(null)}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${
                    confirmAction.kind === "delete"
                      ? "btn-danger-solid"
                      : "btn-primary"
                  }`}
                  onClick={handleConfirm}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
