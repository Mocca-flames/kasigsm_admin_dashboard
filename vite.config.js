import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/admin': {
        target: 'https://3ac2-102-254-178-13.ngrok-free.app',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://3ac2-102-254-178-13.ngrok-free.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
