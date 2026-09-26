import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.vtt': 'text/vtt; charset=utf-8' };
const publicFiles = new Set(['index.html', 'styles.css', 'app.js', 'content.js', 'piero-loop.wav', 'piero.ogg']);

const server = createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    const url = new URL(request.url, 'http://localhost');
    const name = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    const path = resolve(root, name);
    if (!path.startsWith(root + sep) || (!publicFiles.has(name) && !path.startsWith(resolve(root, 'assets') + sep))) {
      response.writeHead(404).end('Not found');
      return;
    }
    const file = await stat(path);
    if (!file.isFile()) throw new Error('Not a file');
    const headers = { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' };
    let start = 0;
    let end = file.size - 1;
    if (request.headers.range) {
      const range = request.headers.range.match(/^bytes=(\d*)-(\d*)$/);
      if (!range || (!range[1] && !range[2])) {
        response.writeHead(416, { 'Content-Range': `bytes */${file.size}` }).end();
        return;
      }
      if (!range[1]) start = Math.max(0, file.size - Number(range[2]));
      else {
        start = Number(range[1]);
        if (range[2]) end = Math.min(end, Number(range[2]));
      }
      if (start > end || start >= file.size) {
        response.writeHead(416, { 'Content-Range': `bytes */${file.size}` }).end();
        return;
      }
      headers['Content-Range'] = `bytes ${start}-${end}/${file.size}`;
    }
    headers['Content-Length'] = end - start + 1;
    response.writeHead(request.headers.range ? 206 : 200, headers);
    if (request.method === 'HEAD') response.end();
    else {
      const stream = createReadStream(path, { start, end });
      stream.on('error', () => response.destroy());
      response.on('close', () => stream.destroy());
      stream.pipe(response);
    }
  } catch {
    if (!response.headersSent) response.writeHead(404);
    response.end('Not found');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Pierology is ready at http://localhost:${port}`));
