import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Позволяет доступ извне контейнера
    port: 5173,
    watch: {
      usePolling: true // Для работы hot reload в Docker
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Отключаем source maps для продакшена
    minify: 'esbuild', // Используем esbuild вместо terser
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем vendor библиотеки для лучшего кэширования
          react: ['react', 'react-dom']
        }
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  }
})
