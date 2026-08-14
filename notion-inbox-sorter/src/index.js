import { config } from './config.js';
import { fetchInboxLines, archiveBlock } from './notionInbox.js';
import { classifyLines } from './claude.js';
import { createTaskPage, createKnowledgePage } from './notionDb.js';
import { createGoogleTask } from './googleTasks.js';

function todayISOInTimezone(timezone) {
  // "sv-SE" ロケールは YYYY-MM-DD 形式を返すため、日付計算の基準として利用する。
  return new Intl.DateTimeFormat('sv-SE', { timeZone: timezone }).format(new Date());
}

async function processItem(item) {
  if (item.type === 'TASK') {
    const googleTaskId = await createGoogleTask(item);
    await createTaskPage({ ...item, googleTaskId });
  } else if (item.type === 'KNOWLEDGE') {
    await createKnowledgePage(item);
  } else {
    throw new Error(`Unknown item type: "${item.type}"`);
  }
}

async function main() {
  const lines = await fetchInboxLines();
  if (lines.length === 0) {
    console.log('Inboxに未処理のテキストはありません。');
    return;
  }

  const indexedLines = lines.map((line, id) => ({ id, ...line }));
  const currentDate = todayISOInTimezone(config.timezone);

  console.log(`${indexedLines.length}件の行を取得しました。Claudeで分類します...`);
  const items = await classifyLines(indexedLines, currentDate);

  const itemsBySourceId = new Map();
  for (const item of items) {
    const list = itemsBySourceId.get(item.source_id) ?? [];
    list.push(item);
    itemsBySourceId.set(item.source_id, list);
  }

  let processedCount = 0;
  let failedCount = 0;

  for (const line of indexedLines) {
    const relatedItems = itemsBySourceId.get(line.id);

    if (!relatedItems || relatedItems.length === 0) {
      console.warn(`[skip] line ${line.id} は分類結果に含まれていませんでした: "${line.text}"`);
      continue;
    }

    try {
      for (const item of relatedItems) {
        await processItem(item);
      }
      await archiveBlock(line.blockId);
      processedCount += 1;
      console.log(`[done] line ${line.id} を処理してInboxから削除しました: "${line.text}"`);
    } catch (err) {
      failedCount += 1;
      console.error(`[error] line ${line.id} の処理に失敗しました（Inboxに残します）: "${line.text}"`, err);
    }
  }

  console.log(`完了: ${processedCount}件処理 / ${failedCount}件失敗`);
}

main().catch((err) => {
  console.error('致命的なエラーが発生しました:', err);
  process.exitCode = 1;
});
