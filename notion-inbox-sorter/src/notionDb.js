import { notion } from './notionClient.js';
import { config } from './config.js';

function summaryBlockChildren(item) {
  if (!item.content_summary) return [];
  return [
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: item.content_summary } }],
      },
    },
  ];
}

/**
 * タスク管理DBにレコードを作成する。
 * プロパティ: タイトル(title) / 期限(date) / ステータス(select) / Google Task ID(rich_text)
 */
export async function createTaskPage(item) {
  const properties = {
    'タイトル': { title: [{ text: { content: item.title } }] },
    'ステータス': { select: { name: '未着手' } },
  };

  if (item.due_date) {
    properties['期限'] = { date: { start: item.due_date } };
  }

  if (item.googleTaskId) {
    properties['Google Task ID'] = {
      rich_text: [{ text: { content: item.googleTaskId } }],
    };
  }

  return notion.pages.create({
    parent: { database_id: config.notionTaskDbId },
    properties,
    children: summaryBlockChildren(item),
  });
}

/**
 * ナレッジDBにレコードを作成する。
 * プロパティ: タイトル(title) / カテゴリ(select) / タグ(multi_select) / 作成日(date)
 */
export async function createKnowledgePage(item) {
  const properties = {
    'タイトル': { title: [{ text: { content: item.title } }] },
    '作成日': { date: { start: new Date().toISOString().slice(0, 10) } },
  };

  if (item.category) {
    properties['カテゴリ'] = { select: { name: item.category } };
    properties['タグ'] = { multi_select: [{ name: item.category }] };
  }

  return notion.pages.create({
    parent: { database_id: config.notionKnowledgeDbId },
    properties,
    children: summaryBlockChildren(item),
  });
}
