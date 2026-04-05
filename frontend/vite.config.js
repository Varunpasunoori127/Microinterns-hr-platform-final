import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls to backend (Spring Boot default port 8080)
      // This keeps the frontend origin as http://localhost:5173 while forwarding
      // /auth, /students, /cases, and other API requests to the backend during dev.
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/students': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/cases': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/csrf-token': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
}))
