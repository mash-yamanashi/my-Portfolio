# ============================================================
#  my-agent セットアップスクリプト（Claude Code + MCP 方式）
#  使い方: PowerShell で  .\setup.ps1  を実行
#  作成先: デスクトップ\my-agent
# ============================================================
$ErrorActionPreference = 'Stop'
$root = Join-Path ([Environment]::GetFolderPath('Desktop')) 'my-agent'
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Save($rel, $text) {
    $path = Join-Path $root $rel
    New-Item -ItemType Directory -Force -Path (Split-Path $path) | Out-Null
    if (Test-Path $path) { Write-Host "スキップ（既存）: $rel"; return }
    [IO.File]::WriteAllText($path, $text, $utf8)
    Write-Host "作成: $rel"
}

New-Item -ItemType Directory -Force -Path $root, "$root\workspace", "$root\logs" | Out-Null

# ---------- CLAUDE.md : エージェントの人格とルール ----------
Save 'CLAUDE.md' @'
# My Agent

あなたはユーザー専属の「何でもやるエージェント」です。

## 話し方
- 丁寧な敬語で、簡潔に答える。

## 行動ルール
- コスパ優先。簡単な作業は手短に済ませ、無駄な調査や長文を避ける。
- 迷ったら作業前に確認する。特に次は必ず事前確認する:
  - メール送信・投稿・予定の作成/削除など、外部に出る操作
  - ファイルの削除・上書き
  - 課金が発生する操作
- 外部API・外部サービスも選択肢に入れ、複数案があれば比較して推奨を1つ示す。
- 成果物は `workspace/` に保存する。作業記録は `logs/` に残す。

## 使える連携（MCP）
- Gmail / Google カレンダー / Google ドライブ / Notion / Todoist / Slack / Canva
  （claude.ai で接続済みのコネクタ。`/mcp` で確認）
- Playwright: ブラウザ操作（Webサイトの閲覧・入力・スクリーンショット）

## スキル
- `/morning` 相当の朝のまとめ: `.claude/skills/daily-brief`
- 調べもの: `.claude/skills/research`
'@

# ---------- MCP 設定 : ブラウザ操作 ----------
Save '.mcp.json' @'
{
  "mcpServers": {
    "playwright": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@playwright/mcp@latest", "--headless"]
    }
  }
}
'@

# ---------- 権限設定 : 読み取り系は確認なし、危険操作は拒否 ----------
Save '.claude\settings.json' @'
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "WebSearch",
      "WebFetch",
      "Write(./workspace/**)",
      "Write(./logs/**)",
      "mcp__playwright__browser_navigate",
      "mcp__playwright__browser_snapshot",
      "mcp__playwright__browser_take_screenshot"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(Remove-Item * -Recurse*)",
      "Bash(format *)"
    ]
  },
  "enableAllProjectMcpServers": true
}
'@

# ---------- スキル: 朝のまとめ ----------
Save '.claude\skills\daily-brief\SKILL.md' @'
---
name: daily-brief
description: 今日の予定・未読メール・タスクをまとめて報告する。「朝のまとめ」「今日の予定」などで使う。
---
1. Google カレンダーから今日の予定を取得する。
2. Gmail で過去24時間の未読・重要メールを検索し、要対応のものだけ抜き出す。
3. Todoist で今日期限・期限切れのタスクを取得する。
4. 次の形式で `workspace/brief-YYYY-MM-DD.md` に保存し、要点を3行で報告する:
   - 今日の予定 / 要返信メール / 今日のタスク / おすすめの優先順位
メールの返信や予定変更は、提案に留めて実行前に確認すること。
'@

# ---------- スキル: 調べもの ----------
Save '.claude\skills\research\SKILL.md' @'
---
name: research
description: Web で調べて比較・要約する。「調べて」「比較して」「おすすめは」などで使う。
---
1. まず WebSearch で概要をつかむ（検索は3回程度まで。足りなければ追加）。
2. 必要なページだけ WebFetch で読む。ログインが要るサイトは Playwright を使う。
3. 結論 → 比較表 → 根拠URL の順で `workspace/` に Markdown で保存する。
4. 費用が関わる場合は、無料/有料の選択肢を両方示し、コスパの良い案を推奨する。
'@

# ---------- README ----------
Save 'README.md' @'
# my-agent

Claude Code + MCP で動く、自分専用エージェントです。

## 起動
```
cd $HOME\Desktop\my-agent
claude
```
外出先のスマホから使う場合は `claude remote-control` で起動し、Claude アプリから接続します。

## 育て方
- 新しい定型作業は `.claude/skills/<名前>/SKILL.md` に手順を書いて追加する。
- 守ってほしいルールは `CLAUDE.md` に追記する。
- 新しい外部サービスは `.mcp.json` に MCP サーバーを追加する。
'@

Write-Host ""
Write-Host "完了しました: $root"
Write-Host "次の手順:  cd `"$root`"  ->  claude remote-control"
