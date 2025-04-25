#!/usr/bin/env node


import dayjs from 'dayjs';
import { PluginLunar } from 'dayjs-plugin-lunar';
// Importación simplificada

import { StdioServerTransport } from '@modelcontextprotocol/sdk';
import { createServer as createHttpServer } from 'http';

// 初始化日期插件
dayjs.extend(PluginLunar);

// 启动服务器
(async () => {
  try {
    const server = createHttpServer();
    const transport = new StdioServerTransport();
    await transport.start();
    console.error('Tung Shing MCP server started');
  } catch (error) {
    console.error('Failed to start Tung Shing MCP server:', error);
    process.exit(1);
  }
})();

export { createHttpServer as createServer };
export { default as plugin } from './plugin.js';