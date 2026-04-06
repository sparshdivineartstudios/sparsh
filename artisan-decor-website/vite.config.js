import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Update this to your repository name wrapped in slashes
  base: '/',
  server: {
    port: 8080,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Optional: ensures an empty dist folder before every build
    emptyOutDir: true,
  }
})