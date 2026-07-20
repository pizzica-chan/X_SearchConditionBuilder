import {
  CheckboxField,
  DateField,
  NumberField,
  SelectField,
  TextField,
  TriStateField,
} from "./Fields";
import { FIELD_HINTS } from "../fieldHints";
import { LANGUAGES, WITHIN_TIME_OPTIONS, type SearchConditions } from "../types";

interface SearchFormProps {
  conditions: SearchConditions;
  onChange: (patch: Partial<SearchConditions>) => void;
  onReset: () => void;
}

export function SearchForm({ conditions, onChange, onReset }: SearchFormProps) {
  return (
    <form className="search-form" onSubmit={(e) => e.preventDefault()}>
      <section className="panel">
        <h2 className="section-title">キーワード</h2>
        <div className="field-grid field-grid--2">
          <TextField
            id="allWords"
            label="すべて含む"
            hint={FIELD_HINTS.allWords}
            value={conditions.allWords}
            onChange={(v) => onChange({ allWords: v })}
          />
          <TextField
            id="exactPhrase"
            label="フレーズ"
            hint={FIELD_HINTS.exactPhrase}
            value={conditions.exactPhrase}
            onChange={(v) => onChange({ exactPhrase: v })}
          />
          <TextField
            id="anyWords"
            label="いずれか"
            hint={FIELD_HINTS.anyWords}
            value={conditions.anyWords}
            onChange={(v) => onChange({ anyWords: v })}
          />
          <TextField
            id="noneWords"
            label="含まない"
            hint={FIELD_HINTS.noneWords}
            value={conditions.noneWords}
            onChange={(v) => onChange({ noneWords: v })}
          />
          <TextField
            id="hashtags"
            label="ハッシュタグ"
            hint={FIELD_HINTS.hashtags}
            value={conditions.hashtags}
            onChange={(v) => onChange({ hashtags: v })}
          />
          <SelectField
            id="language"
            label="言語"
            hint={FIELD_HINTS.language}
            value={conditions.language}
            options={LANGUAGES.map((l) => ({ value: l.code, label: l.label }))}
            onChange={(v) => onChange({ language: v })}
          />
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">アカウント</h2>
        <div className="field-grid field-grid--3">
          <TextField
            id="fromAccounts"
            label="投稿者 (from:)"
            hint={FIELD_HINTS.fromAccounts}
            value={conditions.fromAccounts}
            onChange={(v) => onChange({ fromAccounts: v })}
          />
          <TextField
            id="toAccounts"
            label="返信先 (to:)"
            hint={FIELD_HINTS.toAccounts}
            value={conditions.toAccounts}
            onChange={(v) => onChange({ toAccounts: v })}
          />
          <TextField
            id="mentionAccounts"
            label="特定のメンション (@)"
            hint={FIELD_HINTS.mentionAccounts}
            placeholder="username"
            value={conditions.mentionAccounts}
            onChange={(v) => onChange({ mentionAccounts: v })}
          />
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">フィルター・エンゲージメント</h2>
        <div className="field-grid field-grid--4">
          <TriStateField
            id="repliesFilter"
            label="返信"
            hint={FIELD_HINTS.repliesFilter}
            value={conditions.repliesFilter}
            onChange={(v) => onChange({ repliesFilter: v })}
          />
          <TriStateField
            id="mentionsFilter"
            label="メンション付き (filter:mentions)"
            hint={FIELD_HINTS.mentionsFilter}
            value={conditions.mentionsFilter}
            onChange={(v) => onChange({ mentionsFilter: v })}
          />
          <TriStateField
            id="linksFilter"
            label="リンク"
            hint={FIELD_HINTS.linksFilter}
            value={conditions.linksFilter}
            onChange={(v) => onChange({ linksFilter: v })}
          />
          <TextField
            id="urls"
            label="URL (url:)"
            hint={FIELD_HINTS.urls}
            placeholder="example.com"
            value={conditions.urls}
            onChange={(v) => onChange({ urls: v })}
          />
          <SelectField
            id="retweetsFilter"
            label="リツイート"
            hint={FIELD_HINTS.retweetsFilter}
            value={conditions.retweetsFilter}
            options={[
              { value: "include", label: "含む" },
              { value: "exclude", label: "除外" },
            ]}
            onChange={(v) => onChange({ retweetsFilter: v as "include" | "exclude" })}
          />
          <NumberField
            id="minLikes"
            label="最小いいね"
            hint={FIELD_HINTS.minLikes}
            value={conditions.minLikes}
            onChange={(v) => onChange({ minLikes: v })}
          />
          <NumberField
            id="minReplies"
            label="最小返信"
            hint={FIELD_HINTS.minReplies}
            value={conditions.minReplies}
            onChange={(v) => onChange({ minReplies: v })}
          />
          <NumberField
            id="minRetweets"
            label="最小RT"
            hint={FIELD_HINTS.minRetweets}
            value={conditions.minRetweets}
            onChange={(v) => onChange({ minRetweets: v })}
          />
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">日付</h2>
        <div className="field-grid field-grid--3">
          <DateField
            id="since"
            label="開始日"
            hint={FIELD_HINTS.since}
            value={conditions.since}
            onChange={(v) => onChange({ since: v })}
          />
          <DateField
            id="until"
            label="終了日"
            hint={FIELD_HINTS.until}
            value={conditions.until}
            onChange={(v) => onChange({ until: v })}
          />
          <SelectField
            id="withinTime"
            label="直近期間"
            hint={FIELD_HINTS.withinTime}
            value={conditions.withinTime}
            options={WITHIN_TIME_OPTIONS}
            onChange={(v) => onChange({ withinTime: v })}
          />
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">拡張オプション</h2>
        <p className="section-note">
          検索バーでは使えるが、公式の高度な検索フォームにはない演算子です。
        </p>
        <div className="field-grid field-grid--3">
          <SelectField
            id="mediaFilter"
            label="メディア"
            hint={FIELD_HINTS.mediaFilter}
            value={conditions.mediaFilter}
            options={[
              { value: "all", label: "指定なし" },
              { value: "media", label: "画像・動画" },
              { value: "images", label: "画像のみ" },
              { value: "videos", label: "動画のみ" },
            ]}
            onChange={(v) =>
              onChange({ mediaFilter: v as SearchConditions["mediaFilter"] })
            }
          />
          <SelectField
            id="verifiedFilter"
            label="認証バッジ"
            hint={FIELD_HINTS.verifiedFilter}
            value={conditions.verifiedFilter}
            options={[
              { value: "all", label: "指定なし" },
              { value: "verified", label: "レガシー認証" },
              { value: "blue_verified", label: "X Premium" },
            ]}
            onChange={(v) =>
              onChange({ verifiedFilter: v as SearchConditions["verifiedFilter"] })
            }
          />
          <TriStateField
            id="quoteFilter"
            label="引用ツイート"
            hint={FIELD_HINTS.quoteFilter}
            value={conditions.quoteFilter}
            onChange={(v) => onChange({ quoteFilter: v })}
          />
          <TextField
            id="cashtags"
            label="キャッシュタグ ($)"
            hint={FIELD_HINTS.cashtags}
            value={conditions.cashtags}
            onChange={(v) => onChange({ cashtags: v })}
          />
          <TextField
            id="excludeFromAccounts"
            label="除外アカウント (-from:)"
            hint={FIELD_HINTS.excludeFromAccounts}
            value={conditions.excludeFromAccounts}
            onChange={(v) => onChange({ excludeFromAccounts: v })}
          />
          <TextField
            id="listId"
            label="リスト ID (list:)"
            hint={FIELD_HINTS.listId}
            value={conditions.listId}
            onChange={(v) => onChange({ listId: v })}
          />
          <TextField
            id="nearCity"
            label="場所 (near:)"
            hint={FIELD_HINTS.nearCity}
            value={conditions.nearCity}
            onChange={(v) => onChange({ nearCity: v })}
          />
          <NumberField
            id="withinRadius"
            label="半径 (within: mi)"
            hint={FIELD_HINTS.withinRadius}
            value={conditions.withinRadius}
            onChange={(v) => onChange({ withinRadius: v })}
          />
        </div>
        <div className="checkbox-row">
          <CheckboxField
            id="followsOnly"
            label="フォロー中のみ"
            hint={FIELD_HINTS.followsOnly}
            checked={conditions.followsOnly}
            onChange={(v) => onChange({ followsOnly: v })}
          />
        </div>
      </section>

      <div className="form-footer">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
          クリア
        </button>
      </div>
    </form>
  );
}
