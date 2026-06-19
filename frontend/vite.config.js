import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy /api -> backend Express (evita problemas de CORS em dev).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
