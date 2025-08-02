import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Получаем __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: './', // Корневая папка проекта
  
  // Точка входа - Vite автоматически найдет index.html
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        // Аналог webpack's filename с хешем
        entryFileNames: 'js/bundle.[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    target: 'es2015', // Поддержка современных браузеров
  },

  // Настройки для разработки
  server: {
    port: 3000,
    open: true, // Автоматически открыть браузер
    host: true, // Доступ по сети
  },

  // Обработка ассетов (аналог CopyPlugin)
  publicDir: 'assets/live', // Папка со статическими файлами
  
  // Настройки для импортов
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'assets'),
    }
  },

  // Плагины (build скрипты удалены - аудиоспрайты уже готовы)
  plugins: [],

  // Оптимизация
  optimizeDeps: {
    include: [
      'phaser', // Предварительно компилируем phaser
      'lodash',
      'axios'
    ]
  }
}); 