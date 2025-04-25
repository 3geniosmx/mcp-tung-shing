import express from 'express';
import { createServer as createHttpServer } from 'http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebSocketServerTransport } from '@modelcontextprotocol/sdk/dist/esm/server/websocket.js';
import { plugin } from './plugin.js';

// Crear una aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint de salud
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Endpoint de información
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Tung Shing MCP Server',
    version: process.env.PACKAGE_VERSION || 'unknown',
    status: 'running'
  });
});

// Crear un servidor HTTP
const httpServer = createHttpServer(app);

// Crear el servidor MCP
const mcpServer = new McpServer({
  name: "Tung Shing MCP Server",
  version: process.env.PACKAGE_VERSION || "1.0.0",
});

// Usar el plugin
mcpServer.use(plugin);

// Crear transporte WebSocket
const wsTransport = new WebSocketServerTransport();

// Agregar manejo de errores
wsTransport.onerror = (error) => {
  console.error("Error en el transporte:", error);
};

// Conectar el servidor al transporte
mcpServer.connect(wsTransport).catch((error) => {
  console.error("Error al conectar el servidor:", error);
  process.exit(1);
});

// Configurar el transporte WebSocket para escuchar en el servidor HTTP
wsTransport.listen(httpServer);

// Manejar el cierre limpio
process.on('SIGINT', async () => {
  await mcpServer.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mcpServer.close();
  process.exit(0);
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Tung Shing MCP server started on port ${PORT}`);
});