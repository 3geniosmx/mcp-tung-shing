
  // src/plugin.js
  import { definePlugin } from '@modelcontextprotocol/sdk/server';
  import { getTungShing } from './logic/getTungShing';
// O
// import { getTungShing } from './logic/getTungShing.js';

export default definePlugin({
name: 'tung-shing',
  version: '1.7.1',
  tools: [
    {
      name: 'get-tung-shing',
      description: 'Calcula el almanac para X días',
      paramsSchema: { startDate: 'string', days: 'number', includeHours: 'boolean' },
      handler: getTungShing,
    },
    // …más herramientas
  ],
});




