import express from 'express';
import { createServer as createHttpServer } from 'http';
import { createServer } from './server.js';

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

// Crear el servidor MCP (sin intentar conectarlo a un transporte por ahora)
const mcpServer = createServer();

// Agregar un endpoint para llamar herramientas MCP directamente
app.post('/api/mcp/tools/:name', async (req, res) => {
  try {
    const toolName = req.params.name;
    const toolArguments = req.body;
    
    // Simular una llamada MCP
    console.log(`Llamada a herramienta MCP: ${toolName}`, toolArguments);
    
    // Responder con los resultados
    res.json({
      status: 'success',
      data: {
        message: `Herramienta ${toolName} llamada con éxito`,
        // Aquí podrías llamar a funciones reales del servidor MCP
      }
    });
  } catch (error) {
    console.error('Error al llamar herramienta MCP:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Tung Shing MCP server started on port ${PORT}`);
});