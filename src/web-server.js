import express from 'express';
import http from 'http';
import { createServer as createMcpServer } from '@modelcontextprotocol/sdk/server';
import plugin from './dist/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

(async () => {
  const app = express();
  app.use(express.json());
  const PORT = process.env.PORT || 10000;

  // 1) Crea el servidor MCP base
  const mcp = createMcpServer({ name: 'TungShing', version: '1.7.1' });

  // 2) Registra tu plugin (herramientas y recursos)
  mcp.use(plugin);

  // 3) Monta el transport HTTP JSON-RPC en /rpc
  const transport = new StreamableHTTPServerTransport({ path: '/rpc' });
  await mcp.connect(transport);

  // 4) Expón el endpoint
  app.post('/rpc', transport.handleRequest.bind(transport));
  app.get('/health', (_req, res) => res.send('OK'));

  // 5) Arranca el HTTP server
  http.createServer(app).listen(PORT, () => {
    console.log(`🚀 MCP HTTP listening on http://0.0.0.0:${PORT}/rpc`);
  });
})();