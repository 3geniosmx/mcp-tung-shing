import express from 'express';
import { createServer as createHttpServer } from 'http';
import { createServer } from './server.js';

// Para SSE (Server-Sent Events) como alternativa a WebSocket
import { SseServerTransport } from '@modelcontextprotocol/sdk/dist/esm/server/sse.js';

// Crear una aplicación Express
const app = express();
const PORT = process.env.PORT || 10000;

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
const mcpServer = createServer();

// Crear transporte SSE como alternativa a WebSocket
const sseTransport = new SseServerTransport();
sseTransport.onerror = (error) => {
  console.error('SSE error:', error);
};

// Conectar el MCP al transporte SSE
mcpServer.connect(sseTransport);

// Configurar las rutas de SSE
app.use('/sse', sseTransport.createExpressRouter());

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Tung Shing MCP server started on port ${PORT}`);
});