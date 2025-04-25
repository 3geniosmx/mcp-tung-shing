// mcp-server.js
const { StdioServerTransport } = require('@modelcontextprotocol/sdk');
const plugin = require('./dist/index.cjs').plugin;

async function startServer() {
  try {
    const transport = new StdioServerTransport();
    transport.registerPlugin(plugin);
    await transport.start();
    console.error('Tung Shing MCP server started');
  } catch (error) {
    console.error('Failed to start Tung Shing MCP server:', error);
    process.exit(1);
  }
}

startServer();