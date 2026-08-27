import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.CONTROL_LEDGER_PORT ?? 8088);
const contentTypes = { '.html': 'text/html; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8' };
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const requested = pathname === '/' ? 'operator-view.html' : pathname.slice(1);
  const target = path.resolve(root, requested);
  if (!target.startsWith(`${root}${path.sep}`) && target !== root) { response.writeHead(403); response.end('Forbidden'); return; }
  try {
    const details = await stat(target);
    if (!details.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'content-type': contentTypes[path.extname(target)] ?? 'application/octet-stream', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});
server.listen(port, () => console.log(`Control Ledger local view: http://localhost:${port}`));
