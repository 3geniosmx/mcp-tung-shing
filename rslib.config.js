import { defineConfig } from '@rslib/core';
import { version } from "./package.json";



export default defineConfig({
    lib: [
      {
        format: 'esm',
        syntax: 'es2021',
        dts: false,
        external: ['@modelcontextprotocol/sdk', 'dayjs', 'express'] // Agregar dependencias externas
      },
      {
        format: 'cjs',
        syntax: 'es2021',
        external: ['@modelcontextprotocol/sdk', 'dayjs', 'express'] // Agregar dependencias externas
      },

  ],
  source: {
    define: {
      'process.env.PACKAGE_VERSION': JSON.stringify(version),
    }
  }
});


