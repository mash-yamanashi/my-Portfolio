import 'dotenv/config';
import http from 'node:http';
import { google } from 'googleapis';

// Google TasksへアクセスするためのOAuth2 refresh tokenをローカルで一度だけ取得するためのスクリプト。
// Google Cloud Consoleで「デスクトップアプリ」タイプのOAuthクライアントを作成して実行すること。

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const PORT = 53682;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET を .env に設定してから実行してください。');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/tasks'],
});

console.log('以下のURLをブラウザで開いて、Googleアカウントで認可してください:\n');
console.log(authUrl);
console.log(`\nローカルサーバー(http://localhost:${PORT})で認可完了を待機しています...`);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, REDIRECT_URI);
    if (url.pathname !== '/oauth2callback') {
      res.writeHead(404);
      res.end();
      return;
    }

    const code = url.searchParams.get('code');
    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('認可コード(code)が見つかりませんでした。');
      return;
    }

    const { tokens } = await oauth2Client.getToken(code);

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('認可が完了しました。このタブは閉じてターミナルに戻ってください。');

    console.log('\n取得したrefresh tokenを .env / GitHub Secrets の GOOGLE_REFRESH_TOKEN に設定してください:\n');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);

    server.close(() => process.exit(0));
  } catch (err) {
    console.error('トークン取得に失敗しました:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('エラーが発生しました。ターミナルを確認してください。');
    server.close(() => process.exit(1));
  }
});

server.listen(PORT);
