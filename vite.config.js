import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    // face-api bundles TensorFlow.js and is only loaded on the /room page
    chunkSizeWarningLimit: 1500,
  },
  server: { port: 3000 },
})
