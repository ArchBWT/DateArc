import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/datearc/',
  plugins: [react()],
  server: {
    proxy: {
      '/yandex-api/suggest': {
        target: 'https://suggest-maps.yandex.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yandex-api\/suggest/, '/v1/suggest'),
      },
      '/yandex-api/geocode': {
        target: 'https://geocode-maps.yandex.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yandex-api\/geocode/, '/v1/'),
      },
    },
  },
})
