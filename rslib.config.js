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
    ],
    // Agregar la configuración de lib
    lib: ['ES2021', 'DOM'],
    // Agregar la configuración del compilador
    compilerOptions: {
      target: 'ES2020',
      module: 'ESNext',
      moduleResolution: 'node',
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
      declaration: true
    }
  };