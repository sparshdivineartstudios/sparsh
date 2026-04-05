import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',   // required for GitHub Pages (relative paths)
  server: {
    port: 8080,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})

