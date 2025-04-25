import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import express from 'express';
import { createServer as createHttpServer } from 'http';

// Código de exploración de directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const nodeModulesPath = join(__dirname, '..', 'node_modules', '@modelcontextprotocol', 'sdk');

// Imprimir la estructura de carpetas para depuración
function exploreDir(dir, level = 0) {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const path = join(dir, file);
      try {
        const stats = fs.statSync(path);
        console.log(' '.repeat(level * 2) + file);
        if (stats.isDirectory()) {
          exploreDir(path, level + 1);
        }
      } catch (e) {
        console.log(' '.repeat(level * 2) + file + ' (error: ' + e.message + ')');
      }
    });
  } catch (e) {
    console.error(`Error explorando directorio ${dir}: ${e.message}`);
  }
}

console.log('Explorando estructura de carpetas del SDK:');
exploreDir(nodeModulesPath);

// Resto del código simplificado para pruebas
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

// Iniciar el servidor HTTP
httpServer.listen(PORT, () => {
  console.log(`Servidor de prueba iniciado en puerto ${PORT}`);
});