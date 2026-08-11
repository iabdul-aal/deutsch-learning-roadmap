import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Absolute path for GitHub Pages — repo is served at /deutsch-learning-roadmap/
  base: '/deutsch-learning-roadmap/',

  server: {
    port: 3000,
    open: true,
  },

  build: {
    // Raise the warning threshold — our data layer is intentionally large (vocab DB)
    chunkSizeWarningLimit: 700,

    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          // React core — changes rarely, long-lived CDN cache
          'vendor-react': ['react', 'react-dom'],

          // Icon library — large but stable
          'vendor-icons': ['lucide-react'],

          // Data layer — curriculum + content DB + vocabulary (the large files)
          'data-content': [
            './src/data/contentRanking.ts',
            './src/data/tracks/german-a1-ar/curriculum.ts',
            './src/data/vocabulary/a1-core.ts',
          ],

          // Engine — pure logic, no UI deps
          'engine': [
            './src/engine/srs.ts',
            './src/engine/learnerModel.ts',
          ],
        },
      },
    },
  },

  // Path aliases for cleaner imports
  resolve: {
    alias: {
      '@': '/src',
      '@data': '/src/data',
      '@components': '/src/components',
      '@engine': '/src/engine',
      '@types': '/src/types',
    },
  },
})
