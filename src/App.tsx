import { QueryPreview } from "./components/QueryPreview";
import { SavedPresetsMenu } from "./components/SavedPresetsMenu";
import { SearchForm } from "./components/SearchForm";
import { useLocalConditions } from "./hooks/useLocalConditions";

export default function App() {
  const {
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
  } = useLocalConditions();

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon" aria-hidden="true">
              𝕏
            </span>
            <h1 className="brand-title">検索条件ビルダー</h1>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleReset}
            >
              クリア
            </button>
            <SavedPresetsMenu
              presets={presets}
              onSave={savePreset}
              onLoad={loadPreset}
              onUpdate={updatePreset}
              onDelete={deletePreset}
              onExportCsv={exportPresetsCsv}
              onImportCsv={importPresetsCsv}
            />
            <a
              href="https://x.com/search-advanced"
              target="_blank"
              rel="noopener noreferrer"
              className="header-link"
            >
              公式 ↗
            </a>
          </div>
        </div>
        <div className="header-query">
          <QueryPreview conditions={conditions} />
        </div>
      </header>

      <main className="main">
        <SearchForm conditions={conditions} onChange={handleChange} />
      </main>
    </div>
  );
}
