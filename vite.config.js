import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Keep React, React-DOM, React-Router, and Framer-Motion in the same chunk to prevent createContext / hook undefined errors
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('framer-motion')
            ) {
              return 'vendor-react-core';
            }

            // Other standalone libraries can stay split
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('@tanstack') || id.includes('axios')) {
              return 'vendor-query';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }

            return 'vendor-libs';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})

