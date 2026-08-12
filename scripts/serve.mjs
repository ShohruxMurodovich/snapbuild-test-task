/**
 * Простой статический сервер для проверки собранного экспорта:
 * npm run build && npm run preview → http://127.0.0.1:4173/
 *
 * Отдаёт out/ и умеет basePath: если сборка сделана с
 * NEXT_PUBLIC_BASE_PATH=/snapbuild-test-task, страница будет доступна
 * и по /snapbuild-test-task/, и по /.
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('out');
const port = Number(process.env.PORT ?? 4173);
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const resolveFile = async (urlPath) => {
  const candidates = [urlPath, path.join(urlPath, 'index.html'), `${urlPath}.html`];
  for (const candidate of candidates) {
    const file = path.join(root, candidate);
    if (!file.startsWith(root)) continue;
    try {
      const info = await stat(file);
      if (info.isFile()) return file;
    } catch {
      /* пробуем следующий вариант */
    }
  }
  return null;
};

createServer(async (request, response) => {
  let urlPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (basePath && urlPath.startsWith(basePath)) urlPath = urlPath.slice(basePath.length) || '/';

  const file = (await resolveFile(urlPath)) ?? (await resolveFile('/404.html'));
  if (!file) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('404');
    return;
  }

  response.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`out/ → http://127.0.0.1:${port}${basePath}/`);
});
