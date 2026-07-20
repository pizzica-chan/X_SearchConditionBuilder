import { buildQuery, buildXSearchLatestUrl, buildXSearchTopUrl } from "../buildQuery";
import type { SearchConditions } from "../types";

interface QueryPreviewProps {
  conditions: SearchConditions;
}

export function QueryPreview({ conditions }: QueryPreviewProps) {
  const query = buildQuery(conditions);
  const isEmpty = query.length === 0;

  const handleCopy = async () => {
    if (!query) return;
    await navigator.clipboard.writeText(query);
  };

  const openSearch = (url: string) => {
    if (!query) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="query-bar">
      <div className={`query-box ${isEmpty ? "query-box--empty" : ""}`}>
        {!isEmpty && <code className="query-text">{query}</code>}
      </div>
      <div className="action-row">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={isEmpty}
          onClick={() => openSearch(buildXSearchLatestUrl(query))}
        >
          最新
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={isEmpty}
          onClick={() => openSearch(buildXSearchTopUrl(query))}
        >
          トップ
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={isEmpty}
          onClick={handleCopy}
        >
          コピー
        </button>
      </div>
    </section>
  );
}
