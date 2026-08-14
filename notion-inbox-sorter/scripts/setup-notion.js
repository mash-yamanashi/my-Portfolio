import { Client } from '@notionhq/client';

// Notion側の「Inboxページ」「タスク管理DB」「ナレッジDB」を自動作成する初回セットアップ用スクリプト。
// 実行前に、あなたのNotion Integrationを ROOT_PAGE_ID のページに Connect しておくこと。
//
// 実行例:
//   NOTION_API_KEY=ntn_xxx ROOT_PAGE_ID=xxxx node scripts/setup-notion.js

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const ROOT_PAGE_ID = process.env.ROOT_PAGE_ID;

if (!NOTION_API_KEY || !ROOT_PAGE_ID) {
  console.error('NOTION_API_KEY と ROOT_PAGE_ID を環境変数で指定してください。');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

async function main() {
  console.log('Inboxページを作成しています...');
  const inboxPage = await notion.pages.create({
    parent: { page_id: ROOT_PAGE_ID },
    icon: { type: 'emoji', emoji: '📥' },
    properties: {
      title: { title: [{ text: { content: 'Inbox' } }] },
    },
  });
  console.log(`  -> Inboxページを作成しました: ${inboxPage.id}`);

  console.log('タスク管理DBを作成しています...');
  const taskDb = await notion.databases.create({
    parent: { page_id: ROOT_PAGE_ID },
    title: [{ type: 'text', text: { content: 'タスク管理' } }],
    properties: {
      'タイトル': { title: {} },
      '期限': { date: {} },
      'ステータス': {
        select: {
          options: [
            { name: '未着手', color: 'red' },
            { name: '進行中', color: 'yellow' },
            { name: '完了', color: 'green' },
          ],
        },
      },
      'Google Task ID': { rich_text: {} },
    },
  });
  console.log(`  -> タスク管理DBを作成しました: ${taskDb.id}`);

  console.log('ナレッジDBを作成しています...');
  const knowledgeDb = await notion.databases.create({
    parent: { page_id: ROOT_PAGE_ID },
    title: [{ type: 'text', text: { content: 'ナレッジ' } }],
    properties: {
      'タイトル': { title: {} },
      'カテゴリ': {
        select: {
          options: [
            { name: 'アイデア', color: 'blue' },
            { name: 'メモ', color: 'default' },
            { name: 'ノウハウ', color: 'purple' },
            { name: '仕事', color: 'orange' },
            { name: 'プライベート', color: 'pink' },
          ],
        },
      },
      'タグ': { multi_select: {} },
      '作成日': { date: {} },
    },
  });
  console.log(`  -> ナレッジDBを作成しました: ${knowledgeDb.id}`);

  console.log('\n以下をGitHub Secretsに設定してください:\n');
  console.log(`NOTION_INBOX_PAGE_ID=${inboxPage.id}`);
  console.log(`NOTION_TASK_DB_ID=${taskDb.id}`);
  console.log(`NOTION_KNOWLEDGE_DB_ID=${knowledgeDb.id}`);
}

main().catch((err) => {
  console.error('セットアップに失敗しました:', err.body ?? err);
  process.exit(1);
});
