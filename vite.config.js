import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json'
import { VitePWA } from 'vite-plugin-pwa';

const manifestForPlugin = {
  registerType: 'autoUpdate',
  devOptions: {
    enabled: true
  },
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
  manifest: {
    short_name: 'MedB',
    name: 'MedB!',
    description: 'Your trusted app for booking doctors, tracking health and managing medical records.',
    icons: [
      {
        src: 'public/icons/192x192.png',
        type: 'image/png',
        sizes: '192x192'
      },
      {
        src: 'public/icons/512x512.png',
        type: 'image/png',
        sizes: '512x512'
      }
    ],
    id: '/?source=pwa',
    start_url: '/?source=pwa',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    theme_color: '#6F64E7',
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  optimizeDeps: {
    exclude: ['sweetalert2'],
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});