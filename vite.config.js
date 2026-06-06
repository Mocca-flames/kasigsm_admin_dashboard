import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/admin': {
        target: 'http://api.kasigsm.co.za:8000',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://api.kasigsm.co.za:8000',
        changeOrigin: true,
        secure: false,
      },
      '/wallet': {
        target: 'http://api.kasigsm.co.za:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
