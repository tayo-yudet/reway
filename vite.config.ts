import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages のプロジェクトページ（https://<user>.github.io/reway/）で
  // アセットを正しいサブパスから読み込むためのベースパス。
  base: '/reway/',
  plugins: [react()],
})
