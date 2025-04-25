import express from 'express';
import http from 'http';
import { spawn } from 'child_process';

const app = express();
app.use(express.json());
const PORT = +process.env.PORT! || 10000;

// Healthcheck
app.get('/health', (_req, res) => res.send('OK'));

// JSON‐RPC endpoint, proxy al CLI de tu MCP
app.post('/rpc', (req, res) => {
  // 1) Spawnea tu CLI directamente desde dist/index.js
  //    que rslib buildó como binario STDIO
  const child = spawn('node', ['dist/index.cjs'], {
    stdio: ['pipe', 'pipe', 'inherit'],
  });

  // 2) Envía el JSON‐RPC por stdin
  child.stdin.write(JSON.stringify(req.body));
  child.stdin.end();

  // 3) Recoge stdout y devuélvelo como JSON
  let stdout = '';
  child.stdout.on('data', (chunk) => {
    stdout += chunk;
  });

  child.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send(`MCP exited with code ${code}`);
    }
    try {
      return res.json(JSON.parse(stdout));
    } catch {
      return res.status(502).send(stdout);
    }
  });
});

http.createServer(app).listen(PORT, () => {
  console.log(`🚀 MCP HTTP wrapper listening on http://0.0.0.0:${PORT}/rpc`);
});