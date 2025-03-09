import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    hmr: {
      overlay: true,  // Error overlay
    },
    watch: {
      usePolling: true,  // For certain environments like WSL or Docker
    },
  },
})
