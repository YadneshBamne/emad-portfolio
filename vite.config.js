import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('gsap') || id.includes('@gsap/react')) {
          return 'gsap'
        }

        if (id.includes('framer-motion')) {
          return 'framer'
        }

        if (
          id.includes('three') ||
          id.includes('@react-three/fiber') ||
          id.includes('@react-three/drei')
        ) {
          return 'three'
        }
      },
    },
  },

  minify: 'terser',

  terserOptions: {
    compress: {
      drop_console: false,
    },
  },

  chunkSizeWarningLimit: 500,
},
  // Optimization for development
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console'] : [],
  }
})