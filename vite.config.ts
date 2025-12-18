import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = __dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
      '@github/spark/hooks': resolve(projectRoot, 'src/hooks/use-kv-mock.ts')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: false,
    // HMR comentado para desarrollo local (solo necesario con Docker/proxy)
     hmr: {
       clientPort: 8081,
     },
    watch: {
      usePolling: true,
    },
  },
});
