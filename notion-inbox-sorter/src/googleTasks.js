import { google } from 'googleapis';
import { config } from './config.js';

function getTasksClient() {
  const oauth2Client = new google.auth.OAuth2(config.googleClientId, config.googleClientSecret);
  oauth2Client.setCredentials({ refresh_token: config.googleRefreshToken });
  return google.tasks({ version: 'v1', auth: oauth2Client });
}

/**
 * Google Tasksにタスクを作成し、作成されたタスクIDを返す。
 */
export async function createGoogleTask(item) {
  const tasks = getTasksClient();

  const requestBody = {
    title: item.title,
  };
  if (item.content_summary) {
    requestBody.notes = item.content_summary;
  }
  if (item.due_date) {
    // Google Tasks の due は日付のみ扱われる（時刻部分は無視される）ため UTC 0時で送る。
    requestBody.due = new Date(`${item.due_date}T00:00:00Z`).toISOString();
  }

  const res = await tasks.tasks.insert({
    tasklist: config.googleTasklistId,
    requestBody,
  });

  return res.data.id;
}
