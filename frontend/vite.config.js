import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    command === 'build' && viteCompression() // only for production
  ],

  server: {
    port: 5173,
    proxy: {
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
  },

  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        }
      }
    }
  }
}))