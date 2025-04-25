export default {
    entry: ['src/index.ts'],
    out: 'dist',
    esm: true,
    cjs: true,
    dts: true,
    external: [
      '@modelcontextprotocol/sdk',
      'dayjs',
      'express',
      'zod',
      'zod-to-json-schema',
      'ws'
    ]
  };