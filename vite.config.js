import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Uses relative paths for seamless hosting under iabdul-aa.me/german/ or subfolders
  server: {
    port: 3000,
    open: true
  }
})
