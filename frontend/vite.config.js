import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from "url"

// 👇 recreate __dirname for ESM (this part is PERFECT)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],

  // ✅ ALIAS MUST BE HERE (TOP LEVEL)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    port: 3000,
    https: false,
    proxy: {
      "/api": {
        target: "https://localhost:5001",
        // target: "https://localhost:8080",
        
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
