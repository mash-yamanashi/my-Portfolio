import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  anthropicApiKey: required('ANTHROPIC_API_KEY'),
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-5',

  notionApiKey: required('NOTION_API_KEY'),
  notionInboxPageId: required('NOTION_INBOX_PAGE_ID'),
  notionTaskDbId: required('NOTION_TASK_DB_ID'),
  notionKnowledgeDbId: required('NOTION_KNOWLEDGE_DB_ID'),

  googleClientId: required('GOOGLE_CLIENT_ID'),
  googleClientSecret: required('GOOGLE_CLIENT_SECRET'),
  googleRefreshToken: required('GOOGLE_REFRESH_TOKEN'),
  googleTasklistId: process.env.GOOGLE_TASKLIST_ID || '@default',

  timezone: process.env.TIMEZONE || 'Asia/Tokyo',
};
