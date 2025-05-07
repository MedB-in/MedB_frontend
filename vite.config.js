import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['sweetalert2'],
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
