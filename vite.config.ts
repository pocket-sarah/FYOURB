
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false
  },
  define: {
    'process.env': {
      API_KEY: JSON.stringify(process.env.GEMINI_API_KEY || ''),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
    },
    'global': 'window'
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
