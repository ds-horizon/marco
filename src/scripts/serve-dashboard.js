#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

module.exports = function serveDashboard(port, outputPathDir) {
  const appRoot = process.env.INIT_CWD || process.cwd();
  const outputPath = path.resolve(appRoot, outputPathDir);
  const folderPath = path.resolve(
    process.cwd(),
    'node_modules/dream11-react-native-performance-tracker/dist'
  );

  const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      // Serve index.html
      const indexPath = path.join(folderPath, 'index.html');
      fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading index.html:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
    } else if (req.url.startsWith('/api/log')) {
      const logPath = path.join(outputPath, 'log.json');

      // Check if logPath exists and is a file
      if (!fs.existsSync(logPath)) {
        console.error('log.json does not exist:', logPath);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('log.json not found');
        return;
      }

      // Serve log.json
      fs.readFile(logPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading log.json:', err);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });
    } else if (req.url === '/bundle.js') {
      // Serve bundle.js
      const bundlePath = path.join(folderPath, 'bundle.js');
      fs.readFile(bundlePath, (err, data) => {
        if (err) {
          console.error('Error reading bundle.js:', err);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      });
    } else {
      // Serve 404 for other routes
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};
