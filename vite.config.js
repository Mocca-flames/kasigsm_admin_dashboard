import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/admin': {
        target: 'https://b686-102-253-152-3.ngrok-free.app',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://b686-102-253-152-3.ngrok-free.app',
        changeOrigin: true,
        secure: false,
      },
      '/wallet': {
        target: 'https://b686-102-253-152-3.ngrok-free.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
