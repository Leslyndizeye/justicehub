import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.app'],
    proxy: {
      '/api': {
        target: (loadEnv(mode, process.cwd(), 'VITE_API_URL').VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, ''),
        changeOrigin: true,
      },
    },
  }
}))
