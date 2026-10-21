import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const files = new Map([
  ['/', ['index.html', 'text/html']],
  ['/app.js', ['app.js', 'text/javascript']],
  ['/style.css', ['style.css', 'text/css']],
  ['/data/input.json', ['data/input.json', 'application/json']],
  ['/data/ai-candidates.json', ['data/ai-candidates.json', 'application/json']],
]);
const server = createServer(async (req, res) => {
  const file = files.get(req.url);
  if (req.method !== 'GET' || !file) return void res.writeHead(404).end('Not found');
  try {
    res.writeHead(200, {
      'Content-Type': `${file[1]}; charset=utf-8`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    }).end(await readFile(new URL(file[0], import.meta.url)));
  } catch { res.writeHead(500).end('File unavailable'); }
});
server.listen(Number(process.env.PORT || 4192), '127.0.0.1', () => console.log('資料の修正範囲確認デモを起動しました'));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
