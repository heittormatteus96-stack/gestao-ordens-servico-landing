const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };

http.createServer((request, response) => {
  const urlPath = request.url === '/' ? '/index.html' : decodeURIComponent(request.url.split('?')[0]);
  const filePath = path.resolve(root, `.${urlPath}`);
  if (!filePath.startsWith(root)) { response.writeHead(403); response.end('Forbidden'); return; }
  fs.readFile(filePath, (error, data) => {
    if (error) { response.writeHead(error.code === 'ENOENT' ? 404 : 500); response.end('Not found'); return; }
    response.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(data);
  });
}).listen(process.env.PORT || 4173, () => console.log(`Landing page available at http://localhost:${process.env.PORT || 4173}`));
