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
    // Optimize bundle for animations
    rollupOptions: {
      output: {
        manualChunks: {
          'gsap': ['gsap', '@gsap/react'],
          'framer': ['framer-motion'],
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
        }
      }
    },
    // Better minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
      }
    },
    // Optimal chunk size
    chunkSizeWarningLimit: 500,
  },
  // Optimization for development
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console'] : [],
  }
})