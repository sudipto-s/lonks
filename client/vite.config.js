import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   build: {
      outDir: 'dist',
   },
   server: {
      proxy: {
         '/url': {
            target: 'http://localhost:5000',  // Your Express backend
            changeOrigin: true,
            secure: false,
         },
      },
  }
})