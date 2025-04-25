// web-server.js
import express from 'express';
import http from 'http';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const indexPath = resolve(__dirname, 'mcp-server.js');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;

// Healthcheck
app.get('/health', (_req, res) => res.send('OK'));

// JSON-RPC proxy al CLI
app.post('/rpc', (req, res) => {
  // Lanza tu CLI empaquetado en dist/index.cjs
  const indexPath = resolve(__dirname, 'index.cjs');
  const child = spawn('node', [indexPath], {
    stdio: ['pipe','pipe','inherit'],
  });

  // Envía la petición JSON-RPC al stdin del proceso
  child.stdin.write(JSON.stringify(req.body));
  child.stdin.end();

  // Acumula stdout
  let raw = '';
  child.stdout.on('data', (chunk) => (raw += chunk.toString()));

  child.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send(`MCP CLI exited with ${code}`);
    }
    try {
      const json = JSON.parse(raw);
      res.json(json);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      res.status(502).send(raw);
    }
  });
});

http.createServer(app).listen(PORT, () => {
  console.log(`🚀 MCP wrapper listening on http://0.0.0.0:${PORT}/rpc`);
});