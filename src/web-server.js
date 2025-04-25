import express from 'express';
import { createServer as createHttpServer } from 'http';
import { WebSocketServerTransport } from '@modelcontextprotocol/sdk/server/websocket.js';
import { createServer } from './server.js';  // Nota: añade .js aquí

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
const mcpServer = createServer();

// Crear transporte WebSocket
const wsTransport = new WebSocketServerTransport();
wsTransport.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Conectar el MCP al transporte WebSocket
mcpServer.connect(wsTransport);
wsTransport.listen(httpServer);

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Tung Shing MCP server started on port ${PORT}`);
});