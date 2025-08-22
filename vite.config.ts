import react from '@vitejs/plugin-react';
import { fileURLToPath } from "url";
import { UserConfig, defineConfig } from "vite";
import eslint from 'vite-plugin-eslint2';
import stylelint from 'vite-plugin-stylelint';

const basePath = "/utbetaling/skattetrekk";

// https://vitejs.dev/config/
const buildConfig: UserConfig = {
  base: basePath,
  build: {
    outDir: './dist',
    target: 'esnext',
    rollupOptions: {
      input: {
        appBorger: "./index.html"
      }
    },
  },
  plugins: [
    react(),
    eslint(),
    stylelint({ fix: true }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {

    const devConfig: UserConfig = {
      base: basePath,
      build: {
        manifest: true,
        rollupOptions: {
          input: {
            appBorger: './index.html',
          }
        },
        target: 'esnext'
      },
      server: {
        open: '/index.html',
        proxy: {
          ...(mode === "mock" && {
            "/mockServiceWorker.js": {
              target: "http://localhost:5173",
              rewrite: () => "utbetaling/skattetrekk/mockServiceWorker.js",
            },
          }),
        },
      },
      plugins: [
        react(),
      ],
      resolve: {
        alias: {
          "@": fileURLToPath(new URL("./src", import.meta.url))
        }
      },
    };

    return devConfig;
  }

  return buildConfig;
});
