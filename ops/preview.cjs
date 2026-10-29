const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../TigersTeamReact/build');
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
http.createServer((req, res) => {
  let name;
  try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  if (name.startsWith('/api/')) {
    proxy(req, res, req.url.replace(/^\/api/, ''));
    return;
  }
  if (name.startsWith('/static/images/')) { proxy(req, res, req.url); return; }
  let file = path.resolve(root, '.' + name);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) file = path.join(root, 'index.html');
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
}).listen(3000, '127.0.0.1', () => console.log('Preview ready: http://localhost:3000'));

function proxy(req, res, url) {
  const upstream = http.request({ host: '127.0.0.1', port: 8081, path: url,
    method: req.method, headers: { ...req.headers, host: '127.0.0.1:8081' } }, response => {
    res.writeHead(response.statusCode, response.headers);
    response.pipe(res);
  });
  upstream.on('error', () => {
    if (!res.headersSent) res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ detail: 'Backend unavailable. Run node ops/start-local.cjs.' }));
  });
  req.pipe(upstream);
}
