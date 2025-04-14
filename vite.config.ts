import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// @ts-ignore
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      // @ts-ignore
      "@": path.resolve(__dirname, "./src"),
      // @ts-ignore
      features: path.resolve(__dirname, 'src/features'),
      // @ts-ignore
      utils: path.resolve(__dirname, 'src/utils'),
      // @ts-ignore
      components: path.resolve(__dirname, 'src/components'),
    },
  },
})
