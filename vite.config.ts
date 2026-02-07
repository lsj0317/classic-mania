import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/classic-mania/",
  server: {
    proxy: {
      '/api/kopis': {
        target: 'http://www.kopis.or.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kopis/, ''),
      },
      '/api/naver': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/naver/, ''),
        secure: false,
      },
    },
  },
})