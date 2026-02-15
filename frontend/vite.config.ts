
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  define: {
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || ''),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    },
    'global': 'window'
  },
  server: {
    port: 3000,
    host: '127.0.0.1', // Local binding for tunnel pickup
    watch: {
        usePolling: true,
        interval: 100
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
