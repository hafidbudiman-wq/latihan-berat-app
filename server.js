const http = require('http');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const port = process.env.PORT || 3000;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function send(res, status, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'content-type': contentType });
  res.end(body);
}

http.createServer((req, res) => {
  const requestPath = decodeURIComponent(req.url.split('?')[0]);

  if (requestPath === '/health') {
    send(res, 200, JSON.stringify({ ok: true, service: 'latihan-berat-app' }), 'application/json; charset=utf-8');
    return;
  }

  const urlPath = requestPath === '/' ? '/index.html' : requestPath;
  const safePath = path.normalize(urlPath).replace(/^([.][.][\/])+/, '');
  const filePath = path.join(publicDir, safePath);

  if (!filePath.startsWith(publicDir)) {
    send(res, 403, 'Akses ditolak');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      send(res, 404, 'Halaman tidak ditemukan');
      return;
    }

    send(res, 200, content, types[path.extname(filePath)] || 'application/octet-stream');
  });
}).listen(port, () => console.log(`Latihan Berat App running on http://localhost:${port}`));
