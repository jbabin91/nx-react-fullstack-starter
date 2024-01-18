/// <reference types='vitest' />
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      outDir: '../../dist/apps/frontend',
      reportCompressedSize: true,
    },
    cacheDir: '../../node_modules/.vite/apps/frontend',
    plugins: [react(), nxViteTsPaths(), TanStackRouterVite()],
    preview: {
      host: 'localhost',
      port: 4300,
    },
    root: __dirname,
    server: {
      host: true,
      open: mode === 'development',
      port: 4200,
      proxy: {
        '^/trpc': {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/trpc/, ''),
          target: env['API_URL']
            ? `${env['API_URL']}/trpc`
            : 'http://localhost:3333/trpc',
        },
      },
    },
    test: {
      cache: {
        dir: '../../node_modules/.vitest',
      },
      coverage: {
        provider: 'v8',
        reportsDirectory: '../../coverage/apps/frontend',
      },
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
    },
  };
});
