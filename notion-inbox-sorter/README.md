# Notion Inbox 自動仕分けシステム

iPhone（Siri / ショートカット）からNotionの1ページ（Inbox）に箇条書きで投げ込んだメモを、
5時間ごとに定期実行してClaude APIで「タスク」「ナレッジ」に自動分類し、
Google Tasks / Notionの各DBに振り分けて、処理済みのメモはInboxから削除するバッチです。

## データフロー

1. iPhoneのSiri / ショートカットで、Notionの指定ページ（Inbox）に箇条書きテキストを追記する。
2. GitHub Actions（5時間ごとのcron）がこのスクリプトを実行する。
3. Inboxページ直下のテキストブロック（段落 / 箇条書き / 番号付きリスト / To do）を取得する。
4. Claude API に渡し、各行を `TASK` または `KNOWLEDGE` に分類した構造化JSONを取得する。
5. `TASK` → Google Tasksにタスクを作成し、Notion「タスク管理DB」にもレコードを作成する（Google Task IDを保存）。
   `KNOWLEDGE` → Notion「ナレッジDB」にレコードを作成する。
6. 全ての振り分けが成功した行はInboxページからアーカイブ（削除）する。失敗した行は次回実行のために残す。

## 事前準備

### 1. Notion側

1. [Notion Integrations](https://www.notion.so/my-integrations) でIntegrationを作成し、Internal Integration Secretを取得する（`NOTION_API_KEY`）。
2. Inboxページ、タスク管理DB、ナレッジDBのそれぞれに、作成したIntegrationを「接続」（Connect）する。
3. 各ページ/DBのIDをURLから取得する（`NOTION_INBOX_PAGE_ID` / `NOTION_TASK_DB_ID` / `NOTION_KNOWLEDGE_DB_ID`）。

タスク管理DBに必要なプロパティ:

| プロパティ名 | 種類 |
| --- | --- |
| タイトル | タイトル |
| 期限 | 日付 |
| ステータス | ステータス（「未着手」を含む） |
| Google Task ID | テキスト |

ナレッジDBに必要なプロパティ:

| プロパティ名 | 種類 |
| --- | --- |
| タイトル | タイトル |
| カテゴリ | セレクト |
| タグ | マルチセレクト |
| 作成日 | 日付 |

### 2. Claude API

[Anthropic Console](https://console.anthropic.com/) でAPIキーを発行する（`ANTHROPIC_API_KEY`）。

### 3. Google Tasks

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成し、Tasks APIを有効化する。
2. OAuth同意画面を設定し、OAuthクライアントID（アプリケーションの種類: **デスクトップアプリ**）を作成する（`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`）。
3. ローカルで以下を実行し、リフレッシュトークンを取得する（`GOOGLE_REFRESH_TOKEN`）。

   ```bash
   cd notion-inbox-sorter
   cp .env.example .env
   # .env に GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET を設定
   npm install
   npm run auth:google
   ```

   表示されたURLをブラウザで開いて認可すると、ターミナルにリフレッシュトークンが出力される。

## 環境変数

`.env.example` を参照。ローカル実行時は `.env` に、GitHub Actionsで実行する場合はリポジトリの
**Settings → Secrets and variables → Actions** に、それぞれ以下を設定する。

Secrets（機密情報）:

- `ANTHROPIC_API_KEY`
- `NOTION_API_KEY`
- `NOTION_INBOX_PAGE_ID`
- `NOTION_TASK_DB_ID`
- `NOTION_KNOWLEDGE_DB_ID`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

Variables（任意・デフォルト値あり）:

- `CLAUDE_MODEL`（既定値: `claude-sonnet-5`）
- `GOOGLE_TASKLIST_ID`（既定値: `@default`）
- `TIMEZONE`（既定値: `Asia/Tokyo`）

## ローカル実行

```bash
cd notion-inbox-sorter
npm install
npm start
```

## 定期実行（GitHub Actions）

`.github/workflows/notion-inbox-sync.yml` により5時間ごとに自動実行される
（`workflow_dispatch` で手動実行も可能）。上記のSecrets/Variablesをリポジトリに設定すれば動作する。

## 実装メモ

- Claudeへの入力は、Inboxの各行に連番の `source_id` を付与した上でまとめて渡す。1行から複数の項目
  （例: 1つの箇条書きにタスクとメモが混在している場合）が抽出された場合はそれぞれ個別に処理し、
  紐づく全ての項目の作成に成功した時点で元の行をアーカイブする。一部失敗した場合はその行をInboxに残し、
  次回実行時に再試行する。
- Notionブロックの削除は完全削除ではなく `archived: true` によるアーカイブ（Notion上のゴミ箱行き）。
