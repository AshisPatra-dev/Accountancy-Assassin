import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// OWNER-CONFIRM: Base path for GitHub Pages deployment
const BASE_PATH = process.env.BASE_PATH || '/accountancy-assassin/';

export default defineConfig({
  base: BASE_PATH,
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
