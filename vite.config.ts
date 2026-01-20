import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 레포지토리 이름이 classic-mania이므로 아래와 같이 설정합니다.
  base: "/classic/",
})