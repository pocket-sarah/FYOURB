
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix: Define __dirname in ESM environment to resolve "Cannot find name '__dirname'" error
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Fix: Use the manually defined __dirname for path resolution
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    // Robust injection for browser environment to prevent hydration crashes
    'process.env': {
      // Fix: Adhere to exclusive process.env.API_KEY usage rule from GenAI guidelines
      API_KEY: JSON.stringify(process.env.API_KEY || ''),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    },
    // Failsafe global variable
    'global': 'window'
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    watch: {
      // CRITICAL FOR WSL: Windows-mounted filesystems (e.g. /mnt/c/) require polling
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
});
