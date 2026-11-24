import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const site = fileURLToPath(new URL('../site/', import.meta.url));
const prefix = '/demo/';
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.wasm':'application/wasm', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.mp4':'video/mp4', '.ttf':'font/ttf' };
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (!url.pathname.startsWith(prefix)) return response.writeHead(404).end();
    let file = path.resolve(site, decodeURIComponent(url.pathname.slice(prefix.length)));
    if (file !== path.resolve(site) && !file.startsWith(site)) return response.writeHead(404).end();
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const {size} = await stat(file);
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': size });
    createReadStream(file).on('error', ()=>response.destroy()).pipe(response);
  } catch { response.writeHead(404).end(); }
}).listen(Number(process.env.DEMO_PORT || 4194), '127.0.0.1', () => {
  console.log('Demo Pages http://127.0.0.1:' + (process.env.DEMO_PORT || '4194') + '/demo/');
});
