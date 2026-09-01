import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Build optimization for production
  build: {
    // Increase chunk size warning limit (our app is legitimately large)
    chunkSizeWarningLimit: 600,

    // Use default Vite minification (esbuild is faster and built-in)
    minify: 'esbuild',

    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules/react')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/motion')) {
            return 'motion-vendor';
          }
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-vendor';
          }

          // Data layer chunk
          if (id.includes('/data/')) {
            return 'data-layer';
          }

          // Context chunk
          if (id.includes('/contexts/')) {
            return 'contexts';
          }
        },

        // Optimize chunk naming for caching
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
