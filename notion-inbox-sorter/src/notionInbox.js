import { notion } from './notionClient.js';
import { config } from './config.js';

// Inboxページ上でSiriショートカット等が追記しうるテキスト系ブロックのみを対象にする。
const TEXT_BLOCK_TYPES = new Set([
  'paragraph',
  'bulleted_list_item',
  'numbered_list_item',
  'to_do',
]);

function extractPlainText(block) {
  const richText = block[block.type]?.rich_text;
  if (!richText) return '';
  return richText.map((t) => t.plain_text).join('').trim();
}

/**
 * Inboxページ直下のテキストブロックを取得する。
 * 戻り値: [{ blockId, text }]
 */
export async function fetchInboxLines() {
  const lines = [];
  let cursor;

  do {
    const res = await notion.blocks.children.list({
      block_id: config.notionInboxPageId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const block of res.results) {
      if (block.archived) continue;
      if (!TEXT_BLOCK_TYPES.has(block.type)) continue;
      const text = extractPlainText(block);
      if (!text) continue;
      lines.push({ blockId: block.id, text });
    }

    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);

  return lines;
}

/** 処理済みのブロックをアーカイブ（Notion上では削除扱い）する。 */
export async function archiveBlock(blockId) {
  await notion.blocks.update({ block_id: blockId, archived: true });
}
