// src/web-server.js

import express from 'express';
import http from 'http';

// 1) Importa la clase McpServer desde el fichero mcp.js del SDK
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// 2) Importa tu plugin (herramientas) generado por rslib
import plugin from './dist/index.js';

// 3) Importa el transport HTTP/SSE
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

(async () => {
  const app = express();
  app.use(express.json());
  const PORT = process.env.PORT || 10000;

  // 4) Crea tu servidor MCP usando la clase correcta y registra tu plugin
  const mcp = new McpServer({ name: 'tung-shing-mcp', version: '1.7.1' });
  mcp.use(plugin);

  // 5) Monta el transport HTTP/SSE en /rpc
  const transport = new StreamableHTTPServerTransport({ path: '/rpc', app });
  await mcp.connect(transport);

  // 6) Healthcheck
  app.get('/health', (_req, res) => res.send('OK'));

  // 7) Arranca el servidor HTTP
  http.createServer(app).listen(PORT, () => {
    console.log(`🚀 MCP HTTP/SSE listening on http://0.0.0.0:${PORT}/rpc`);
  });
})();