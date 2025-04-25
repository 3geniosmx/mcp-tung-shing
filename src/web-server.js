// src/web-server.js
import express from 'express';
import { createServer as createHttpServer } from 'http';
// IMPORTA tu core MCP desde index.js (dist/index.js tras build)
import { createServer as createMcpServer } from './index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

(async () => {
  const app = express();
  app.use(express.json());
  const PORT = process.env.PORT || 10000;

  // 1) Crea tu core MCP
  const mcp = createMcpServer();

  // 2) Monta el transport HTTP JSON-RPC en /rpc
  const transport = new StreamableHTTPServerTransport({ path: '/rpc' });
  await mcp.connect(transport);

  // 3) Expone JSON-RPC
  app.post('/rpc', transport.handleRequest.bind(transport));

  // 4) Healthcheck e info
  app.get('/health', (_req, res) => res.send('OK'));
  app.get('/', (_req, res) => {
    res.json({ name: 'Tung Shing MCP', status: 'running' });
  });

  // 5) Arranca HTTP
  createHttpServer(app).listen(PORT, () => {
    console.log(`🚀 MCP HTTP listening on http://0.0.0.0:${PORT}/rpc`);
  });
})();