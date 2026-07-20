# X 検索条件ビルダー

X（Twitter）の検索条件をわかりやすい UI で構築し、生成したクエリをそのまま本物の X 検索に渡す Web アプリです。

[公式の高度な検索](https://x.com/search-advanced) を参考に、キーワード・アカウント・フィルター・日付をフォームで指定できます。

## 機能

- **キーワード**: すべて含む / フレーズ / いずれか / 除外 / ハッシュタグ / 言語
- **アカウント**: 投稿者（`from:`）/ 返信先（`to:`）/ メンション（`@`）
- **フィルター**: 返信・リンク・リツイート、最小返信数・いいね数・リツイート数
- **日付**: `since:` / `until:`（YYYY-MM-DD）
- **リアルタイムプレビュー**: 生成クエリの確認・コピー
- **X で検索**: 最新タブ / トップタブを新しいタブで開く

## 開発

```bash
npm install
npm run dev
```

http://localhost:5173 で確認できます。

## ビルド

```bash
npm run build
```

`dist/` に静的ファイルが出力されます。

## Cloudflare へのデプロイ

### Wrangler CLI

```bash
npm run deploy
```

初回は `npx wrangler login` で Cloudflare にログインしてください。

### Cloudflare Pages（Git 連携）

1. リポジトリを Cloudflare Pages に接続
2. ビルドコマンド: `npm run build`
3. 出力ディレクトリ: `dist`
4. フレームワーク: Vite

`wrangler.jsonc` は Workers の静的アセット配信（SPA 対応）用の設定です。

## 技術スタック

- React 19 + TypeScript
- Vite 6
- Cloudflare Workers（静的アセット / Pages）

## 注意事項

- 検索演算子の動作は X 側の仕様変更の影響を受けます
- 日付フィルターは UTC で評価されます
- `until:` は指定日を**含みません**（公式仕様と同様）
- ログインや検索結果の表示は X 側で行われます（本アプリはクエリ生成のみ）
