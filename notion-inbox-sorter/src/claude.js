import Anthropic from '@anthropic-ai/sdk';
import { config } from './config.js';

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

const SYSTEM_PROMPT = `あなたはNotionのInboxメモを分類するアシスタントです。
入力される複数行のメモ（各行に source_id が付与されています）を読み取り、
それぞれを "TASK"（やるべき作業）または "KNOWLEDGE"（アイデア・メモ・ノウハウなど記録目的の情報）に分類してください。

ルール:
- 1行から複数の項目が抽出できる場合は、それぞれを個別の要素として出力してください（source_idは元の行のidを共通で使用）。
- 1行が空・意味を持たない・分類不能な場合はその行を出力から省略してください。
- due_date は TASK かつ、期日が本文から読み取れる場合のみ設定してください。「明日」「来週金曜」等の相対表現は、与えられた current_date を基準に絶対日付(YYYY-MM-DD)へ変換してください。読み取れない場合は null にしてください。
- category は TASK / KNOWLEDGE 共通で、内容に応じた短い日本語（例: 仕事, プライベート, アイデア, メモ, ノウハウ）を設定してください。
- title は内容を要約した短い見出しにしてください。
- content_summary は1〜2文程度の要約にしてください。

出力は必ず以下のスキーマに従うJSON配列のみとし、他の文章・コードフェンス・説明は一切含めないでください。

[
  {
    "source_id": number,
    "raw_text": string,
    "type": "TASK" | "KNOWLEDGE",
    "title": string,
    "due_date": string | null,
    "category": string,
    "content_summary": string
  }
]`;

function extractJsonArray(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Failed to locate a JSON array in Claude response: ${text}`);
  }
  return text.slice(start, end + 1);
}

/**
 * @param {{id: number, text: string}[]} lines
 * @param {string} currentDateISO - "YYYY-MM-DD"
 * @returns {Promise<Array<object>>}
 */
export async function classifyLines(lines, currentDateISO) {
  const userPayload = {
    current_date: currentDateISO,
    lines: lines.map((l) => ({ id: l.id, text: l.text })),
  };

  const response = await anthropic.messages.create({
    model: config.claudeModel,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: JSON.stringify(userPayload, null, 2) }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock) {
    throw new Error('Claude returned no text content');
  }

  const parsed = JSON.parse(extractJsonArray(textBlock.text));
  if (!Array.isArray(parsed)) {
    throw new Error('Claude did not return a JSON array');
  }
  return parsed;
}
