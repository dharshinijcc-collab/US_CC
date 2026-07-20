import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'next/link': path.resolve(__dirname, './src/next-shims/link.tsx'),
      'next/navigation': path.resolve(__dirname, './src/next-shims/navigation.tsx'),
      'next/image': path.resolve(__dirname, './src/next-shims/image.tsx'),
      'next/font/google': path.resolve(__dirname, './src/next-shims/font.tsx'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    allowedHosts: ['www.cctps.com', 'cctps.com', '.onrender.com']
  },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_']
});
