const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const distPath = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url);
  
  // For SPA routing, serve index.html for non-file requests
  if (!path.extname(filePath) && !fs.existsSync(filePath)) {
    filePath = path.join(distPath, 'index.html');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Serve index.html for 404s (SPA routing)
        fs.readFile(path.join(distPath, 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Server Error');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf8');
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Bitcoin Dad Ledger server running on http://0.0.0.0:${port}`);
  console.log(`📱 Ready to serve the Bitcoin Dad Ledger!`);
});

// Keep server alive
process.on('SIGTERM', () => {
  console.log('Server shutting down...');
  server.close();
});

process.on('SIGINT', () => {
  console.log('Server shutting down...');
  server.close();
});