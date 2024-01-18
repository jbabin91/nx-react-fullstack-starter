/// <reference types='vitest' />
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig, loadEnv } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Configuration for building your library.
    // See: https://vitejs.dev/guide/build.html#library-mode
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      lib: {
        // Could also be a dictionary or array of multiple entry points.
        entry: 'src/index.ts',
        fileName: 'index',
        // Change this to the formats you want to support.
        // Don't forget to update your package.json as well.
        formats: ['es', 'cjs'],
        name: 'auth',
      },
      outDir: '../../dist/libs/auth',
      reportCompressedSize: true,
      rollupOptions: {
        // External packages that should not be bundled into your library.
        external: [],
      },
    },
    cacheDir: '../../node_modules/.vite/libs/auth',
    define: {
      'process.env': env,
    },
    plugins: [
      nxViteTsPaths(),
      dts({
        entryRoot: 'src',
        tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
      }),
    ],
    root: __dirname,
    test: {
      cache: {
        dir: '../../node_modules/.vitest',
      },
      coverage: {
        provider: 'v8',
        reportsDirectory: '../../coverage/libs/auth',
      },
      environment: 'node',
      globals: true,
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
    },
  };
});
