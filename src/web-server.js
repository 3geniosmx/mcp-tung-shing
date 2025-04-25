// src/web-server.js

import express from 'express';
import http from 'http';

// 1) Importa la clase McpServer
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// 2) Importa tu plugin (herramientas) generado por rslib
import plugin from './index.js';

// 3) Importa el transport HTTP/SSE
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

(async () => {
  const app = express();
  app.use(express.json());
  const PORT = process.env.PORT || 10000;

  // 4) Crea el MCP y registra el plugin
  const mcp = new McpServer({ name: 'tung-shing-mcp', version: '1.7.1' });
  mcp.use(plugin);

  // 5) Montea el transport en /rpc
  const transport = new StreamableHTTPServerTransport({ path: '/rpc', app });
  await mcp.connect(transport);

  // 6) Healthcheck
  app.get('/health', (_req, res) => res.send('OK'));

  // 7) Arranca el HTTP server
  http.createServer(app).listen(PORT, () =>
    console.log(`🚀 MCP HTTP/SSE listening on http://0.0.0.0:${PORT}/rpc`)
  );
})();