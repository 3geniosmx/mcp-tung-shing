import express from 'express';
import { createServer as createHttpServer } from 'http';
// Importar createServer de la forma correcta
import { createServer } from '../dist/index.js';

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

// Iniciar el servidor HTTP
httpServer.listen(PORT, () => {
  console.log(`Tung Shing MCP server started on port ${PORT}`);
});