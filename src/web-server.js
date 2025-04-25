import express from 'express';
import { createServer as createHttpServer } from 'http';
import { createServer } from './server.js';  // tu MCP core
import { HTTPServerTransport } from '@modelcontextprotocol/sdk/server/http.js';

(async () => {
  // 1. Crear app Express
  const app = express();
  app.use(express.json());         // para body JSON
  const PORT = process.env.PORT || 10000;

  // 2. Instanciar tu servidor MCP y montar el transport HTTP
  const mcp = createServer();
  const transport = new HTTPServerTransport({
    path: '/rpc',                  // aquí estará disponible tu JSON-RPC
    app,
  });
  await mcp.connect(transport);    // monta el RPC sobre /rpc

  // 3. Endpoints adicionales (health, info)
  app.get('/health', (_req, res) => res.send('OK'));
  app.get('/', (_req, res) => {
    res.json({
      name: 'Tung Shing MCP Server',
      version: process.env.PACKAGE_VERSION || 'unknown',
      status: 'running',
    });
  });

  // 4. Arrancar HTTP
  const httpServer = createHttpServer(app);
  httpServer.listen(PORT, () => {
    console.log(`🚀 MCP HTTP listening on http://localhost:${PORT}/rpc`);
  });
})();